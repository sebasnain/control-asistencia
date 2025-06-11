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
          li.innerHTML = `${"📌"} ${tarea.titulo} - ${tarea.estado == "enviado" ? "➡️" : "⚠️"} ${tarea.estado}  - ${"📅"} ${tarea.fechaCreacion.toDate().toLocaleDateString()} <br> ${"Descripción:"} ${tarea.descripcion}`;
          li.className = "listaStyle";

          // Mostrar calificación si existe
          db.collection("tareasEnviadas")
            .where("alumnoId", "==", user.uid)
            .where("tareaId", "==", doc.id)
            .get()
            .then((querySnapshot) => {
              let yaEnviada = false;
              let entregaDocId = null;
              let linkActual = "";
              let estadoDeTarea = "sin calificar";
              if (!querySnapshot.empty) {
                yaEnviada = true;
                const tareaEnviada = querySnapshot.docs[0].data();
                entregaDocId = querySnapshot.docs[0].id;
                linkActual = tareaEnviada.link || "";
                estadoDeTarea = tareaEnviada.estadoDeTarea || "sin calificar";
              }

              // Mostrar calificación
              const calificacion = document.createElement("h3");
              calificacion.textContent = `Calificación: ${estadoDeTarea}`;
              li.appendChild(calificacion);

              // Botón enviar o editar
              if (!yaEnviada) {
                const boton = document.createElement("button");
                boton.textContent = "enviar tarea";
                boton.className = "button";
                boton.addEventListener("click", () => {
                  const link = prompt("agregar link de la tarea");
                  if (!link) {
                    alert("Por favor, ingresa un link válido.");
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
                    estadoDeTarea: "sin calificar"
                  }).then(() => {
                    // Recargar la lista para reflejar el cambio
                    // (opcional: puedes usar onSnapshot en tareasEnviadas para hacerlo reactivo)
                  });
                });
                li.appendChild(boton);
              } else {
                const editarBoton = document.createElement("button");
                editarBoton.textContent = "Editar link";
                editarBoton.className = "button";
                editarBoton.addEventListener("click", () => {
                  const nuevoLink = prompt("Nuevo link de la tarea:", linkActual);
                  if (!nuevoLink) {
                    alert("Por favor, ingresa un link válido.");
                    return;
                  }
                  // Actualizar el link en tareasEnviadas
                  db.collection("tareasEnviadas").doc(entregaDocId).update({
                    link: nuevoLink
                  });
                  // (Opcional) Actualizar también en tareas si quieres
                  db.collection("tareas").doc(doc.id).update({
                    link: nuevoLink
                  });
                });
                li.appendChild(editarBoton);
              }

              tareasList.appendChild(li);
            });
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
          editarDatos.style.display = "none"; // Ocultar al guardar
        });
      });
    });

    // --- Mostrar/ocultar edición de datos personales ---
    const buttonEditarPerfil = document.getElementById("buttonEditarPerfil");
    const editarDatos = document.getElementById("editar-datos-personales");
    const cerrarEdicion = document.getElementById("cerrar-edicion");

    buttonEditarPerfil.addEventListener("click", () => {
      editarDatos.style.display = "block";
    });

    cerrarEdicion.addEventListener("click", () => {
      editarDatos.style.display = "none";
    });

  } else {
    // Si no está autenticado, redirige al login
    window.location.href = "loginAlumno.html";
  }
db.collection("alumnos").doc(user.uid).get().then(doc => {
  if (doc.exists) {
    const datos = doc.data();
    if (datos.edad) document.getElementById('edad').value = datos.edad;
    if (datos.carrera) document.getElementById('carrera').value = datos.carrera;
    if (datos.nombre) document.getElementById('nombre').value = datos.nombre;
    if (datos.apellido) document.getElementById('apellido').value = datos.apellido;

    // Mostrar en los spans del perfil
    document.getElementById('nombrePerfil').textContent = datos.nombre || "";
    document.getElementById('apellidoPerfil').textContent = datos.apellido || "";
    document.getElementById('edadPerfil').textContent = datos.edad ? `Edad: ${datos.edad}` : "";
    document.getElementById('carreraPerfil').textContent = datos.carrera ? `Carrera: ${datos.carrera}` : "";
  }
});
  
});