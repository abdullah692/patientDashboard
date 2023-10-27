import authApi from '../Utils/axiosconfig'

class AuthService {
  async login({ email, password }) {
    console.log(email, password, 'ASDASDAD')
    const response = await authApi.post('auth/login', { email, password })
    localStorage.setItem('user', JSON.stringify(response.data))
    const accessToken = response.headers['access-token']
    console.log(response, accessToken, 'responseeee')
    return response.data
  }

  logout() {
    localStorage.removeItem('user')
  }
}

export default new AuthService()
