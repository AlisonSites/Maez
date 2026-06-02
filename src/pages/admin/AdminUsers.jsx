import { useEffect, useState } from 'react'
import { Users, Search, X, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './AdminUsers.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    // Busca usuários cadastrados via auth — requer service_role no backend.
    // Aqui usamos a view `auth.users` que o Supabase expõe quando a policy permite.
    const { data, error } = await supabase
      .from('user_profiles')   // veja nota abaixo (*)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setUsers([])
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="au-page">
      <div className="au-header">
        <div className="au-title">
          <Users size={22} />
          <h1 className="admin-page-title">Usuários Cadastrados</h1>
        </div>
        <button className="au-btn-refresh" onClick={fetchUsers} title="Recarregar">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="ap-search">
        <Search size={16} />
        <input
          placeholder="Buscar por e-mail ou nome…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')}><X size={14} /></button>
        )}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cadastrado em</th>
                <th>Último acesso</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="au-empty">Nenhum usuário encontrado.</td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td className="au-num">{i + 1}</td>
                    <td>
                      <div className="au-avatar-row">
                        <div className="au-avatar">
                          {(u.full_name || u.email || '?')[0].toUpperCase()}
                        </div>
                        <span>{u.full_name || <span className="au-muted">—</span>}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>{formatDate(u.last_sign_in_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="au-tip">
        * Para listar usuários do Supabase Auth é necessária a view <code>user_profiles</code> — veja o SQL de migração.
      </p>
    </div>
  )
}
