// Sidebar: menú lateral de navegación
// Recibe:
//   - seccion: la sección activa actualmente
//   - onCambiar: función para cambiar de sección
//   - onLogout: función para cerrar sesión
function Sidebar({ seccion, onCambiar, onLogout }) {
    const opciones = [
        { id: 'trabajos', label: '🔨 Trabajos' },
        { id: 'postulaciones', label: '📋 Postulaciones' },
        { id: 'usuarios', label: '👥 Usuarios' },
    ]

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>🏗️ Manos a la Obra</h2>
                <p>Panel de administración</p>
            </div>

            <nav>
                {opciones.map(op => (
                    <button
                        key={op.id}
                        className={seccion === op.id ? 'active' : ''}
                        onClick={() => onCambiar(op.id)}
                    >
                        {op.label}
                    </button>
                ))}

                {/* Botón de cerrar sesión al final */}
                <button
                    onClick={onLogout}
                    style={{ marginTop: 'auto', color: '#ef4444' }}
                >
                    🚪 Cerrar sesión
                </button>
            </nav>
        </aside>
    )
}

export default Sidebar
