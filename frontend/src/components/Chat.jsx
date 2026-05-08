import { useState, useEffect, useRef } from 'react'

// Definimos la URL de la API (Usa Vercel en producción o localhost en tu PC)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Chat simple entre cliente y trabajador sobre un trabajo específico
function Chat({ trabajoId, remitenteId, destinatarioId, nombreOtro, onCerrar }) {
    const [mensajes, setMensajes] = useState([])
    const [texto, setTexto] = useState('')
    const bottomRef = useRef(null)

    // Cargar mensajes al abrir y cada 5 segundos
    useEffect(() => {
        cargarMensajes()
        const intervalo = setInterval(cargarMensajes, 5000)
        return () => clearInterval(intervalo)
    }, [trabajoId])

    // Scroll automático al último mensaje
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [mensajes])

    async function cargarMensajes() {
        try {
            // ✅ URL corregida usando API_URL y comillas invertidas
            const res = await fetch(`${API_URL}/api/mensajes/${trabajoId}`)
            const data = await res.json()
            setMensajes(data)
        } catch (err) {
            console.error(err)
        }
    }

    async function handleEnviar(e) {
        e.preventDefault()
        if (!texto.trim()) return

        try {
            // ✅ URL corregida usando API_URL
            await fetch(`${API_URL}/api/mensajes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trabajo_id: trabajoId,
                    remitente_id: remitenteId,
                    destinatario_id: destinatarioId,
                    contenido: texto
                })
            })
            setTexto('')
            cargarMensajes()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="chat-overlay">
            <div className="chat-box">
                {/* Header */}
                <div className="chat-header">
                    <span>💬 Chat con {nombreOtro}</span>
                    <button onClick={onCerrar}>✕</button>
                </div>

                {/* Mensajes */}
                <div className="chat-messages">
                    {mensajes.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '20px' }}>
                            No hay mensajes aún. ¡Inicia la conversación!
                        </p>
                    ) : (
                        mensajes.map(m => (
                            <div
                                key={m.id}
                                className={`chat-msg ${m.remitente_id === remitenteId ? 'propio' : 'otro'}`}
                            >
                                <span className="chat-nombre">{m.users?.nombre || 'Usuario'}</span>
                                <p>{m.contenido}</p>
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form className="chat-input" onSubmit={handleEnviar}>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={texto}
                        onChange={e => setTexto(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Enviar</button>
                </form>
            </div>
        </div>
    )
}

export default Chat

