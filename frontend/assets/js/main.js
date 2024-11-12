document.addEventListener("DOMContentLoaded", function() {
    mostrarSeccion('clientes'); // Mostrar la sección de clientes por defecto
});

function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        seccion.classList.remove('active');
    });

    const seccion = document.getElementById(seccionId);
    if (seccion) {
        seccion.classList.add('active');
    }
}

function mostrarSubseccion(subseccionId) {
    const subsecciones = document.querySelectorAll('.subseccion');
    subsecciones.forEach(subseccion => {
        subseccion.classList.remove('active');
    });

    const subseccion = document.getElementById(subseccionId);
    if (subseccion) {
        subseccion.classList.add('active');
    }
}

// Función para agregar un nuevo cliente
const formAgregarCliente = document.getElementById("formAgregarCliente");
if (formAgregarCliente) {
    formAgregarCliente.addEventListener("submit", async function(e) {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const apellidos = document.getElementById("apellidos").value;
        const telefono = document.getElementById("telefono").value;
        const notas = document.getElementById("notas").value;

        try {
            const response = await fetch(`${baseUrl}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellidos, telefono, notas })
            });
            if (!response.ok) {
                throw new Error('Error al agregar cliente: ' + response.statusText);
            }
            obtenerClientes(); // Actualiza la lista
            e.target.reset();
        } catch (error) {
            console.error('Error al agregar cliente:', error);
        }
    });
}

// Función para obtener y mostrar los clientes
async function obtenerClientes() {
    try {
        const respuesta = await fetch(`${baseUrl}/clientes`);
        const clientes = await respuesta.json();
        const tbody = document.querySelector("#tablaClientes tbody");
        if (!tbody) return;
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
    } catch (error) {
        console.error('Error al obtener clientes:', error);
    }
}

// Función para eliminar un cliente
async function eliminarCliente(id) {
    try {
        await fetch(`${baseUrl}/clientes/${id}`, { method: 'DELETE' });
        obtenerClientes();
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
    }
}