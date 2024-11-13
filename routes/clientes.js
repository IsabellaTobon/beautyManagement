const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const router = express.Router();
const db = require('../db'); // Importa la conexion desde db.js

// Rutas CRUD para clientes

// Ruta para obtener todos los clientes o buscar clientes
router.get('/', query('search').optional().isString(), (req, res) => {
    const search = req.query.search;
    let queryStr = 'SELECT * FROM clientes';
    let queryParams = [];

    if (search) {
        queryStr += ' WHERE nombre LIKE ? OR apellidos LIKE ?';
        queryParams = [`%${search}%`, `%${search}%`];
    }

    db.query(queryStr, queryParams, (err, rows) => {
        if (err) {
            console.error('Error al obtener los clientes:', err);
            res.status(500).send('Error al obtener los clientes');
        } else {
            res.json(rows);
        }
    });
});

// Ruta para obtener detalles del cliente, incluyendo última cita, tratamiento y precio pagado
router.get('/detalles/:id', param('id').isInt(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Consulta para obtener detalles del cliente junto con la última cita, tratamiento y precio pagado
    const queryStr = `
        SELECT c.nombre, c.apellidos, c.telefono, c.notas,
            a.fecha AS ultima_cita, t.servicio AS ultimo_tratamiento, a.precio AS precio_ultima_cita
        FROM gestion_peluqueria.clientes AS c
        LEFT JOIN gestion_peluqueria.citas AS a ON a.cliente_id = c.id
        LEFT JOIN gestion_peluqueria.tratamientos AS t ON a.tratamiento_id = t.id
        WHERE c.id = ?
        ORDER BY a.fecha DESC
        LIMIT 1;
    `;

    db.query(queryStr, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener los detalles del cliente:', err);
            res.status(500).send('Error al obtener los detalles del cliente');
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Cliente no encontrado' });
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta para obtener un cliente por ID
router.get('/:id', param('id').isInt(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el cliente:', err);
            res.status(500).send('Error al obtener el cliente');
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Cliente no encontrado' });
        } else {
            res.json(results[0]);
        }
    });
});

// Ruta para agregar un cliente
router.post(
    '/',
    [
        body('nombre').isString().notEmpty().withMessage('Nombre es requerido'),
        body('apellidos').isString().notEmpty().withMessage('Apellidos son requeridos'),
        body('telefono').optional().isMobilePhone().withMessage('Teléfono no válido'),
        body('notas').optional().isString(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre, apellidos, telefono, notas } = req.body;
        const query = 'INSERT INTO gestion_peluqueria.clientes (nombre, apellidos, telefono, ultima_cita, ultimo_tratamiento, precio_ultima_cita, notas) VALUES (?, ?, ?, NULL, NULL, NULL, ?)';
        db.query(query, [nombre, apellidos, telefono, notas], (err, result) => {
            if (err) {
                console.error('Error al agregar cliente:', err);
                res.status(500).send('Error al agregar cliente: ' + err.message);
            } else {
                res.status(201).send('Cliente agregado con éxito');
            }
        });
    }
);

// Ruta para actualizar un cliente
router.put(
    '/:id',
    [
        param('id').isInt(),
        body('nombre').isString().notEmpty().withMessage('Nombre es requerido'),
        body('apellidos').isString().notEmpty().withMessage('Apellidos son requeridos'),
        body('telefono').optional().isMobilePhone().withMessage('Teléfono no válido'),
        body('notas').optional().isString(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nombre, apellidos, telefono, notas } = req.body;
        const query = 'UPDATE gestion_peluqueria.clientes SET nombre = ?, apellidos = ?, telefono = ?, notas = ? WHERE id = ?';
        db.query(query, [nombre, apellidos, telefono, notas, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar el cliente:', err);
                res.status(500).send('Error al actualizar el cliente: ' + err.message);
            } else {
                res.status(200).send('Cliente actualizado con éxito');
            }
        });
    }
);

// Ruta para eliminar un cliente
router.delete('/:id', param('id').isInt(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const query = 'DELETE FROM gestion_peluqueria.clientes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el cliente:', err);
            res.status(500).send('Error al eliminar el cliente: ' + err.message);
        } else {
            res.status(200).send('Cliente eliminado con éxito');
        }
    });
});

module.exports = router;