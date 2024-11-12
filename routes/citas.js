const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta para obtener todas las citas o filtrar por fecha
router.get('/', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    let query = 'SELECT * FROM citas';
    let params = [];

    if (fechaInicio && fechaFin) {
        query += ' WHERE fecha BETWEEN ? AND ?';
        params = [fechaInicio, fechaFin];
    }

    db.query(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener citas' });
        res.json(rows);
    });
});

// Ruta para registrar una nueva cita
router.post('/', (req, res) => {
    const { nombre_cliente, telefono_cliente, tratamiento, descripcion, precio, metodo_pago, fecha } = req.body;

    db.query(
        'INSERT INTO citas (nombre_cliente, telefono_cliente, tratamiento, descripcion, precio, metodo_pago, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre_cliente, telefono_cliente, tratamiento, descripcion, precio, metodo_pago, fecha],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al registrar la cita' });
            res.status(201).json({ message: 'Cita registrada con éxito' });
        }
    );
});

module.exports = router;
