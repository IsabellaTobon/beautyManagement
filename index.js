const express = require('express');
const app = express();
const port = 3000;
const db = require('./db'); // Importa la conexion desde db.js
const cors = require('cors');

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la Gestión de la Peluqería!');
});

// Rutas CRUD para clientes
const clientesRouter = require('./routes/clientes');
app.use('/clientes', clientesRouter);

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});