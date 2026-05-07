const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET /api/jobs — obtener todos los trabajos disponibles
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('creado_en', { ascending: false })

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json(data)
})

// POST /api/jobs — publicar un trabajo nuevo (solo clientes)
router.post('/', async (req, res) => {
    const { titulo, descripcion, pago, cliente_id } = req.body

    if (!titulo || !descripcion || !pago || !cliente_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const { data, error } = await supabase
        .from('jobs')
        .insert({ titulo, descripcion, pago, cliente_id })
        .select()

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json({ mensaje: 'Trabajo publicado correctamente', job: data[0] })
})

// DELETE /api/jobs/:id — eliminar un trabajo
router.delete('/:id', async (req, res) => {
    const { id } = req.params

    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json({ mensaje: 'Trabajo eliminado correctamente' })
})

module.exports = router