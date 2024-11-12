const express = require('express');
const app = express();
const port = 3000;
const db = require('./db'); // Importa la conexion desde db.js
const cors = require('cors');

// Middleware para parsear JSON
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la Gestión de la Peluqería!');
});

// Rutas CRUD para clientes
const clientesRouter = require('./routes/clientes');
app.use('/clientes', clientesRouter);

// Rutas CRUD para tratamientos
const tratamientosRouter = require('./routes/tratamientos');
app.use('/tratamientos', tratamientosRouter);

// Rutas CRUD para citas
const citasRouter = require('./routes/citas');
app.use('/citas', citasRouter);

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});