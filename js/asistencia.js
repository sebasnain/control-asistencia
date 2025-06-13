console.log("confirmando asistencia...");

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contraseña = document.getElementById("contraseña").value;
    const permisoUbicacion = document.getElementById("permisosDeGeolocalizacion").checked;

    try {
        // 1. Autenticar a los alumnos
        const userCredential = await firebase.auth().signInWithEmailAndPassword(usuario, contraseña);
        const user = userCredential.user;

        // 2. Validar que el usuario esté en la colección "alumnos"
        const alumnoDoc = await firebase.firestore().collection("alumnos").doc(user.uid).get();
        if (!alumnoDoc.exists) throw new Error("Usuario no registrado como alumno");

        const alumnoData = alumnoDoc.data();

        // 3. Obtener los parámetros de la URL
        const params = new URLSearchParams(window.location.search);
        const carrera = params.get("carrera") || alumnoData.carrera;
        const fecha = params.get("fecha") || new Date().toLocaleDateString();

        if (!carrera || !fecha) throw new Error("Faltan datos de la clase");

        // 4. Validar geolocalización si corresponde
        let ubicacionOk = true;
        if (permisoUbicacion) {
            ubicacionOk = await verificarUbicacion();
        }
        if (!ubicacionOk) throw new Error("Estás fuera del establecimiento");

        // 5. Guardar asistencia en listaDeAsistencia
        await firebase.firestore().collection("listaDeAsistencia").add({
            alumno: `${alumnoData.nombre} ${alumnoData.apellido}`,
            alumnoId: user.uid,
            carrera: carrera,
            fecha: fecha,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        // 6. Mostrar alerta de éxito
        alert("¡Asistencia registrada correctamente!");
    } catch (error) {
        console.error(error);
        alert(error.message || "Error al registrar asistencia");
    }
});

async function verificarUbicacion() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                // Coordenadas del establecimiento de la 35
               // const LAT_ESTABLECIMIENTO = -46.797844944780614;
                //const LNG_ESTABLECIMIENTO = -67.96987942883565;
                
                //direccio de prueba -46.797333218303926, -67.95110526289031
                const LAT_ESTABLECIMIENTO = -46.797333218303926;
                const LNG_ESTABLECIMIENTO = -67.95110526289031;
                const distancia = calcularDistancia(lat, lng, LAT_ESTABLECIMIENTO, LNG_ESTABLECIMIENTO);

                // Si está a menos de 100 metros, OK
                resolve(distancia <= 0.1);
            },
            (err) => {
                console.error("Error al obtener ubicación", err);
                resolve(false);
            }
        );
    });
}

// Fórmula de Haversine para calcular distancia en km
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
}