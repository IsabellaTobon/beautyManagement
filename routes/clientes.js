const express = require('express');
const { body, validationResult, param } = require('express-validator');
const router = express.Router();
const db = require('../db'); // Importa la conexion desde db.js

// Rutas CRUD para clientes

// Ruta para obtener todos los clientes
router.get('/', (req, res) => {
    db.query('SELECT * FROM clientes', (err, rows) => {
        if(err) {
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
        body('telefono').isMobilePhone().withMessage('Teléfono no válido'),
        body('notas').optional().isString(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre, apellidos, telefono, notas } = req.body;
        const query = 'INSERT INTO clientes (nombre, apellidos, telefono, notas) VALUES (?, ?, ?, ?)';
        db.query(query, [nombre, apellidos, telefono, notas], (err, result) => {
            if (err) {
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
        body('nombre').isString().notEmpty().withMessage('Nombre es requerido'),
        body('apellidos').isString().notEmpty().withMessage('Apellidos son requeridos'),
        body('telefono').isMobilePhone().withMessage('Teléfono no válido'),
        body('notas').optional().isString(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nombre, apellidos, telefono, notas } = req.body;
        const query = 'UPDATE clientes SET nombre = ?, apellidos = ?, telefono = ?, notas = ? WHERE id = ?';
        db.query(query, [nombre, apellidos, telefono, notas, id], (err, result) => {
            if (err) {
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
    const query = 'DELETE FROM clientes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send('Error al eliminar el cliente');
        } else {
            res.status(200).send('Cliente eliminado con éxito');
        }
    });
});

module.exports = router;