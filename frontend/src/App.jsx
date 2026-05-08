import { useState } from 'react'
import './App.css'

import Login from './components/Login'
import PanelCliente from './components/PanelCliente'
import PanelTrabajador from './components/PanelTrabajador'
import PanelAdmin from './components/PanelAdmin'

function App() {
  const [usuario, setUsuario] = useState(null)

  function handleLogin(usuarioData) {
    setUsuario(usuarioData)
  }

  // Si no hay usuario, mostramos el Login
  if (!usuario) {
    return <Login onLogin={handleLogin} />
  }

  // Según el rol, mostramos el panel correspondiente
  if (usuario.rol === 'admin') {
    return <PanelAdmin usuario={usuario} />
  }

  if (usuario.rol === 'cliente') {
    return <PanelCliente usuario={usuario} />
  }

  return <PanelTrabajador usuario={usuario} />
}

export default App
