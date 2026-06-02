import { useEffect, useState } from 'react'
import { ShieldCheck, Plus, Trash2, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './AdminAdmins.css'

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', name: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchAdmins() }, [])

  async function fetchAdmins() {
    setLoading(true)
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setAdmins(data || [])
    setLoading(false)
  }

  async function handleAdd() {
    setError('')
    if (!form.email.trim()) { setError('Informe o e-mail.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('E-mail inválido.'); return }

    setSaving(true)
    const { error } = await supabase
      .from('admin_users')
      .insert({ email: form.email.trim().toLowerCase(), name: form.name.trim() || null })

    if (error) {
      setError(error.code === '23505' ? 'Este e-mail já é admin.' : error.message)
    } else {
      setForm({ email: '', name: '' })
      setShowModal(false)
      fetchAdmins()
    }
    setSaving(false)
  }

  async function handleDelete(admin) {
    if (!window.confirm(`Remover "${admin.email}" do acesso admin?`)) return
    setDeleting(admin.id)
    await supabase.from('admin_users').delete().eq('id', admin.id)
    setAdmins(prev => prev.filter(a => a.id !== admin.id))
    setDeleting(null)
  }

  function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })
  }

  return (
    <div className="aa-page">
      <div className="aa-header">
        <div className="aa-title">
          <ShieldCheck size={22} />
          <h1 className="admin-page-title">Administradores</h1>
        </div>
        <button className="aa-btn-add" onClick={() => { setShowModal(true); setError('') }}>
          <Plus size={16} /> Adicionar Admin
        </button>
      </div>

      <p className="aa-desc">
        Somente os e-mails cadastrados aqui poderão acessar o painel admin.
      </p>

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
                <th>Adicionado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="au-empty">Nenhum administrador cadastrado.</td>
                </tr>
              ) : (
                admins.map((a, i) => (
                  <tr key={a.id}>
                    <td className="au-num">{i + 1}</td>
                    <td>
                      <div className="au-avatar-row">
                        <div className="aa-avatar">
                          {(a.name || a.email || '?')[0].toUpperCase()}
                        </div>
                        <span>{a.name || <span className="au-muted">—</span>}</span>
                      </div>
                    </td>
                    <td>{a.email}</td>
                    <td>{formatDate(a.created_at)}</td>
                    <td>
                      <button
                        className="aa-btn-del"
                        onClick={() => handleDelete(a)}
                        disabled={deleting === a.id}
                        title="Remover admin"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal adicionar admin */}
      {showModal && (
        <div className="aa-overlay" onClick={() => setShowModal(false)}>
          <div className="aa-modal" onClick={e => e.stopPropagation()}>
            <div className="aa-modal-header">
              <span>Novo Administrador</span>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="aa-modal-body">
              <label>
                E-mail *
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  autoFocus
                />
              </label>
              <label>
                Nome (opcional)
                <input
                  type="text"
                  placeholder="Nome do admin"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </label>
              {error && <p className="aa-error">{error}</p>}
            </div>
            <div className="aa-modal-footer">
              <button className="aa-btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="aa-btn-save" onClick={handleAdd} disabled={saving}>
                {saving ? 'Salvando…' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
