import { useState, useEffect } from 'react'

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
            const res = await apiFetch('http://localhost:3000/api/admin/stats')
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
            const res = await apiFetch('http://localhost:3000/api/admin/users')
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
            const res = await apiFetch('http://localhost:3000/api/admin/jobs')
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
            const res = await apiFetch('http://localhost:3000/api/admin/postulaciones')
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
            const res = await apiFetch(`http://localhost:3000/api/admin/users/${id}`, { method: 'DELETE' })
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
            const res = await apiFetch(`http://localhost:3000/api/admin/jobs/${id}`, { method: 'DELETE' })
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
            const res = await apiFetch(`http://localhost:3000/api/admin/postulaciones/${id}`, { method: 'DELETE' })
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

                {/* Dashboard */}
                {seccion === 'dashboard' && (
                    <>
                        <div className="main-header">
                            <h1>Dashboard</h1>
                            <p>Resumen general de la plataforma</p>
                        </div>

                        {msg && <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`}>{msg}</div>}

                        {cargando ? (
                            <p style={{ color: '#6b7280' }}>Cargando...</p>
                        ) : stats ? (
                            <div className="stats">
                                <div className="stat-card">
                                    <span>Clientes</span>
                                    <h3>{stats.clientes}</h3>
                                    <p>Registrados en la plataforma</p>
                                </div>
                                <div className="stat-card">
                                    <span>Trabajadores</span>
                                    <h3>{stats.trabajadores}</h3>
                                    <p>Registrados en la plataforma</p>
                                </div>
                                <div className="stat-card">
                                    <span>Trabajos publicados</span>
                                    <h3>{stats.totalJobs}</h3>
                                    <p>En total</p>
                                </div>
                                <div className="stat-card">
                                    <span>Postulaciones</span>
                                    <h3>{stats.totalPostulaciones}</h3>
                                    <p>En total</p>
                                </div>
                            </div>
                        ) : null}
                    </>
                )}

                {/* Usuarios */}
                {seccion === 'usuarios' && (
                    <>
                        <div className="main-header">
                            <h1>Usuarios</h1>
                            <p>Todos los usuarios registrados en la plataforma</p>
                        </div>

                        {msg && <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '16px' }}>{msg}</div>}

                        <div className="card">
                            <div style={{ marginBottom: '16px' }}>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o rol..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                    style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', width: '280px' }}
                                />
                            </div>

                            {cargando ? (
                                <p style={{ color: '#6b7280' }}>Cargando...</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr><th>Nombre</th><th>Rol</th><th>Especialidad</th><th>Acciones</th></tr>
                                    </thead>
                                    <tbody>
                                        {usuariosFiltrados.length === 0 ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>No hay usuarios</td></tr>
                                        ) : (
                                            usuariosFiltrados.map(u => (
                                                <tr key={u.id}>
                                                    <td>{u.nombre}</td>
                                                    <td><span className={`badge ${u.rol === 'admin' ? 'badge-active' : 'badge-pending'}`}>{u.rol}</span></td>
                                                    <td>{u.especialidad || '—'}</td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={() => handleEliminarUsuario(u.id)}>
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {/* Trabajos */}
                {seccion === 'trabajos' && (
                    <>
                        <div className="main-header">
                            <h1>Trabajos</h1>
                            <p>Todos los trabajos publicados en la plataforma</p>
                        </div>

                        {msg && <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '16px' }}>{msg}</div>}

                        <div className="card">
                            {cargando ? (
                                <p style={{ color: '#6b7280' }}>Cargando...</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr><th>Título</th><th>Cliente</th><th>Presupuesto</th><th>Acciones</th></tr>
                                    </thead>
                                    <tbody>
                                        {trabajos.length === 0 ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>No hay trabajos</td></tr>
                                        ) : (
                                            trabajos.map(j => (
                                                <tr key={j.id}>
                                                    <td>{j.titulo}</td>
                                                    <td>{j.users?.nombre || '—'}</td>
                                                    <td>${Number(j.pago).toLocaleString('es-CO')}</td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={() => handleEliminarTrabajo(j.id)}>
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {/* Postulaciones */}
                {seccion === 'postulaciones' && (
                    <>
                        <div className="main-header">
                            <h1>Postulaciones</h1>
                            <p>Todas las postulaciones realizadas en la plataforma</p>
                        </div>

                        {msg && <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '16px' }}>{msg}</div>}

                        <div className="card">
                            {cargando ? (
                                <p style={{ color: '#6b7280' }}>Cargando...</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr><th>Trabajo</th><th>Trabajador</th><th>Propuesta</th><th>Acciones</th></tr>
                                    </thead>
                                    <tbody>
                                        {postulaciones.length === 0 ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>No hay postulaciones</td></tr>
                                        ) : (
                                            postulaciones.map(p => (
                                                <tr key={p.id}>
                                                    <td>{p.jobs?.titulo || '—'}</td>
                                                    <td>{p.users?.nombre || '—'}</td>
                                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.mensaje || '—'}</td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={() => handleEliminarPostulacion(p.id)}>
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

            </main>
        </div>
    )
}

export default PanelAdmin
