
function getDatos() {
  const datos = localStorage.getItem("palets");
  return datos ? JSON.parse(datos) : { entregas: [], devoluciones: [] };
}
function guardarDatos(datos) {
  localStorage.setItem("palets", JSON.stringify(datos));
}
function registrarEntrega() {
  const cliente = document.getElementById("clienteEntrega").value;
  const cantidad = parseInt(document.getElementById("cantidadEntrega").value);
  if (cliente && cantidad > 0) {
    const datos = getDatos();
    datos.entregas.push({ cliente, cantidad, fecha: new Date().toISOString() });
    guardarDatos(datos);
    alert("Entrega guardada");
    actualizarUI();
  }
}
function registrarDevolucion() {
  const cliente = document.getElementById("clienteDevolucion").value;
  const cantidad = parseInt(document.getElementById("cantidadDevolucion").value);
  if (cliente && cantidad > 0) {
    const datos = getDatos();
    datos.devoluciones.push({ cliente, cantidad, fecha: new Date().toISOString() });
    guardarDatos(datos);
    alert("Devolución guardada");
    actualizarUI();
  }
}
function exportBackup() {
  const data = getDatos();
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup_palets.json";
  a.click();
}
function importBackup() {
  const file = document.getElementById("importFile").files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      guardarDatos(data);
      alert("Datos restaurados correctamente.");
      location.reload();
    } catch (err) {
      alert("Error al importar datos.");
    }
  };
  reader.readAsText(file);
}
function actualizarUI() {
  const datos = getDatos();
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Entregas", "Devoluciones"],
      datasets: [{
        label: "Movimientos",
        data: [datos.entregas.length, datos.devoluciones.length],
        backgroundColor: ["green", "blue"]
      }]
    }
  });

  const historial = [...datos.entregas.map(e => `Entrega - ${e.cliente} (${e.cantidad})`), 
                     ...datos.devoluciones.map(d => `Devolución - ${d.cliente} (${d.cantidad})`)];
  document.getElementById("listaHistorial").innerHTML = historial.map(item => `<li>${item}</li>`).join("");

  const saldos = {};
  datos.entregas.forEach(e => saldos[e.cliente] = (saldos[e.cliente] || 0) + e.cantidad);
  datos.devoluciones.forEach(d => saldos[d.cliente] = (saldos[d.cliente] || 0) - d.cantidad);
  document.getElementById("listaSaldos").innerHTML = Object.entries(saldos).map(
    ([cliente, saldo]) => `<li>${cliente}: ${saldo}</li>`).join("");
}
function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(div => div.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
window.onload = function () {
  if (!localStorage.getItem("palets")) {
    guardarDatos({ entregas: [], devoluciones: [] });
  }
  mostrarSeccion("dashboard");
  actualizarUI();
};
