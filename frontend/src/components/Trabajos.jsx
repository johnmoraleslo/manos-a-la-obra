import { useState, useEffect } from 'react'

// Sección de Trabajos: muestra estadísticas, formulario para publicar y tabla de trabajos
// Recibe usuarioId: el ID del usuario logueado (se usa como cliente_id al publicar)
function Trabajos({ usuarioId }) {
    const [trabajos, setTrabajos] = useState([])
    const [mensaje, setMensaje] = useState(null)
    const [tipo, setTipo] = useState('')

    // Campos del formulario
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [pago, setPago] = useState('')
    // cliente_id viene del usuario logueado (prop usuarioId)

    // Cargar trabajos al montar el componente
    useEffect(() => {
        cargarTrabajos()
    }, [])

    async function cargarTrabajos() {
        try {
            const res = await fetch('http://localhost:3000/api/jobs')
            const data = await res.json()
            setTrabajos(data)
        } catch (err) {
            console.error('Error al cargar trabajos:', err)
        }
    }

    // Publicar un trabajo nuevo
    async function handlePublicar(e) {
        e.preventDefault()
        setMensaje(null)

        try {
            const res = await fetch('http://localhost:3000/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, descripcion, pago: Number(pago), cliente_id: usuarioId })
            })

            const data = await res.json()

            if (!res.ok) {
                setTipo('error')
                setMensaje(data.error)
                return
            }

            setTipo('success')
            setMensaje('Trabajo publicado correctamente')

            // Limpiar formulario
            setTitulo('')
            setDescripcion('')
            setPago('')

            // Recargar la lista
            cargarTrabajos()

        } catch (err) {
            setTipo('error')
            setMensaje('No se pudo conectar con el servidor')
        }
    }

    // Eliminar un trabajo
    async function handleEliminar(id) {
        if (!confirm('¿Seguro que quieres eliminar este trabajo?')) return

        try {
            const res = await fetch(`http://localhost:3000/api/jobs/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                cargarTrabajos()
            }
        } catch (err) {
            console.error('Error al eliminar:', err)
        }
    }

    return (
        <>
            {/* Encabezado */}
            <div className="main-header">
                <h1>Gestión de Trabajos</h1>
                <p>Publica nuevas tareas y consulta los trabajos disponibles</p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="stats">
                <div className="stat-card">
                    <span>Total trabajos</span>
                    <h3>{trabajos.length}</h3>
                    <p>Publicados en la plataforma</p>
                </div>
                <div className="stat-card">
                    <span>Disponibles</span>
                    <h3>{trabajos.length}</h3>
                    <p>Esperando trabajadores</p>
                </div>
                <div className="stat-card">
                    <span>Estado sistema</span>
                    <h3 style={{ fontSize: '20px' }}>Operativo</h3>
                    <p>Sin incidencias</p>
                </div>
            </div>

            {/* Panel: formulario + tabla */}
            <div className="panel">

                {/* Formulario para publicar trabajo */}
                <div className="card">
                    <h2>Publicar trabajo</h2>
                    <p>Completa los datos del servicio que necesitas</p>

                    {mensaje && (
                        <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`}>
                            {mensaje}
                        </div>
                    )}

                    <form onSubmit={handlePublicar}>
                        <div className="form-group">
                            <label>Título del trabajo</label>
                            <input
                                type="text"
                                placeholder="Ej: Reparar fuga de agua"
                                value={titulo}
                                onChange={e => setTitulo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                placeholder="Describe el trabajo con detalle..."
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Pago (COP)</label>
                            <input
                                type="number"
                                placeholder="150000"
                                value={pago}
                                onChange={e => setPago(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Publicar trabajo
                        </button>
                    </form>
                </div>

                {/* Tabla de trabajos */}
                <div className="card">
                    <div className="table-header">
                        <div>
                            <h2>Listado de trabajos</h2>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>
                                Todos los trabajos publicados
                            </p>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Pago</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trabajos.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>
                                        No hay trabajos publicados
                                    </td>
                                </tr>
                            ) : (
                                trabajos.map(job => (
                                    <tr key={job.id}>
                                        <td>{job.titulo}</td>
                                        <td>${Number(job.pago).toLocaleString('es-CO')}</td>
                                        <td>
                                            <span className="badge badge-active">Disponible</span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleEliminar(job.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default Trabajos
