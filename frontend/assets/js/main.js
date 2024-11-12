document.addEventListener("DOMContentLoaded", function() {
    obtenerClientes();
    cargarTratamientos();
    cargarCitas();
});

// URL base del backend
const baseUrl = 'http://localhost:3000';

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
            await fetch(`${baseUrl}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellidos, telefono, notas })
            });
            obtenerClientes(); // Actualiza la lista
            e.target.reset();
        } catch (error) {
            console.error('Error al agregar cliente:', error);
        }
    });
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

// Función para obtener y mostrar tratamientos
function cargarTratamientos() {
    fetch(`${baseUrl}/tratamientos`)
        .then(response => response.json())
        .then(data => {
            const tablaTratamientos = document.getElementById('tablaTratamientos');
            if (!tablaTratamientos) return;
            tablaTratamientos.innerHTML = '';
            data.forEach(tratamiento => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${tratamiento.nombre}</td>
                    <td>${tratamiento.descripcion}</td>
                    <td>${tratamiento.precio}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarTratamiento(${tratamiento.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarTratamiento(${tratamiento.id})">Eliminar</button>
                    </td>
                `;
                tablaTratamientos.appendChild(fila);
            });
        })
        .catch(error => console.error('Error al cargar tratamientos:', error));
}

// Función para agregar un nuevo tratamiento
const formAgregarTratamiento = document.getElementById('formAgregarTratamiento');
if (formAgregarTratamiento) {
    formAgregarTratamiento.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombreTratamiento').value;
        const descripcion = document.getElementById('descripcionTratamiento').value;
        const precio = document.getElementById('precioTratamiento').value;

        fetch(`${baseUrl}/tratamientos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion, precio })
        })
        .then(() => {
            cargarTratamientos();
            formAgregarTratamiento.reset();
        })
        .catch(error => console.error('Error al agregar tratamiento:', error));
    });
}

// Función para eliminar un tratamiento
async function eliminarTratamiento(id) {
    try {
        await fetch(`${baseUrl}/tratamientos/${id}`, { method: 'DELETE' });
        cargarTratamientos();
    } catch (error) {
        console.error('Error al eliminar tratamiento:', error);
    }
}

// Función para obtener y mostrar citas
function cargarCitas() {
    fetch(`${baseUrl}/citas`)
        .then(response => response.json())
        .then(data => {
            const tablaCitas = document.getElementById('tablaCitas');
            if (!tablaCitas) return;
            tablaCitas.innerHTML = '';
            data.forEach(cita => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${cita.nombre_cliente}</td>
                    <td>${cita.telefono_cliente}</td>
                    <td>${cita.tratamiento}</td>
                    <td>${cita.descripcion}</td>
                    <td>${cita.precio}</td>
                    <td>${cita.metodo_pago}</td>
                    <td>${cita.fecha}</td>
                `;
                tablaCitas.appendChild(fila);
            });
        })
        .catch(error => console.error('Error al cargar citas:', error));
}

// Función para agregar una nueva cita
const formAgregarCita = document.getElementById('formAgregarCita');
if (formAgregarCita) {
    formAgregarCita.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre_cliente = document.getElementById('nombreCliente').value;
        const telefono_cliente = document.getElementById('telefonoCliente').value;
        const tratamiento = document.getElementById('tratamiento').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;
        const metodo_pago = document.getElementById('metodoPago').value;
        const fecha = document.getElementById('fecha').value;

        fetch(`${baseUrl}/citas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_cliente, telefono_cliente, tratamiento, descripcion, precio, metodo_pago, fecha })
        })
        .then(() => {
            cargarCitas();
            formAgregarCita.reset();
        })
        .catch(error => console.error('Error al agregar cita:', error));
    });
}
