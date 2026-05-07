const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET /api/mensajes/:trabajo_id — obtener mensajes de un trabajo
router.get('/:trabajo_id', async (req, res) => {
    const { trabajo_id } = req.params

    const { data, error } = await supabase
        .from('mensajes')
        .select('*, users!remitente_id(nombre)')
        .eq('trabajo_id', trabajo_id)
        .order('creado_en', { ascending: true })

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json(data)
})

// POST /api/mensajes — enviar un mensaje
router.post('/', async (req, res) => {
    const { trabajo_id, remitente_id, destinatario_id, contenido } = req.body

    if (!trabajo_id || !remitente_id || !destinatario_id || !contenido) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const { data, error } = await supabase
        .from('mensajes')
        .insert({ trabajo_id, remitente_id, destinatario_id, contenido })
        .select()

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json({ mensaje: 'Mensaje enviado', data: data[0] })
})

module.exports = router
