
function getDatos() {
    const datos = localStorage.getItem("palets");
    return datos ? JSON.parse(datos) : { entregas: [], devoluciones: [] };
}

function guardarDatos(datos) {
    localStorage.setItem("palets", JSON.stringify(datos));
}

function registrarEntrega() {
    const cliente = document.getElementById("clienteEntrega").value;
    const cantidad = parseInt(document.getElementById("cantidadEntrega").value, 10);
    if (!cliente || isNaN(cantidad)) {
        alert("Completa todos los campos.");
        return;
    }
    const datos = getDatos();
    datos.entregas.push({ cliente, cantidad, fecha: new Date().toISOString() });
    guardarDatos(datos);
    alert("Entrega registrada");
}

function registrarDevolucion() {
    const cliente = document.getElementById("clienteDevolucion").value;
    const cantidad = parseInt(document.getElementById("cantidadDevolucion").value, 10);
    if (!cliente || isNaN(cantidad)) {
        alert("Completa todos los campos.");
        return;
    }
    const datos = getDatos();
    datos.devoluciones.push({ cliente, cantidad, fecha: new Date().toISOString() });
    guardarDatos(datos);
    alert("Devolución registrada");
}

function exportBackup() {
    const data = localStorage.getItem("palets") || "{}";
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup_palets.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importBackup() {
    const file = document.getElementById("importFile").files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem("palets", JSON.stringify(data));
            alert("Datos restaurados correctamente.");
        } catch (err) {
            alert("Error al importar datos.");
        }
    };
    reader.readAsText(file);
}

window.onload = function () {
    if (!localStorage.getItem("palets")) {
        guardarDatos({ entregas: [], devoluciones: [] });
    }

    const ctx = document.getElementById("chart").getContext("2d");
    const datos = getDatos();
    const entregas = datos.entregas.map(e => e.cantidad);
    const devoluciones = datos.devoluciones.map(d => d.cantidad);
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Entr 1", "Entr 2", "Entr 3", "Dev 1", "Dev 2"],
            datasets: [
                {
                    label: "Entregas",
                    data: entregas.slice(-5),
                    backgroundColor: "#60a5fa"
                },
                {
                    label: "Devoluciones",
                    data: devoluciones.slice(-5),
                    backgroundColor: "#3b82f6"
                }
            ]
        }
    });
};
