console.log("generando qr de asistencia...");

// Mostrar la fecha actual en formato YYYY-MM-DD
document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date();
  const fechaFormateada = hoy.toISOString().split('T')[0];
  document.getElementById("fechaHoy").textContent = fechaFormateada;
});

document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();

  const carrera = document.getElementById("carrera").value;
  const fecha = document.getElementById("fechaHoy").textContent;

  if (!carrera) {
    alert("Seleccioná una carrera.");
    return;
  }

  const urlAsistencia = `https://tusitio.com/asistencia.html?carrera=${encodeURIComponent(carrera)}&fecha=${fecha}`;

  generarQR(urlAsistencia);
});

function generarQR(texto) {
  const contenedor = document.getElementById("containerQR");
  contenedor.innerHTML = ""; // Limpiar si hay uno anterior

  QRCode.toCanvas(texto, { width: 250 }, function (err, canvas) {
    if (err) console.error(err);
    contenedor.innerHTML = ""; // Limpiar si hay uno anterior
    contenedor.appendChild(canvas);
  });
}
