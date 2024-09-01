// LoginView.jsx
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import { AuthContext } from '../contexts/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Por favor, complete todos los campos.')
      return
    }

    try {
      const success = await authContext.login(username, password)
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Credenciales incorrectas.')
      }
    } catch {
      setError('Ocurrió un error. Intente de nuevo.')
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}

export default Login
