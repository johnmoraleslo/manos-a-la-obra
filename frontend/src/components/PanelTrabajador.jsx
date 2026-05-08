import { useState, useEffect } from 'react'
import Chat from './Chat'

// Definimos la URL de la API (Usa Vercel en producción o localhost en tu PC)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Panel exclusivo para trabajadores
// Pueden: ver trabajos disponibles, postularse, chatear con clientes
function PanelTrabajador({ usuario }) {
    const [trabajos, setTrabajos] = useState([])
    const [misPostulaciones, setMisPostulaciones] = useState([])
    const [seccion, setSeccion] = useState('trabajos')
    const [chatAbierto, setChatAbierto] = useState(null)

    const [msg, setMsg] = useState(null)
    const [tipo, setTipo] = useState('')

    useEffect(() => {
        cargarTrabajos()
        cargarMisPostulaciones()
    }, [])

    async function cargarTrabajos() {
        try {
            // ✅ URL corregida usando API_URL
            const res = await fetch(`${API_URL}/api/jobs`)
            const data = await res.json()
            setTrabajos(data)
        } catch (err) {
            console.error(err)
        }
    }

    async function cargarMisPostulaciones() {
        try {
            // ✅ URL corregida usando API_URL y backticks
            const res = await fetch(`${API_URL}/api/postulaciones/${usuario.id}`)
            const data = await res.json()
            setMisPostulaciones(data)
        } catch (err) {
            console.error(err)
        }
    }

    async function handlePostular(job) {
        setMsg(null)
        const mensajeTexto = prompt(`¿Cuánto cobrarías por "${job.titulo}"? Escribe tu propuesta:`)
        if (!mensajeTexto) return

        try {
            // ✅ URL corregida usando API_URL
            const res = await fetch(`${API_URL}/api/postulaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_id: job.id,
                    trabajador_id: usuario.id,
                    mensaje: mensajeTexto
                })
            })
            const data = await res.json()

            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }

            setTipo('success')
            setMsg('¡Postulación enviada correctamente!')
            cargarMisPostulaciones()
        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        }
    }

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h2>🏗️ Manos a la Obra</h2>
                    <p>🔨 {usuario.nombre}</p>
                    {usuario.especialidad && (
                        <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{usuario.especialidad}</p>
                    )}
                </div>
                <nav>
                    <button className={seccion === 'trabajos' ? 'active' : ''} onClick={() => setSeccion('trabajos')}>
                        📋 Trabajos disponibles
                    </button>
                    <button className={seccion === 'mis-postulaciones' ? 'active' : ''} onClick={() => setSeccion('mis-postulaciones')}>
                        ✅ Mis postulaciones
                    </button>
                    <button onClick={() => { localStorage.removeItem('token'); window.location.reload() }} style={{ color: '#ef4444', marginTop: 'auto' }}>
                        🚪 Cerrar sesión
                    </button>
                </nav>
            </aside>

            {/* Contenido */}
            <main className="main">
                {seccion === 'trabajos' && (
                    <>
                        <div className="main-header">
                            <h1>Trabajos disponibles</h1>
                            <p>Encuentra trabajos y envía tu propuesta de cobro</p>
                        </div>

                        {msg && <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '16px' }}>{msg}</div>}

                        <div className="stats">
                            <div className="stat-card">
                                <span>Trabajos disponibles</span>
                                <h3>{trabajos.length}</h3>
                                <p>Publicados por clientes</p>
                            </div>
                            <div className="stat-card">
                                <span>Mis postulaciones</span>
                                <h3>{misPostulaciones.length}</h3>
                                <p>Enviadas hasta ahora</p>
                            </div>
                        </div>

                        <div className="card">
                            <table>
                                <thead>
                                    <tr><th>Título</th><th>Descripción</th><th>Presupuesto</th><th>Acción</th></tr>
                                </thead>
                                <tbody>
                                    {trabajos.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>No hay trabajos disponibles</td></tr>
                                    ) : (
                                        trabajos.map(j => (
                                            <tr key={j.id}>
                                                <td>{j.titulo}</td>
                                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.descripcion}</td>
                                                <td>${Number(j.pago).toLocaleString('es-CO')}</td>
                                                <td style={{ display: 'flex', gap: '6px' }}>
                                                    <button className="btn btn-primary" style={{ fontSize: '12px', padding: '5px 12px' }} onClick={() => handlePostular(j)}>
                                                        Postularme
                                                    </button>
                                                    <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '5px 12px' }}
                                                        onClick={() => setChatAbierto({ trabajoId: j.id, otroUsuarioId: j.cliente_id, otroNombre: 'Cliente' })}>
                                                        💬
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {seccion === 'mis-postulaciones' && (
                    <>
                        <div className="main-header">
                            <h1>Mis postulaciones</h1>
                            <p>Trabajos a los que te has postulado</p>
                        </div>
                        <div className="card">
                            <table>
                                <thead>
                                    <tr><th>Trabajo</th><th>Presupuesto</th><th>Mi propuesta</th><th>Estado</th></tr>
                                </thead>
                                <tbody>
                                    {misPostulaciones.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>No te has postulado a ningún trabajo</td></tr>
                                    ) : (
                                        misPostulaciones.map(p => (
                                            <tr key={p.id}>
                                                <td>{p.jobs?.titulo || '—'}</td>
                                                <td>{p.jobs?.pago ? `$${Number(p.jobs.pago).toLocaleString('es-CO')}` : '—'}</td>
                                                <td>{p.mensaje || '—'}</td>
                                                <td><span className="badge badge-pending">Pendiente</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>

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

export default PanelTrabajador

