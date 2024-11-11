// URL base del backend
const baseUrl = 'http://localhost:3000';

// Función para obtener y mostrar los clientes
async function obtenerClientes() {
    const respuesta = await fetch(`${baseUrl}/clientes`);
    const clientes = await respuesta.json();
    const tbody = document.querySelector("#tablaClientes tbody");
    tbody.innerHTML = ""; // Limpiar la tabla
    clientes.forEach(cliente => {
        tbody.innerHTML += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellidos}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.notas}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Función para agregar un nuevo cliente
document.getElementById("formAgregarCliente").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const telefono = document.getElementById("telefono").value;
    const notas = document.getElementById("notas").value;

    await fetch(`${baseUrl}/clientes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, apellidos, telefono, notas })
    });

    obtenerClientes(); // Actualiza la lista
    e.target.reset();
});

// Función para eliminar un cliente
async function eliminarCliente(id) {
    await fetch(`${baseUrl}/clientes/${id}`, { method: 'DELETE' });
    obtenerClientes();
}

// Cargar clientes al inicio
obtenerClientes();
