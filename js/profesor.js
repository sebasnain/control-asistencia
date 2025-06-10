console.log("profesor");

// Inicializa Firestore (usa la instancia global)
const db = firebase.firestore();

async function agregarNuevaTarea(titulo, descripcion) {
  try {
    // Datos de la nueva tarea
    const nuevaTarea = {
        alumno: "",
      titulo: titulo,
      descripcion: descripcion,
      estado: "pendiente", // Estado inicial de la tarea
      fechaCreacion: new Date(),
      link: ""
    };

    // Agrega el documento a la colección 'tareas'
    const docRef = await db.collection('tareas').add(nuevaTarea);

    console.log("¡Documento de tarea escrito con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al añadir documento: ", e);
  }
}

document.getElementById("agregar-tarea").addEventListener("click", function() {
  console.log("Botón de agregar tarea presionado");
  const titulo = prompt("Título de la tarea:");
  const descripcion = prompt("Descripción de la tarea:");
  agregarNuevaTarea(titulo, descripcion);
});


//escuchar la lista de alumnos
document.getElementById("AlumnosMantenimiento").addEventListener("click", function() {
  console.log("Botón de Alumnos de Mantenimiento presionado");
  //traer la lista de la coleccion alumnos pero filtrando por carrera
  const db = firebase.firestore();
  db.collection("alumnos").where("carrera", "==", "Mantenimiento Industrial").get().then(snapshot => {
    snapshot.forEach(doc => {
      const alumno = doc.data();
      document.getElementById("alumnos-list").innerHTML += `<li>${alumno.nombre} ${alumno.apellido} - ${"abrir tareas del alumno:"}</li>`; //en vez de un texto quiero un boton que me lleve a las tareas del alumno
        const boton = document.createElement("button");
        boton.textContent = "Abrir Tareas";
        boton.addEventListener("click", function() {
          // Aquí puedes agregar la lógica para abrir las tareas del alumno
          //traer de la base de datos el array de tareas
            const tareasList = document.getElementById("tareas-list");
            tareasList.innerHTML = ""; // Limpiar la lista actual

            db.collection("tareasEnviadas").where("alumnoId", "==", doc.id).get().then(snapshot => {
                //si no hay tareas enviadas, mostrar un mensaje
                if (snapshot.empty) {
                  const li = document.createElement("li");
                  li.textContent = "No hay tareas enviadas por este alumno.";
                  tareasList.appendChild(li);
                }
              snapshot.forEach(doc => {
                const tarea = doc.data();
                console.log( tarea);
                const li = document.createElement("li"); //asignarle color: white; background-color: blue; padding: 10px; border-radius: 5px;
                li.style.color = "white";
                li.style.backgroundColor = "grey";
                li.style.padding = "10px";
                li.style.borderRadius = "5px";
                let fecha = "";
if (tarea.fechaEnvio && tarea.fechaEnvio.toDate) {
  fecha = tarea.fechaEnvio.toDate().toLocaleDateString();
}
li.textContent = `${tarea.nombre || ""} - ${tarea.titulo || ""} - ${tarea.descripcion || ""} - ${fecha} - ${tarea.link || ""}`;
                li.innerHTML = `${tarea.nombre || ""} - ${tarea.titulo || ""} - ${tarea.descripcion || ""} - ${"fecha de envio:"} ${fecha} - <a  href="${tarea.link || "#"}" target="_blank"> <button>Ver tarea</button></a>`;
                // ${tarea.estado} 

                // crear dos botones aprobar y rechazar
                const aprobarBoton = document.createElement("button");
                aprobarBoton.textContent = "Aprobar";
                aprobarBoton.addEventListener("click", () => {
                  db.collection("tareasEnviadas").doc(doc.id).update({
                    estadoDeTarea: "aprobado" 
                  });
                });

                const rechazarBoton = document.createElement("button");
                rechazarBoton.textContent = "Rechazar";
                rechazarBoton.addEventListener("click", () => {
                  db.collection("tareasEnviadas").doc(doc.id).update({
                    estadoDeTarea: "rechazado"
                  });
                });

                li.appendChild(aprobarBoton);
                li.appendChild(rechazarBoton);
                tareasList.appendChild(li);
              });
            });
        });
        document.getElementById("alumnos-list").appendChild(boton);
    });
  });
});

document.getElementById("AlumnosRedes").addEventListener("click", function() {
  console.log("Botón de Alumnos de Redes presionado");
  //traer la lista de la coleccion alumnos pero filtrando por carrera
  const db = firebase.firestore();
  db.collection("alumnos").where("carrera", "==", "Redes Eléctricas").get().then(snapshot => {
    snapshot.forEach(doc => {
      const alumno = doc.data();
      console.log("Alumno de Redes:", alumno);
    });
  });
});
