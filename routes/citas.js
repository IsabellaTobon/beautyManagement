const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db');

// Ruta para obtener todas las citas o filtrar por fecha
router.get('/', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    let query = `
        SELECT 
            citas.*, 
            clientes.nombre AS nombre_cliente, 
            clientes.apellidos AS apellidos_cliente, 
            clientes.telefono AS telefono_cliente 
        FROM citas 
        JOIN clientes ON citas.cliente_id = clientes.id
    `;
    let params = [];

    if (fechaInicio && fechaFin) {
        query += ' WHERE citas.fecha BETWEEN ? AND ?';
        params = [fechaInicio, fechaFin];
    }

    db.query(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener citas' });
        console.log('Citas obtenidas:', rows); // Verifica la respuesta del servidor
        res.json(rows);
    });
});

// Ruta para registrar una nueva cita
router.post(
    '/',
    [
        body('cliente_id').isInt().withMessage('El ID del cliente es requerido y debe ser un número entero'),
        body('fecha').isISO8601().withMessage('La fecha es requerida y debe estar en formato ISO 8601'),
        body('tratamiento').notEmpty().withMessage('El tratamiento es requerido'),
        body('descripcion').optional().isString(),
        body('precio').isFloat({ gt: 0 }).withMessage('El precio es requerido y debe ser un número mayor que 0'),
        body('total_pagado').optional().isFloat({ gt: 0 }).withMessage('El total pagado debe ser un número mayor que 0'),
        body('metodo_pago').notEmpty().withMessage('El método de pago es requerido')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { cliente_id, fecha, tratamiento, descripcion, precio, total_pagado, metodo_pago } = req.body;
        const query = 'INSERT INTO citas (cliente_id, fecha, tratamiento, descripcion, precio, total_pagado, metodo_pago) VALUES (?, ?, ?, ?, ?, ?, ?)';

        const params = [cliente_id, fecha, tratamiento, descripcion, precio, total_pagado, metodo_pago];

        db.query(query, params, (err, result) => {
            if (err) {
                console.error('Error al registrar la cita:', err);
                return res.status(500).json({ error: 'Error al registrar la cita' });
            }

            // Actualizar la ficha del cliente con los datos de la última cita
            const updateQuery = 'UPDATE clientes SET ultima_cita = ?, ultimo_tratamiento = ?, precio_ultima_cita = ? WHERE id = ?';
            const updateParams = [fecha, tratamiento, precio, cliente_id];

            db.query(updateQuery, updateParams, (err, result) => {
                if (err) {
                    console.error('Error al actualizar ficha del cliente:', err);
                    return res.status(500).json({ error: 'Error al actualizar ficha del cliente' });
                }
                res.status(201).json({ message: 'Cita registrada y ficha del cliente actualizada' });
            });
        });
    }
);

// Ruta para obtener una cita por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT 
            citas.*, 
            clientes.nombre AS nombre_cliente, 
            clientes.apellidos AS apellidos_cliente, 
            clientes.telefono AS telefono_cliente 
        FROM citas 
        JOIN clientes ON citas.cliente_id = clientes.id
        WHERE citas.id = ?
    `;
    db.query(query, [id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener la cita' });
        if (rows.length === 0) return res.status(404).json({ error: 'Cita no encontrada' });
        res.json(rows[0]);
    });
});

// Ruta para eliminar una cita
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM citas WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la cita:', err);
            return res.status(500).json({ error: 'Error al eliminar la cita' });
        }
        res.status(200).json({ message: 'Cita eliminada correctamente' });
    });
});

// Ruta para actualizar una cita
router.put(
    '/:id',
    [
        body('cliente_id').isInt().withMessage('El ID del cliente es requerido y debe ser un número entero'),
        body('fecha').isISO8601().withMessage('La fecha es requerida y debe estar en formato ISO 8601'),
        body('tratamiento').notEmpty().withMessage('El tratamiento es requerido'),
        body('descripcion').optional().isString(),
        body('precio').isFloat({ gt: 0 }).withMessage('El precio es requerido y debe ser un número mayor que 0'),
        body('total_pagado').optional().isFloat({ gt: 0 }).withMessage('El total pagado debe ser un número mayor que 0'),
        body('metodo_pago').notEmpty().withMessage('El método de pago es requerido')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { cliente_id, fecha, tratamiento, descripcion, precio, total_pagado, metodo_pago } = req.body;
        const query = 'UPDATE citas SET cliente_id = ?, fecha = ?, tratamiento = ?, descripcion = ?, precio = ?, total_pagado = ?, metodo_pago = ? WHERE id = ?';
        const params = [cliente_id, fecha, tratamiento, descripcion, precio, total_pagado, metodo_pago, id];

        db.query(query, params, (err, result) => {
            if (err) {
                console.error('Error al actualizar la cita:', err);
                return res.status(500).json({ error: 'Error al actualizar la cita' });
            }
            res.status(200).json({ message: 'Cita actualizada correctamente' });
        });
    }
);

module.exports = router;
