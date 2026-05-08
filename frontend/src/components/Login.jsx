import { useState } from 'react'

const ESPECIALIDADES = [
    'Albañil', 'Plomero', 'Electricista', 'Pintor',
    'Carpintero', 'Soldador', 'Techador', 'Otro'
]

function Login({ onLogin }) {
    const [modo, setModo] = useState('login')
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rol, setRol] = useState('trabajador')
    const [especialidad, setEspecialidad] = useState('Albañil')
    const [mensaje, setMensaje] = useState(null)
    const [tipo, setTipo] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setMensaje(null)

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        const url = modo === 'login'
            ? `${API_URL}/api/users/login`
            : `${API_URL}/api/users/registro`


        const body = modo === 'login'
            ? { email, password }
            : { nombre, email, password, rol, especialidad: rol === 'trabajador' ? especialidad : null }

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const data = await res.json()

            if (!res.ok) {
                setTipo('error')
                setMensaje(data.error || 'Ocurrió un error')
                return
            }

            if (modo === 'login') {
                localStorage.setItem('token', data.token)
                onLogin(data.usuario)
            } else {
                setTipo('success')
                setMensaje('Registro exitoso. Ahora puedes iniciar sesión.')
                setModo('login')
            }

        } catch (err) {
            setTipo('error')
            setMensaje('No se pudo conectar con el servidor')
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>🏗️ Manos a la Obra</h1>
                <p>{modo === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}</p>

                {mensaje && (
                    <div className={`msg msg-${tipo === 'error' ? 'error' : 'success'}`}>
                        {mensaje}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {modo === 'registro' && (
                        <div className="form-group">
                            <label>Nombre completo</label>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                required
                            />
                        </div>
                    )}

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

                    {modo === 'registro' && (
                        <>
                            <div className="form-group">
                                <label>Soy...</label>
                                <select value={rol} onChange={e => setRol(e.target.value)}>
                                    <option value="trabajador">Trabajador (ofrezco mis servicios)</option>
                                    <option value="cliente">Cliente (necesito un servicio)</option>
                                </select>
                            </div>

                            {/* Solo se muestra si es trabajador */}
                            {rol === 'trabajador' && (
                                <div className="form-group">
                                    <label>Mi especialidad</label>
                                    <select value={especialidad} onChange={e => setEspecialidad(e.target.value)}>
                                        {ESPECIALIDADES.map(esp => (
                                            <option key={esp} value={esp}>{esp}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    <button type="submit" className="btn btn-primary">
                        {modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}
                    </button>
                </form>

                <div className="login-footer">
                    {modo === 'login' ? (
                        <>¿No tienes cuenta?{' '}
                            <button onClick={() => setModo('registro')}>Regístrate</button>
                        </>
                    ) : (
                        <>¿Ya tienes cuenta?{' '}
                            <button onClick={() => setModo('login')}>Inicia sesión</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login
