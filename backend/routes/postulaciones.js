const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET /api/postulaciones/:trabajador_id — ver mis postulaciones
router.get('/:trabajador_id', async (req, res) => {
    const { trabajador_id } = req.params

    const { data, error } = await supabase
        .from('postulaciones')
        .select('*, jobs(titulo, descripcion, pago)')
        .eq('trabajador_id', trabajador_id)

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json(data)
})

// POST /api/postulaciones — postularse a un trabajo
router.post('/', async (req, res) => {
    const { job_id, trabajador_id, mensaje } = req.body

    if (!job_id || !trabajador_id) {
        return res.status(400).json({ error: 'job_id y trabajador_id son obligatorios' })
    }

    const { data, error } = await supabase
        .from('postulaciones')
        .insert({ job_id, trabajador_id, mensaje })
        .select()

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json({ mensaje: 'Postulación enviada correctamente', postulacion: data[0] })
})

module.exports = router