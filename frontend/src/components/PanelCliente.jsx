import { useState, useEffect } from 'react'
import Chat from './Chat'

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
            const res = await fetch('http://localhost:3000/api/users/trabajadores')
            const data = await res.json()
            setTrabajadores(data)
        } catch (err) {
            console.error(err)
        }
    }

    async function cargarMisTrabajos() {
        try {
            const res = await fetch('http://localhost:3000/api/jobs')
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
            const res = await fetch('http://localhost:3000/api/jobs', {
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
        await fetch(`http://localhost:3000/api/jobs/${id}`, { method: 'DELETE' })
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
                                    <button type="submit" className="btn btn-primary">Publicar solicitud</button>
                                </form>
                            </div>

                            {/* Lista de mis trabajos */}
                            <div className="card">
                                <div className="table-header">
                                    <h2>Mis trabajos publicados</h2>
                                </div>
                                <table>
                                    <thead>
                                        <tr><th>Título</th><th>Presupuesto</th><th>Estado</th><th>Acciones</th></tr>
                                    </thead>
                                    <tbody>
                                        {trabajos.length === 0 ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>No tienes trabajos publicados</td></tr>
                                        ) : (
                                            trabajos.map(j => (
                                                <tr key={j.id}>
                                                    <td>{j.titulo}</td>
                                                    <td>${Number(j.pago).toLocaleString('es-CO')}</td>
                                                    <td><span className="badge badge-active">Activo</span></td>
                                                    <td><button className="btn btn-danger" onClick={() => handleEliminar(j.id)}>Eliminar</button></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Chat flotante */}
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
