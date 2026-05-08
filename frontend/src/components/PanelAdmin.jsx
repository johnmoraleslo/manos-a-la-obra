import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

    function cambiarSeccion(nueva) {
        setSeccion(nueva)
        setMsg(null)
        if (nueva === 'usuarios') cargarUsuarios()
        if (nueva === 'trabajos') cargarTrabajos()
        if (nueva === 'postulaciones') cargarPostulaciones()
        if (nueva === 'dashboard') cargarStats()
    }

    async function handleEliminarUsuario(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return
        try {
            const res = await apiFetch(`${API_URL}/api/admin/users/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTipo('success')
                setMsg('Usuario eliminado correctamente')
                cargarUsuarios()
            }
        } catch (err) {
            setTipo('error')
            setMsg('Error al conectar')
        }
    }

    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.rol?.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h2>🏗️ Manos a la Obra</h2>
                    <p>⚙️ {usuario.nombre}</p>
                    <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Administrador</p>
                </div>
                <nav>
                    <button className={seccion === 'dashboard' ? 'active' : ''} onClick={() => cambiarSeccion('dashboard')}>📊 Dashboard</button>
                    <button className={seccion === 'usuarios' ? 'active' : ''} onClick={() => cambiarSeccion('usuarios')}>👥 Usuarios</button>
                    <button className={seccion === 'trabajos' ? 'active' : ''} onClick={() => cambiarSeccion('trabajos')}>💼 Trabajos</button>
                    <button className={seccion === 'postulaciones' ? 'active' : ''} onClick={() => cambiarSeccion('postulaciones')}>📋 Postulaciones</button>
                    <button onClick={() => { localStorage.removeItem('token'); window.location.reload() }} style={{ color: '#ef4444', marginTop: 'auto' }}>🚪 Cerrar sesión</button>
                </nav>
            </aside>

            <main className="main">
                <div className="main-header">
                    <h1>{seccion.charAt(0).toUpperCase() + seccion.slice(1)}</h1>
                </div>

                {msg && <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`}>{msg}</div>}

                {cargando && <p>Cargando datos...</p>}

                {seccion === 'dashboard' && stats && (
                    <div className="stats">
                        <div className="stat-card"><span>Clientes</span><h3>{stats.clientes}</h3></div>
                        <div className="stat-card"><span>Trabajadores</span><h3>{stats.trabajadores}</h3></div>
                        <div className="stat-card"><span>Total Trabajos</span><h3>{stats.totalJobs}</h3></div>
                    </div>
                )}

                {seccion === 'usuarios' && (
                    <div className="card">
                        <input type="text" placeholder="Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="form-group" style={{ marginBottom: '15px' }} />
                        <table>
                            <thead><tr><th>Nombre</th><th>Rol</th><th>Acción</th></tr></thead>
                            <tbody>
                                {usuariosFiltrados.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.nombre}</td>
                                        <td><span className="badge">{u.rol}</span></td>
                                        <td><button onClick={() => handleEliminarUsuario(u.id)} className="btn" style={{ color: 'red' }}>Eliminar</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}

export default PanelAdmin

