// Sección de Usuarios: muestra el formulario de registro y la lista de usuarios
// Por ahora solo tiene el formulario de registro (la lista requeriría un endpoint adicional)
import { useState } from 'react'

function Usuarios() {
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rol, setRol] = useState('trabajador')

    const [msg, setMsg] = useState(null)
    const [tipo, setTipo] = useState('')

    async function handleRegistro(e) {
        e.preventDefault()
        setMsg(null)

        try {
            const res = await fetch('http://localhost:3000/api/users/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password, rol })
            })

            const data = await res.json()

            if (!res.ok) {
                setTipo('error')
                setMsg(data.error)
                return
            }

            setTipo('success')
            setMsg('Usuario registrado correctamente')
            setNombre('')
            setEmail('')
            setPassword('')
            setRol('trabajador')

        } catch (err) {
            setTipo('error')
            setMsg('No se pudo conectar con el servidor')
        }
    }

    return (
        <>
            <div className="main-header">
                <h1>Gestión de Usuarios</h1>
                <p>Registra nuevos usuarios en la plataforma</p>
            </div>

            <div className="panel">

                {/* Formulario de registro */}
                <div className="card">
                    <h2>Nuevo registro</h2>
                    <p>Completa los datos para crear un usuario</p>

                    {msg && (
                        <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`}>
                            {msg}
                        </div>
                    )}

                    <form onSubmit={handleRegistro}>
                        <div className="form-group">
                            <label>Nombre completo</label>
                            <input
                                type="text"
                                placeholder="Nombre del usuario"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Correo electrónico</label>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Rol</label>
                            <select value={rol} onChange={e => setRol(e.target.value)}>
                                <option value="trabajador">Trabajador</option>
                                <option value="cliente">Cliente</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Registrar usuario
                        </button>
                    </form>
                </div>

                {/* Info del sistema */}
                <div className="card">
                    <h2>Roles del sistema</h2>
                    <p>Descripción de cada tipo de usuario</p>

                    <div style={{ marginTop: '16px' }}>
                        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
                            <strong>🔨 Trabajador</strong>
                            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                                Puede ver los trabajos disponibles y postularse a ellos.
                                Es el profesional que ofrece el servicio (albañil, plomero, electricista, etc.)
                            </p>
                        </div>
                        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                            <strong>👤 Cliente</strong>
                            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
                                Puede publicar trabajos y revisar las postulaciones recibidas.
                                Es quien necesita contratar un servicio.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Usuarios
