const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// POST /api/users/registro — crea un usuario nuevo
router.post('/registro', async (req, res) => {
    const { nombre, email, password, rol, especialidad } = req.body

    // 1. Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    })

    if (authError) {
        return res.status(400).json({ error: authError.message })
    }

    // 2. Guardar nombre, rol y especialidad en nuestra tabla users
    const { error: dbError } = await supabase
        .from('users')
        .insert({ id: authData.user.id, nombre, rol, especialidad: especialidad || null })

    if (dbError) {
        return res.status(400).json({ error: dbError.message })
    }

    res.json({ mensaje: 'Usuario registrado correctamente' })
})

// GET /api/users/trabajadores — obtener todos los trabajadores
router.get('/trabajadores', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, nombre, especialidad')
        .eq('rol', 'trabajador')

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    res.json(data)
})

// POST /api/users/login — inicia sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    // Traemos el rol y nombre desde nuestra tabla users
    const { data: perfil, error: perfilError } = await supabase
        .from('users')
        .select('nombre, rol, especialidad')
        .eq('id', data.user.id)
        .single()

    if (perfilError) {
        return res.status(400).json({ error: perfilError.message })
    }

    // Devolvemos el token y los datos completos del usuario
    res.json({
        token: data.session.access_token,
        usuario: {
            id: data.user.id,
            email: data.user.email,
            nombre: perfil.nombre,
            rol: perfil.rol,
            especialidad: perfil.especialidad
        }
    })
})

module.exports = router
