import { useState, useEffect } from 'react'

// Definimos la URL de la API (Usa Vercel en producción o localhost en tu PC)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Panel exclusivo para administradores
// Pueden: ver estadísticas, gestionar usuarios, trabajos y postulaciones
function PanelAdmin({ usuario }) {
    const [seccion, setSeccion] = useState('dashboard')
    const [stats, setStats] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [trabajos, setTrabajos] = useState([])
    const [postulaciones, setPostulaciones] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [msg, setMsg] = useState(null)
    const [tipo, setTipo] = useState('')
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        cargarStats()
    }, [])

    // Función auxiliar para hacer fetch con el token de admin
    async function apiFetch(url, opciones = {}) {
        const token = localStorage.getItem('token')
        return fetch(url, {
            ...opciones,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...opciones.headers
            }
        })
    }

    async function cargarStats() {
        setCargando(true)
        try {
            // ✅ URL corregida usando API_URL
            const res = await apiFetch(`${API_URL}/api/admin/stats`)
            const data = await res.json()
            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }
            setStats(data)
        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        } finally {
            setCargando(false)
        }
    }

    async function cargarUsuarios() {
        setCargando(true)
        try {
            // ✅ URL corregida usando API_URL
            const res = await apiFetch(`${API_URL}/api/admin/users`)
            const data = await res.json()
            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }
            setUsuarios(data)
        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        } finally {
            setCargando(false)
        }
    }

    async function cargarTrabajos() {
        setCargando(true)
        try {
            // ✅ URL corregida usando API_URL
            const res = await apiFetch(`${API_URL}/api/admin/jobs`)
            const data = await res.json()
            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }
            setTrabajos(data)
        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        } finally {
            setCargando(false)
        }
    }

    async function cargarPostulaciones() {
        setCargando(true)
        try {
            // ✅ URL corregida usando API_URL
            const res = await apiFetch(`${API_URL}/api/admin/postulaciones`)
            const data = await res.json()
            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }
            setPostulaciones(data)
        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        } finally {
            setCargando(false)
        }
    }

    // Cambiar sección y cargar datos si es necesario
    function cambiarSeccion(nueva) {
        setSeccion(nueva)
        setMsg(null)
        if (nueva === 'usuarios') cargarUsuarios()
        if (nueva === 'trabajos') cargarTrabajos()
        if (nueva === 'postulaciones') cargarPostulaciones()
    }

    async function handleEliminarUsuario(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return
        try {
            // ✅ URL corregida usando API_URL y comillas invertidas
            const res = await apiFetch(`${API_URL}/api/admin/users/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }
            setTipo('success')
            setMsg('Usuario eliminado correctamente')
            cargarUsuarios()
        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        }
    }

    async function handleEliminarTrabajo(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este trabajo?')) return
        try {
            // ✅ URL corregida usando API_URL y comillas invertidas
            const res = await apiFetch(`${API_URL}/api/admin/jobs/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }
            setTipo('success')
            setMsg('Trabajo eliminado correctamente')
            cargarTrabajos()
        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        }
    }

    async function handleEliminarPostulacion(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta postulación?')) return
        try {
            // ✅ URL corregida usando API_URL y comillas invertidas
            const res = await apiFetch(`${API_URL}/api/admin/postulaciones/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }
            setTipo('success')
            setMsg('Postulación eliminada correctamente')
            cargarPostulaciones()
        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        }
    }

    // Filtrar usuarios por búsqueda
    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.rol?.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h2>🏗️ Manos a la Obra</h2>
                    <p>⚙️ {usuario.nombre}</p>
                    <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Administrador</p>
                </div>
                <nav>
                    <button className={seccion === 'dashboard' ? 'active' : ''} onClick={() => cambiarSeccion('dashboard')}>
                        📊 Dashboard
                    </button>
                    <button className={seccion === 'usuarios' ? 'active' : ''} onClick={() => cambiarSeccion('usuarios')}>
                        👥 Usuarios
                    </button>
                    <button className={seccion === 'trabajos' ? 'active' : ''} onClick={() => cambiarSeccion('trabajos')}>
                        💼 Trabajos
                    </button>
                    <button className={seccion === 'postulaciones' ? 'active' : ''} onClick={() => cambiarSeccion('postulaciones')}>
                        📋 Postulaciones
                    </button>
                    <button onClick={() => { localStorage.removeItem('token'); window.location.reload() }} style={{ color: '#ef4444', marginTop: 'auto' }}>
                        🚪 Cerrar sesión
                    </button>
                </nav>
            </aside>

            {/* Contenido principal */}
            <main className="main">
                {/* Nota: Faltaba el cierre del componente en tu código original, 
                    aquí está simplificado para que no te dé error de sintaxis */}
                <div className="main-header">
                    <h1>Dashboard</h1>
                    <p>Resumen general de la plataforma</p>
                </div>
                {msg && <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`}>{msg}</div>}

                {/* Agrega aquí el resto de tu lógica de renderizado del dashboard */}
            </main>
        </div>
    )
}

export default PanelAdmin
