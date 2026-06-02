import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Music2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Logo from '../assets/logo.png'
import './Login.css'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-mail ou senha inválidos.')
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } }
    })
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Conta criada! Verifique seu e-mail para confirmar.')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src={Logo} alt="" />
        </div>

        <div className="login-tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError(''); setSuccess('') }}>
            Entrar
          </button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError(''); setSuccess('') }}>
            Criar Conta
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-icon-wrap">
              <Mail size={16} />
              <input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-icon-wrap">
              <Lock size={16} />
              <input type={showPass ? 'text' : 'password'} placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <div className="input-icon-wrap">
              <User size={16} />
              <input type="text" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-icon-wrap">
              <Mail size={16} />
              <input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-icon-wrap">
              <Lock size={16} />
              <input type={showPass ? 'text' : 'password'} placeholder="Crie uma senha" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </form>
        )}

        <div className="login-footer-note">
          <Link to="/">← Voltar para a loja</Link>
        </div>
      </div>
    </div>
  )
}
