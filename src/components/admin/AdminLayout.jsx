import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutGrid, Package, Ruler, LogOut, Music2, ChevronRight, Home } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import './AdminLayout.css'

export default function AdminLayout() {
  const { user, signOut } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [sideOpen, setSideOpen] = useState(false)

  if (!user || user.email !== 'admin@usemaez.com') {
    return (
      <div className="admin-denied">
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta área.</p>
        <Link to="/" className="btn-primary">← Voltar à Loja</Link>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/admin', label: 'Dashboard', icon: LayoutGrid },
    { to: '/admin/products', label: 'Produtos', icon: Package },
    { to: '/admin/sizes', label: 'Tamanhos', icon: Ruler },
  ]

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="circulo_admin">
            <span>
              AM
            </span>
          </div>
          <span>Admin MAEZ</span>
        </div>
        <nav className="admin-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              end={to === '/admin'}
              className={`admin-nav-item ${location.pathname === to ? 'active' : ''}`}
              onClick={() => setSideOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="nav-arrow" />
            </Link>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleSignOut}>
          <LogOut size={16} /> Sair
        </button>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <button className="sidebar-toggle" onClick={() => setSideOpen(!sideOpen)}>
            ☰
          </button>
          <div className="admin-user">
            {/* <div className="admin-avatar">{user.email[0].toUpperCase()}</div> */}
            <span>PORTAL ADMINISTRADOR - SITE MAEZ</span>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      {sideOpen && <div className="sidebar-backdrop" onClick={() => setSideOpen(false)} />}
    </div>
  )
}
