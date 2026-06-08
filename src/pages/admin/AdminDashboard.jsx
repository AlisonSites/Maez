import { useEffect, useState } from 'react'
import { Package, CheckCircle, XCircle, Layers } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, categories: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('id, active, category')
      if (data) {
        const cats = new Set(data.map(p => p.category).filter(Boolean))
        setStats({
          total: data.length,
          active: data.filter(p => p.active).length,
          inactive: data.filter(p => !p.active).length,
          categories: data.length
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Total de Produtos', value: stats.total, icon: Package, color: '#ffffff' },
    { label: 'Ativos', value: stats.active, icon: CheckCircle, color: '#1db954' },
    { label: 'Inativos', value: stats.inactive, icon: XCircle, color: '#dc2626' },
    { label: 'Categorias', value: stats.categories, icon: Layers, color: '#f5c518' },
  ]

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>
      {loading ? <div className="spinner"></div> : (
        <div className="dash-grid">
          {cards.map(c => (
            <div className="dash-card" key={c.label} style={{ '--accent': c.color }}>
              <div className="dash-card-icon"><c.icon size={22} /></div>
              <div className="dash-card-info">
                <div className="dash-value">{c.value}</div>
                <div className="dash-label">{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="dash-hint">
        <p>👋 Bem-vindo ao painel de administração da <strong>MAEZ</strong>.</p>
        <p>Use o menu lateral para gerenciar produtos e tamanhos.</p>
      </div>
    </div>
  )
}
