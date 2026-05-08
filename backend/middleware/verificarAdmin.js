const supabase = require('../supabase')

// Middleware que verifica que el usuario sea admin
// Se usa en todas las rutas de /api/admin
async function verificarAdmin(req, res, next) {
    // Sacar el token del header Authorization
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado: token requerido' })
    }

    const token = authHeader.split(' ')[1]

    // Verificar el token con Supabase
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
        return res.status(401).json({ error: 'No autorizado: token inválido o expirado' })
    }

    // Buscar el rol del usuario en nuestra tabla users
    const { data: perfil, error: perfilError } = await supabase
        .from('users')
        .select('rol')
        .eq('id', data.user.id)
        .single()

    if (perfilError || !perfil) {
        return res.status(401).json({ error: 'No autorizado: usuario no encontrado' })
    }

    if (perfil.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: se requiere rol admin' })
    }

    // Todo bien, dejamos pasar la petición
    next()
}

module.exports = verificarAdmin
