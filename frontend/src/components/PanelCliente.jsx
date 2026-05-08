import { useState, useEffect } from 'react'
import Chat from './Chat'

// Definimos la URL de la API (Usa Vercel en producción o localhost en tu PC)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Panel exclusivo para clientes
// Pueden: ver trabajadores, publicar trabajos, chatear
function PanelCliente({ usuario }) {
    const [seccion, setSeccion] = useState('trabajadores')
    const [trabajadores, setTrabajadores] = useState([])
    const [trabajos, setTrabajos] = useState([])
    const [chatAbierto, setChatAbierto] = useState(null) // { trabajoId, otroUsuarioId, otroNombre }

    // Campos para publicar trabajo
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [pago, setPago] = useState('')
    const [msg, setMsg] = useState(null)
    const [tipo, setTipo] = useState('')

    useEffect(() => {
        cargarTrabajadores()
        cargarMisTrabajos()
    }, [])

    async function cargarTrabajadores() {
        try {
            // ✅ URL corregida usando API_URL
            const res = await fetch(`${API_URL}/api/users/trabajadores`)
            const data = await res.json()
            setTrabajadores(data)
        } catch (err) {
            console.error(err)
        }
    }

    async function cargarMisTrabajos() {
        try {
            // ✅ URL corregida usando API_URL
            const res = await fetch(`${API_URL}/api/jobs`)
            const data = await res.json()
            // Solo los trabajos del cliente logueado
            setTrabajos(data.filter(j => j.cliente_id === usuario.id))
        } catch (err) {
            console.error(err)
        }
    }

    async function handlePublicar(e) {
        e.preventDefault()
        setMsg(null)

        try {
            // ✅ URL corregida usando API_URL
            const res = await fetch(`${API_URL}/api/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, descripcion, pago: Number(pago), cliente_id: usuario.id })
            })
            const data = await res.json()

            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }

            setTipo('success')
            setMsg('Trabajo publicado correctamente')
            setTitulo('')
            setDescripcion('')
            setPago('')
            cargarMisTrabajos()
        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        }
    }

    async function handleEliminar(id) {
        if (!confirm('¿Eliminar este trabajo?')) return
        // ✅ URL corregida usando API_URL y backticks
        await fetch(`${API_URL}/api/jobs/${id}`, { method: 'DELETE' })
        cargarMisTrabajos()
    }

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h2>🏗️ Manos a la Obra</h2>
                    <p>👤 {usuario.nombre}</p>
                </div>
                <nav>
                    <button className={seccion === 'trabajadores' ? 'active' : ''} onClick={() => setSeccion('trabajadores')}>
                        🔨 Trabajadores
                    </button>
                    <button className={seccion === 'mis-trabajos' ? 'active' : ''} onClick={() => setSeccion('mis-trabajos')}>
                        📋 Mis solicitudes
                    </button>
                    <button onClick={() => { localStorage.removeItem('token'); window.location.reload() }} style={{ color: '#ef4444', marginTop: 'auto' }}>
                        🚪 Cerrar sesión
                    </button>
                </nav>
            </aside>

            {/* Contenido */}
            <main className="main">
                {seccion === 'trabajadores' && (
                    <>
                        <div className="main-header">
                            <h1>Trabajadores disponibles</h1>
                            <p>Encuentra el profesional que necesitas y contáctalo</p>
                        </div>
                        <div className="stats">
                            <div className="stat-card">
                                <span>Trabajadores registrados</span>
                                <h3>{trabajadores.length}</h3>
                                <p>Disponibles en la plataforma</p>
                            </div>
                        </div>
                        <div className="card">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Especialidad</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trabajadores.length === 0 ? (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', color: '#9ca3af' }}>No hay trabajadores registrados</td></tr>
                                    ) : (
                                        trabajadores.map(t => (
                                            <tr key={t.id}>
                                                <td>{t.nombre}</td>
                                                <td><span className="badge badge-active">{t.especialidad || 'General'}</span></td>
                                                <td>
                                                    {trabajos.length > 0 ? (
                                                        <button className="btn btn-primary" style={{ fontSize: '12px', padding: '5px 12px' }}
                                                            onClick={() => setChatAbierto({ trabajoId: trabajos[0].id, otroUsuarioId: t.id, otroNombre: t.nombre })}>
                                                            💬 Contactar
                                                        </button>
                                                    ) : (
                                                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>Publica un trabajo primero</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {seccion === 'mis-trabajos' && (
                    <>
                        <div className="main-header">
                            <h1>Mis solicitudes</h1>
                            <p>Publica y gestiona tus solicitudes de servicio</p>
                        </div>
                        <div className="panel">
                            {/* Formulario */}
                            <div className="card">
                                <h2>Nueva solicitud</h2>
                                <p>Describe el servicio que necesitas</p>
                                {msg && <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`}>{msg}</div>}
                                <form onSubmit={handlePublicar}>
                                    <div className="form-group">
                                        <label>Título</label>
                                        <input type="text" placeholder="Ej: Reparar fuga de agua" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <textarea placeholder="Describe el trabajo con detalle..." value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Presupuesto (COP)</label>
                                        <input type="number" placeholder="150000" value={pago} onChange={e => setPago(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Publicar trabajo</button>
                                </form>
                            </div>

                            {/* Lista de trabajos publicados */}
                            <div className="card" style={{ marginTop: '20px' }}>
                                <h2>Mis publicaciones actuales</h2>
                                {trabajos.length === 0 ? (
                                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>No has publicado trabajos todavía.</p>
                                ) : (
                                    trabajos.map(j => (
                                        <div key={j.id} className="job-item" style={{ borderBottom: '1px solid #e5e7eb', padding: '15px 0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <h3 style={{ margin: 0 }}>{j.titulo}</h3>
                                                    <p style={{ fontSize: '14px', color: '#4b5563', margin: '5px 0' }}>{j.descripcion}</p>
                                                    <span className="badge badge-success">${j.pago.toLocaleString()} COP</span>
                                                </div>
                                                <button className="btn" style={{ color: '#ef4444', fontSize: '12px' }} onClick={() => handleEliminar(j.id)}>Eliminar</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Chat flotante si está abierto */}
            {chatAbierto && (
                <Chat
                    trabajoId={chatAbierto.trabajoId}
                    remitenteId={usuario.id}
                    destinatarioId={chatAbierto.otroUsuarioId}
                    nombreOtro={chatAbierto.otroNombre}
                    onCerrar={() => setChatAbierto(null)}
                />
            )}
        </div>
    )
}

export default PanelCliente

