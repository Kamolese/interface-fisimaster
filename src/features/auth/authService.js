import axios from 'axios'

const API_URL = 'users/'

const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + 'login', userData)
    
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

const logout = () => {
  localStorage.removeItem('user')
}

const getConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  }

  return config
}

const authService = {
  register,
  login,
  logout,
  getConfig,
}

export default authService
export { getConfig }