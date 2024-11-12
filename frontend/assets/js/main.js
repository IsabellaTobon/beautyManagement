const baseUrl = 'http://localhost:3000';

document.addEventListener("DOMContentLoaded", function() {
    configurarBusquedaClientes();
});

function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.container-custom');
    secciones.forEach(seccion => {
        seccion.classList.add('d-none');
    });

    const seccion = document.getElementById(seccionId);
    if (seccion) {
        seccion.classList.remove('d-none');
    }
}

function configurarBusquedaClientes() {
    const buscarClienteInput = document.getElementById('buscarCliente');
    const resultadosBusqueda = document.getElementById('resultadosBusqueda');

    buscarClienteInput.addEventListener('input', async function() {
        const query = buscarClienteInput.value;
        if (query.length < 2) {
            resultadosBusqueda.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/clientes?search=${query}`);
            const clientes = await response.json();
            resultadosBusqueda.innerHTML = '';
            clientes.forEach(cliente => {
                const item = document.createElement('a');
                item.href = '#';
                item.classList.add('list-group-item', 'list-group-item-action');
                item.textContent = `${cliente.nombre} ${cliente.apellidos}`;
                item.addEventListener('click', () => seleccionarCliente(cliente));
                resultadosBusqueda.appendChild(item);
            });
        } catch (error) {
            console.error('Error al buscar clientes:', error);
        }
    });
}

function seleccionarCliente(cliente) {
    document.getElementById('nombreCliente').value = cliente.nombre;
    document.getElementById('apellidosCliente').value = cliente.apellidos;
    document.getElementById('telefonoCliente').value = cliente.telefono;
    document.getElementById('resultadosBusqueda').innerHTML = '';
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

// Función para agregar una nueva cita
const formAgregarCita = document.getElementById("formAgregarCita");
if (formAgregarCita) {
    formAgregarCita.addEventListener("submit", async function(e) {
        e.preventDefault();
        const nombre_cliente = document.getElementById("nombreCliente").value;
        const telefono_cliente = document.getElementById("telefonoCliente").value;
        const tratamiento = document.getElementById("tratamiento").value;
        const descripcion = document.getElementById("descripcion").value;
        const precio = document.getElementById("precio").value;
        const metodo_pago = document.getElementById("metodoPago").value;
        const fecha = document.getElementById("fecha").value;

        try {
            const response = await fetch(`${baseUrl}/citas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_cliente, telefono_cliente, tratamiento, descripcion, precio, metodo_pago, fecha })
            });
            if (!response.ok) {
                throw new Error('Error al agregar cita: ' + response.statusText);
            }
            cargarCitas(); // Actualiza la lista
            e.target.reset();
        } catch (error) {
            console.error('Error al agregar cita:', error);
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

// Función para obtener y mostrar las citas
async function cargarCitas() {
    try {
        const respuesta = await fetch(`${baseUrl}/citas`);
        const citas = await respuesta.json();
        const tbody = document.querySelector("#tablaCitas tbody");
        if (!tbody) return;
        tbody.innerHTML = ""; // Limpiar la tabla
        citas.forEach(cita => {
            tbody.innerHTML += `
                <tr>
                    <td>${cita.nombre_cliente}</td>
                    <td>${cita.telefono_cliente}</td>
                    <td>${cita.tratamiento}</td>
                    <td>${cita.descripcion}</td>
                    <td>${cita.precio}</td>
                    <td>${cita.metodo_pago}</td>
                    <td>${cita.fecha}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error al cargar citas:', error);
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