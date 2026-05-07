import { useState } from 'react'

// Sección de Postulaciones: permite a un trabajador postularse a un trabajo
function Postulaciones() {
    const [jobId, setJobId] = useState('')
    const [trabajadorId, setTrabajadorId] = useState('')
    const [mensaje, setMensaje] = useState('')

    const [msg, setMsg] = useState(null)
    const [tipo, setTipo] = useState('')

    async function handlePostular(e) {
        e.preventDefault()
        setMsg(null)

        try {
            const res = await fetch('http://localhost:3000/api/postulaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_id: jobId,
                    trabajador_id: trabajadorId,
                    mensaje
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
            setJobId('')
            setTrabajadorId('')
            setMensaje('')

        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        }
    }

    return (
        <>
            <div className="main-header">
                <h1>Postulaciones</h1>
                <p>Envía tu postulación a un trabajo disponible</p>
            </div>

            <div className="panel">

                {/* Formulario de postulación */}
                <div className="card">
                    <h2>Postularse a un trabajo</h2>
                    <p>Ingresa los datos para enviar tu postulación</p>

                    {msg && (
                        <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`}>
                            {msg}
                        </div>
                    )}

                    <form onSubmit={handlePostular}>
                        <div className="form-group">
                            <label>ID del trabajo</label>
                            <input
                                type="text"
                                placeholder="UUID del trabajo al que te postulas"
                                value={jobId}
                                onChange={e => setJobId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>ID del trabajador</label>
                            <input
                                type="text"
                                placeholder="Tu UUID de usuario"
                                value={trabajadorId}
                                onChange={e => setTrabajadorId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mensaje (opcional)</label>
                            <textarea
                                placeholder="Cuéntale al cliente por qué eres la mejor opción..."
                                value={mensaje}
                                onChange={e => setMensaje(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Enviar postulación
                        </button>
                    </form>
                </div>

                {/* Explicación del proceso */}
                <div className="card">
                    <h2>¿Cómo funciona?</h2>
                    <p>Pasos para postularte a un trabajo</p>

                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                            <strong>1. Busca un trabajo</strong>
                            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                                Ve a la sección de Trabajos y copia el ID del trabajo que te interesa.
                            </p>
                        </div>
                        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                            <strong>2. Ingresa tus datos</strong>
                            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                                Pega el ID del trabajo y tu ID de usuario en el formulario.
                            </p>
                        </div>
                        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                            <strong>3. Envía tu postulación</strong>
                            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                                Agrega un mensaje opcional y envía. El cliente recibirá tu postulación.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Postulaciones
