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

    // validar que la tarea no sea vacía
    if (!titulo || !descripcion) {
      console.error("Título y descripción son requeridos");
        alert("Por favor, completa el título y la descripción de la tarea.");
      return;
    }

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

//agregar un animacion para que la lista aparezca con un efecto y desaparezca con otro efecto


document.getElementById("listadetareas").addEventListener("click", function() {
    let presionado = true;
    if (presionado) {
      document.getElementById("tareas-list").className = "listaDeTareas"; // Mostrar la lista de tareas
      presionado = false;
    } else {
      document.getElementById("tareas-list").className = "listadeTareaOculta"; // Ocultar la lista de tareas
      presionado = true;
    }
  
  const db = firebase.firestore();
  db.collection("tareas").get().then(snapshot => {
    snapshot.forEach(doc => {
      const tarea = doc.data();
      console.log(tarea);
      const li = document.createElement("li");
      li.style.listStyleType = "none"; 
      li.textContent = `${"📌"} ${tarea.titulo} ${"➡️"} ${tarea.descripcion}`;
      document.getElementById("tareas-list").appendChild(li);
    });
  });

  document.getElementById("tareas-list").innerHTML = "";

});

////###########/escuchar la lista de alumnos
function mostrarAlumnosPorCarrera(carrera) {
  document.getElementById("alumnos-list").innerHTML = "";
  document.getElementById("lista-tareas-alumno").innerHTML = "";

  db.collection("alumnos").where("carrera", "==", carrera).get().then(snapshot => {
    snapshot.forEach(doc => {
      const alumno = doc.data();
      const liAlumno = document.createElement("li");
      liAlumno.className = "listaStyle";
      liAlumno.textContent = `👤 ${alumno.nombre} ${alumno.apellido} `;

      const boton = document.createElement("button");
      boton.textContent = "Abrir Tareas";
      boton.className = "button";
      boton.addEventListener("click", function() {
        const tareasList = document.getElementById("lista-tareas-alumno");
        tareasList.innerHTML = "";

        // Botón cerrar tareas
        const botonCerrar = document.createElement("button");
        botonCerrar.textContent = "Cerrar Tareas";
        botonCerrar.className = "button";
        botonCerrar.style.marginBottom = "10px";
        botonCerrar.addEventListener("click", function() {
          tareasList.innerHTML = "";
        });
        tareasList.appendChild(botonCerrar);

        db.collection("tareasEnviadas").where("alumnoId", "==", doc.id).get().then(snapshot => {
          if (snapshot.empty) {
            const li = document.createElement("li");
            li.textContent = "No hay tareas enviadas por este alumno.";
            tareasList.appendChild(li);
          }
          snapshot.forEach(doc => {
            const tarea = doc.data();
            const li = document.createElement("li");
            li.className = "listaDeTareasPorAlumno";
            let fecha = "";
            if (tarea.fechaEnvio && tarea.fechaEnvio.toDate) {
              fecha = tarea.fechaEnvio.toDate().toLocaleDateString();
            }
            li.innerHTML = `📌 ${tarea.nombre || ""} - ${tarea.titulo || ""} - ${tarea.descripcion || ""} - 📅fecha de envio: ${fecha} - <a href="${tarea.link || "#"}" target="_blank"><button class="button">Ver tarea 🔗</button></a>`;

            // Botón aprobar
            const aprobarBoton = document.createElement("button");
            aprobarBoton.textContent = "Aprobar";
            aprobarBoton.className = "button";
            aprobarBoton.style.backgroundColor = "green";
            aprobarBoton.addEventListener("click", () => {
              db.collection("tareasEnviadas").doc(doc.id).update({
                estadoDeTarea: "Aprobado ✅"
              }).then(() => {
                estadoDeLaTarea.textContent = "Aprobado ✅";
              });
            });

            // Botón rechazar
            const rechazarBoton = document.createElement("button");
            rechazarBoton.textContent = "Rechazar";
            rechazarBoton.className = "button";
            rechazarBoton.style.backgroundColor = "red";
            rechazarBoton.addEventListener("click", () => {
              db.collection("tareasEnviadas").doc(doc.id).update({
                estadoDeTarea: "Rechazado ❌"
              }).then(() => {
                estadoDeLaTarea.textContent = "Rechazado ❌";
              });
            });

            // Estado de la tarea
            const estadoDeLaTarea = document.createElement("span");
            estadoDeLaTarea.textContent = tarea.estadoDeTarea || "";

            li.appendChild(aprobarBoton);
            li.appendChild(rechazarBoton);
            li.appendChild(estadoDeLaTarea);
            tareasList.appendChild(li);
          });
        });
      });
      liAlumno.appendChild(boton);
      document.getElementById("alumnos-list").appendChild(liAlumno);
    });
  });
}

document.getElementById("AlumnosMantenimiento").addEventListener("click", function() {
  mostrarAlumnosPorCarrera("Mantenimiento Industrial");
});

document.getElementById("AlumnosRedes").addEventListener("click", function() {
  mostrarAlumnosPorCarrera("Redes Eléctricas");
});