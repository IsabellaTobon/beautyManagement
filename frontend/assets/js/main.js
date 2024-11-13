const baseUrl = 'http://localhost:3000';

document.addEventListener("DOMContentLoaded", function() {
    configurarBusquedaClientes();
    obtenerClientes(); // Llamada inicial para cargar la lista de clientes
    cargarCitas(); // Llamada inicial para cargar la lista de citas

    const formAgregarCita = document.getElementById("formAgregarCita");
    if (formAgregarCita) {
        formAgregarCita.addEventListener("submit", async function(e) {
            e.preventDefault();
            const nombre_cliente = document.getElementById("nombreCliente").value;
            const apellidos_cliente = document.getElementById("apellidosCliente").value;
            const telefono_cliente = document.getElementById("telefonoCliente").value;
            const tratamiento = document.getElementById("tratamiento").value;
            const descripcion = document.getElementById("descripcion").value;
            const precio = document.getElementById("precio").value;
            const metodo_pago = document.getElementById("metodoPago").value;
            const fecha = document.getElementById("fecha").value;
            const total_pagado = document.getElementById("totalPagado").value;

            // Validar que todos los campos requeridos estén completos
            if (!nombre_cliente || !apellidos_cliente || !telefono_cliente || !tratamiento || !precio || !metodo_pago || !fecha) {
                alert('Por favor, complete todos los campos requeridos.');
                return;
            }

            try {
                const response = await fetch(`${baseUrl}/citas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre_cliente, apellidos_cliente, telefono_cliente, fecha, tratamiento, descripcion, precio, total_pagado, metodo_pago })
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

    const formEditarCita = document.getElementById("formEditarCita");
    if (formEditarCita) {
        formEditarCita.addEventListener("submit", async function(e) {
            e.preventDefault();
            const id = document.getElementById("editarCitaId").value;
            const nombre_cliente = document.getElementById("editarNombreCliente").value;
            const apellidos_cliente = document.getElementById("editarApellidosCliente").value;
            const telefono_cliente = document.getElementById("editarTelefonoCliente").value;
            const tratamiento = document.getElementById("editarTratamiento").value;
            const descripcion = document.getElementById("editarDescripcion").value;
            const precio = document.getElementById("editarPrecio").value;
            const metodo_pago = document.getElementById("editarMetodoPago").value;
            const fecha = document.getElementById("editarFecha").value;
            const editarTotalPagado = document.getElementById("editarTotalPagado").value;

            // Validar que todos los campos requeridos estén completos
            if (!nombre_cliente || !apellidos_cliente || !telefono_cliente || !tratamiento || !precio || !metodo_pago || !fecha) {
                alert('Por favor, complete todos los campos requeridos.');
                return;
            }

            try {
                const response = await fetch(`${baseUrl}/citas/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre_cliente, apellidos_cliente, telefono_cliente, fecha, tratamiento, descripcion, precio, total_pagado: editarTotalPagado, metodo_pago })
                });
                if (!response.ok) {
                    throw new Error('Error al actualizar cita: ' + response.statusText);
                }
                cargarCitas(); // Actualiza la lista
                e.target.reset();
                const modalEditarCita = bootstrap.Modal.getInstance(document.getElementById('modalEditarCita'));
                modalEditarCita.hide();
            } catch (error) {
                console.error('Error al actualizar cita:', error);
            }
        });
    }
});

function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.container-custom');
    secciones.forEach(seccion => seccion.classList.add('d-none'));

    const seccion = document.getElementById(seccionId);
    if (seccion) seccion.classList.remove('d-none');
}

function configurarBusquedaClientes() {
    const buscarClienteInput = document.getElementById('buscarCliente');
    if (!buscarClienteInput) return; // Verificar si el elemento existe

    const resultadosBusqueda = document.getElementById('resultadosBusqueda');
    let timeout;

    buscarClienteInput.addEventListener('input', async function() {
        clearTimeout(timeout);
        const query = buscarClienteInput.value;
        if (query.length < 2) {
            resultadosBusqueda.innerHTML = '';
            return;
        }

        timeout = setTimeout(async () => {
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
        }, 300);
    });
}

function seleccionarCliente(cliente) {
    document.getElementById('nombreCliente').value = cliente.nombre;
    document.getElementById('apellidosCliente').value = cliente.apellidos;
    document.getElementById('telefonoCliente').value = cliente.telefono;
    document.getElementById('resultadosBusqueda').innerHTML = '';
}

// Función para obtener y mostrar las citas
async function cargarCitas() {
    try {
        const respuesta = await fetch(`${baseUrl}/citas`);
        const citas = await respuesta.json();
        console.log('Citas recibidas:', citas); // Verifica la respuesta del servidor
        const tbody = document.querySelector("#tablaCitas tbody");
        if (!tbody) return;
        tbody.innerHTML = ""; // Limpiar la tabla
        citas.forEach(cita => {
            console.log('Cita:', cita); // Verifica cada cita individualmente
            const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-ES'); // Formatear la fecha
            tbody.innerHTML += `
                <tr>
                    <td>${cita.nombre_cliente}</td>
                    <td>${cita.apellidos_cliente}</td>
                    <td>${cita.telefono_cliente}</td>
                    <td>${cita.tratamiento}</td>
                    <td>${cita.descripcion}</td>
                    <td>${cita.precio}</td>
                    <td>${cita.metodo_pago}</td>
                    <td>${fechaFormateada}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="abrirModalEditarCita(${cita.id})"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarCita(${cita.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error al cargar citas:', error);
    }
}

// Función para eliminar una cita
async function eliminarCita(id) {
    try {
        const response = await fetch(`${baseUrl}/citas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar cita: ' + response.statusText);
        }
        cargarCitas(); // Actualiza la lista
    } catch (error) {
        console.error('Error al eliminar cita:', error);
    }
}

// Función para abrir el modal de editar cita con los datos de la cita seleccionada
async function abrirModalEditarCita(id) {
    try {
        const response = await fetch(`${baseUrl}/citas/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos de la cita: ' + response.statusText);
        }
        const cita = await response.json();
        
        if (!cita) {
            throw new Error('No se encontraron datos para la cita con ID: ' + id);
        }

        console.log('Datos de la cita:', cita);

        document.getElementById('editarCitaId').value = cita.id || '';
        document.getElementById('editarNombreCliente').value = cita.nombre_cliente || '';
        document.getElementById('editarApellidosCliente').value = cita.apellidos_cliente || '';
        document.getElementById('editarTelefonoCliente').value = cita.telefono_cliente || '';
        document.getElementById('editarTratamiento').value = cita.tratamiento || '';
        document.getElementById('editarDescripcion').value = cita.descripcion || '';
        document.getElementById('editarPrecio').value = cita.precio || '';
        document.getElementById('editarMetodoPago').value = cita.metodo_pago || '';
        document.getElementById('editarFecha').value = cita.fecha || '';
        document.getElementById('editarTotalPagado').value = cita.total_pagado || '';

        const modalEditarCita = new bootstrap.Modal(document.getElementById('modalEditarCita'));
        modalEditarCita.show();
    } catch (error) {
        console.error('Error al obtener datos de la cita:', error);
    }
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
                    <td>${cliente.telefono || 'N/D'}</td>
                    <td>${cliente.notas || 'N/D'}</td>
                    <td>${cliente.ultima_cita || 'N/D'}</td>
                    <td>${cliente.ultimo_tratamiento || 'N/D'}</td>
                    <td>${cliente.precio_ultima_cita || 'N/D'}</td>
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
        const response = await fetch(`${baseUrl}/clientes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar cliente: ' + response.statusText);
        }
        obtenerClientes(); // Actualiza la lista
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
    }
}
