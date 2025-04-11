import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginRedirect = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=300` // 5分鐘
    }
    navigate('/Home')
  }, [navigate])

  return <div>登入成功，跳轉中...</div>
}

export default LoginRedirect