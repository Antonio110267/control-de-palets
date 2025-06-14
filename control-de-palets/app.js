
// app.js - Lógica principal para Control de Palets

document.addEventListener("DOMContentLoaded", () => {
  const movimientos = JSON.parse(localStorage.getItem("movimientos") || "[]");
  const clientes = JSON.parse(localStorage.getItem("clientes") || "[]");

  // Funciones utilitarias
  const guardarDatos = () => {
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
    localStorage.setItem("clientes", JSON.stringify(clientes));
  };

  const registrarEntrega = (cliente, normales, color, fecha = new Date().toISOString().split("T")[0]) => {
    movimientos.push({ tipo: "ENTREGA", cliente, normales, color, fecha });
    guardarDatos();
  };

  const registrarDevolucion = (cliente, normales, color, fecha = new Date().toISOString().split("T")[0]) => {
    movimientos.push({ tipo: "DEVOLUCION", cliente, normales: -normales, color: -color, fecha });
    guardarDatos();
  };

  const calcularSaldos = () => {
    const saldos = {};
    movimientos.forEach(({ cliente, normales, color }) => {
      if (!saldos[cliente]) saldos[cliente] = { normales: 0, color: 0 };
      saldos[cliente].normales += normales;
      saldos[cliente].color += color;
    });
    return saldos;
  };

  const exportarJSON = () => {
    const datos = { movimientos, clientes };
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "respaldo_palets.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importarJSON = (archivo) => {
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const datos = JSON.parse(lector.result);
        if (datos.movimientos && datos.clientes) {
          localStorage.setItem("movimientos", JSON.stringify(datos.movimientos));
          localStorage.setItem("clientes", JSON.stringify(datos.clientes));
          alert("Importación exitosa.");
          location.reload();
        }
      } catch {
        alert("Archivo no válido.");
      }
    };
    lector.readAsText(archivo);
  };

  // Exponer funciones globales para conectarlas al HTML
  window.registrarEntrega = registrarEntrega;
  window.registrarDevolucion = registrarDevolucion;
  window.calcularSaldos = calcularSaldos;
  window.exportarJSON = exportarJSON;
  window.importarJSON = importarJSON;
});
