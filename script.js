function getDatos() {
  const datos = localStorage.getItem("palets");
  return datos ? JSON.parse(datos) : { entregas: [], devoluciones: [] };
}

function guardarDatos(datos) {
  localStorage.setItem("palets", JSON.stringify(datos));
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
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      guardarDatos(data);
      alert("Datos restaurados correctamente.");
      location.reload();
    } catch (error) {
      alert("Error al importar los datos.");
    }
  };
  reader.readAsText(file);
}
