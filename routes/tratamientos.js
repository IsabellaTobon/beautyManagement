const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta para obtener todos los tratamientos
router.get('/', (req, res) => {
    db.query('SELECT * FROM tratamientos', (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener tratamientos' });
        res.json(rows);
    });
});

// Ruta para agregar un nuevo tratamiento
router.post('/', (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    db.query(
        'INSERT INTO tratamientos (nombre, descripcion, precio) VALUES (?, ?, ?)',
        [nombre, descripcion, precio],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al agregar tratamiento' });
            res.status(201).json({ message: 'Tratamiento agregado con éxito' });
        }
    );
});

// Ruta para actualizar un tratamiento
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;
    db.query(
        'UPDATE tratamientos SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?',
        [nombre, descripcion, precio, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar tratamiento' });
            res.json({ message: 'Tratamiento actualizado con éxito' });
        }
    );
});

// Ruta para eliminar un tratamiento
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tratamientos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar tratamiento' });
        res.json({ message: 'Tratamiento eliminado con éxito' });
    });
});

module.exports = router;
