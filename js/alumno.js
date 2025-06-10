console.log("desde alumnos");
const db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // --- Mostrar tareas asignadas ---
    db.collection("tareas")
      .onSnapshot((snapshot) => {
        const tareasList = document.getElementById("tareas-list");
        tareasList.innerHTML = ""; // Limpiar la lista actual

        snapshot.forEach((doc) => {
          const tarea = doc.data();
          const li = document.createElement("li");
          li.textContent = `${tarea.titulo} - ${tarea.estado} - ${tarea.descripcion} - ${tarea.fechaCreacion.toDate().toLocaleDateString()}`;
          tareasList.appendChild(li);

          /////////////////////////probando
           const calificacion = document.createElement("h3");
           //tengo que traer informacion de la tabla tareasEnviadas
           db.collection("tareasEnviadas").where("tareaId", "==", doc.id).get().then(snapshot => {
             snapshot.forEach(doc => {
               const tareaEnviada = doc.data();
               calificacion.textContent = `Calificación: ${tareaEnviada.estadoDeTarea || "sin calificar"}`;
               li.appendChild(calificacion);
             });
           });


           ///////////////////////////////////////////
          const boton = document.createElement("button");
          boton.textContent = "enviar tarea";
          boton.addEventListener("click", () => {
            const link = prompt("agregar link de la tarea"); //validar que se mande un link
            //crear el boton de editar
                const editarBoton = document.createElement("button");
                editarBoton.textContent = "Editar link";
                editarBoton.addEventListener("click", () => {
                  const nuevoLink = prompt("Nuevo link de la tarea:", link || "");
                  if (!nuevoLink) {
                    alert("Por favor, ingresa un link válido.");
                    return;
                  }
                  // Actualizar el link en tareasEnviadas
                  db.collection("tareasEnviadas").doc(entregaDoc.id).update({
                    link: nuevoLink
                  });
                  // (Opcional) Actualizar también en tareas si quieres
                  db.collection("tareas").doc(doc.id).update({
                    link: nuevoLink
                  });
                });
                // Agregar el botón de editar al li
                li.appendChild(editarBoton);



                /////////////////////////////////////////////
            if (!link) {
              alert("Por favor, ingresa un link válido.");
              return;
            }
            // Verificar si ya existe una entrega para esta tarea y este alumno
            db.collection("tareasEnviadas")
              .where("alumnoId", "==", user.uid)
              .where("tareaId", "==", doc.id)
              .get()
              .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                  alert("Ya enviaste esta tarea. Si necesitas editar el link, usa el botón de editar.");
                  return;
                }

                // Cambiar estado a enviado
                db.collection("tareas").doc(doc.id).update({
                  titulo: tarea.titulo,
                  descripcion: tarea.descripcion,
                  estado: "enviado",
                  link: link
                });



                

                // Guardar en tareasEnviadas
                db.collection("tareasEnviadas").add({
                  titulo: tarea.titulo,
                  descripcion: tarea.descripcion,
                  alumnoId: user.uid,
                  nombre: user.displayName,
                  tareaId: doc.id,
                  link: link,
                  fechaEnvio: new Date(),
                  estadoDeTarea: "sin calificar" // Estado inicial de la tarea enviada
                });
              });
          });
          tareasList.appendChild(boton);
        });
      });

    // --- Manejo de datos personales ---
    const form = document.getElementById('datos-personales-form');
    const mensaje = document.getElementById('mensaje-guardado');

    // Cargar datos personales si existen
    db.collection("alumnos").doc(user.uid).get().then(doc => {
      if (doc.exists) {
        const datos = doc.data();
        if (datos.edad) document.getElementById('edad').value = datos.edad;
        if (datos.carrera) document.getElementById('carrera').value = datos.carrera;
        if (datos.nombre) document.getElementById('nombre').value = datos.nombre;
        if (datos.apellido) document.getElementById('apellido').value = datos.apellido;
      }
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const apellido = document.getElementById('apellido').value;
      const edad = document.getElementById('edad').value;
      const carrera = document.getElementById('carrera').value;

      // Generar el array de tareas enviadas y luego guardar los datos personales
      db.collection("tareasEnviadas").where("alumnoId", "==", user.uid).get().then(snapshot => {
        const tareasEnviadas = [];
        snapshot.forEach(doc => {
          const tarea = doc.data();
          tareasEnviadas.push(tarea);
        });

        db.collection("alumnos").doc(user.uid).set({
          edad: edad,
          carrera: carrera,
          email: user.email,
          nombre: nombre,
          apellido: apellido,
          tareasEnviadas: tareasEnviadas
        }, { merge: true }).then(() => {
          mensaje.textContent = "Datos guardados correctamente.";
        });
      });
    });
    

  } else {
    // Si no está autenticado, redirige al login
    window.location.href = "loginAlumno.html";
  }
});