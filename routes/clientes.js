const express = require('express');
const { body, validationResult, param } = require('express-validator');
const router = express.Router();
const db = require('../db'); // Importa la conexion desde db.js

// Rutas CRUD para clientes

// Ruta para obtener todos los clientes
router.get('/', (req, res) => {
    db.query('SELECT * FROM clientes', (err, rows) => {
        if (err) {
            console.error('Error al obtener los clientes:', err);
            res.status(500).send('Error al obtener los clientes');
        } else {
            res.json(rows);
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
        body('nombre_apellido').isString().notEmpty().withMessage('Nombre y Apellido son requeridos'),
        body('telefono').optional().isMobilePhone().withMessage('Teléfono no válido'),
        body('notas').optional().isString(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre_apellido, telefono, notas } = req.body;
        const query = 'INSERT INTO gestion_peluqueria.clientes (nombre_apellido, telefono, ultima_cita, ultimo_tratamiento, precio_ultima_cita, notas) VALUES (?, ?, NULL, NULL, NULL, ?)';
        db.query(query, [nombre_apellido, telefono, notas], (err, result) => {
            if (err) {
                console.error('Error al agregar cliente:', err);
                res.status(500).send('Error al agregar cliente');
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
        body('nombre_apellido').isString().notEmpty().withMessage('Nombre y Apellido son requeridos'),
        body('telefono').optional().isMobilePhone().withMessage('Teléfono no válido'),
        body('notas').optional().isString(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nombre_apellido, telefono, notas } = req.body;
        const query = 'UPDATE gestion_peluqueria.clientes SET nombre_apellido = ?, telefono = ?, notas = ? WHERE id = ?';
        db.query(query, [nombre_apellido, telefono, notas, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar el cliente:', err);
                res.status(500).send('Error al actualizar el cliente');
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
            res.status(500).send('Error al eliminar el cliente');
        } else {
            res.status(200).send('Cliente eliminado con éxito');
        }
    });
});

module.exports = router;