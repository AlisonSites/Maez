import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Settings, Menu, X, Music2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Logo from '../assets/logo.png'
import './Header.css'

export default function Header() {
  const { cartCount, user, signOut } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          {/* <Music2 size={24} className="logo-icon" /> */}
          {/* <img src={Logo} alt="" /> */}
          <span className='spanlogo'><span className="logo-accent">Joias </span>Do  <span className="logo-accent-1">Kauan</span></span>
        </Link>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Início</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Carrinho</Link>
          {user ? (
            <>
              {user.email === 'admin@joiasdokauan.com' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button className="nav-logout" onClick={handleSignOut}>
                <LogOut size={15} /> Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-login" onClick={() => setMenuOpen(false)}>
              <User size={15} /> Entrar
            </Link>
          )}
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user && user.email === 'admin@joiasdokauan.com' && (
            <Link to="/admin" className="admin-icon-btn">
              <Settings size={20} />
            </Link>
          )}
          
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}
