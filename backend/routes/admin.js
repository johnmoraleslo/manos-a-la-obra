const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const verificarAdmin = require('../middleware/verificarAdmin')

// Aplicar el middleware a todas las rutas de este router
router.use(verificarAdmin)

// GET /api/admin/stats — contadores generales para el dashboard
router.get('/stats', async (req, res) => {
    // Traer todos los usuarios con su rol
    const { data: usuarios, error: errorUsuarios } = await supabase
        .from('users')
        .select('rol')

    if (errorUsuarios) {
        return res.status(400).json({ error: errorUsuarios.message })
    }

    // Contar por rol
    const clientes = usuarios.filter(u => u.rol === 'cliente').length
    const trabajadores = usuarios.filter(u => u.rol === 'trabajador').length
    const admins = usuarios.filter(u => u.rol === 'admin').length

    // Total de trabajos
    const { count: totalJobs, error: errorJobs } = await supabase
        .from('jobs')
        .select('id', { count: 'exact', head: true })

    if (errorJobs) {
        return res.status(400).json({ error: errorJobs.message })
    }

    // Total de postulaciones
    const { count: totalPostulaciones, error: errorPost } = await supabase
        .from('postulaciones')
        .select('id', { count: 'exact', head: true })

    if (errorPost) {
        return res.status(400).json({ error: errorPost.message })
    }

    res.json({
        clientes,
        trabajadores,
        admins,
        totalUsuarios: usuarios.length,
        totalJobs,
        totalPostulaciones
    })
})

// GET /api/admin/users — todos los usuarios
router.get('/users', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, nombre, rol, especialidad')
        .order('nombre', { ascending: true })

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json(data)
})

// DELETE /api/admin/users/:id — eliminar un usuario
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params

    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' })
})

// GET /api/admin/jobs — todos los trabajos con nombre del cliente
router.get('/jobs', async (req, res) => {
    const { data, error } = await supabase
        .from('jobs')
        .select('id, titulo, descripcion, pago, creado_en, users(nombre)')
        .order('creado_en', { ascending: false })

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json(data)
})

// DELETE /api/admin/jobs/:id — eliminar un trabajo
router.delete('/jobs/:id', async (req, res) => {
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

// GET /api/admin/postulaciones — todas las postulaciones con joins
router.get('/postulaciones', async (req, res) => {
    const { data, error } = await supabase
        .from('postulaciones')
        .select('id, mensaje, jobs(titulo), users(nombre)')

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json(data)
})

// DELETE /api/admin/postulaciones/:id — eliminar una postulación
router.delete('/postulaciones/:id', async (req, res) => {
    const { id } = req.params

    const { error } = await supabase
        .from('postulaciones')
        .delete()
        .eq('id', id)

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json({ mensaje: 'Postulación eliminada correctamente' })
})

module.exports = router
