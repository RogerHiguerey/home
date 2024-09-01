// authService.js (o .ts si usas TypeScript)
const login = async (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'pass') {
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
}

const logout = () => {
  return new Promise((resolve) => {
    const confirmation = window.confirm('¿Estás seguro de que deseas cerrar sesión?')
    if (confirmation) {
      console.log('Logout successful')
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

export default { login, logout }
