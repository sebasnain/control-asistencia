console.log("desde loginAlumno.js");

const auth = firebase.auth();
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Registrar usuario al enviar el formulario de registro
// Solo un event listener, lógica corregida

document.getElementById("form-registro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("nuevoUsuario").value;
    const password = document.getElementById("nuevaContrasena").value;

    try {
        // Crear usuario en Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        // Agregar a la colección alumnos
        await db.collection("alumnos").doc(user.uid).set({
            UIDalumno: user.uid, // <--- nuevo campo
            email: email,
            nombre: "",
            apellido: "",
            carrera: "",
            edad: ""
        });
        alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
        document.getElementById("registro-container").style.display = "none";
    } catch (error) {
        alert("Error al registrar usuario: " + error.message);
        console.error(error);
    }
});

// Mostrar el formulario de registro al presionar el botón "registrarme"
document.getElementById("nuevoRegistro").addEventListener("click", () => {
    const registroContainer = document.getElementById("registro-container");
    registroContainer.style.display = registroContainer.style.display === "none" ? "block" : "none";
});

// Iniciar sesión al enviar el formulario de login
// (Formulario con id 'form-login')
document.querySelector('#form-login form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión...');
    const email = document.getElementById('usuario').value;
    const password = document.getElementById('contrasena').value;
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        // Verificar si el usuario está en la colección alumnos
        const doc = await db.collection('alumnos').doc(user.uid).get();
        if (doc.exists) {
            alert('Inicio de sesión exitoso');
            window.location.href = 'alumno.html';
        } else {
            alert('No tienes acceso como alumno.');
            await auth.signOut();
        }
    } catch (error) {
        alert('Error al iniciar sesión: ' + error.message);
        console.error(error);
    }
});
