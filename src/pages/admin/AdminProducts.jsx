import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ProductFormModal from '../../components/admin/ProductFormModal'
import './AdminProducts.css'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editProduct, setEditProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  async function toggleActive(product) {
    await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: !p.active } : p))
  }

  async function deleteProduct(id) {
    if (!window.confirm('Excluir este produto?')) return
    setDeleting(id)
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => { setEditProduct(null); setShowForm(true) }
  const openEdit = (p) => { setEditProduct(p); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditProduct(null) }
  const onSaved = () => { closeForm(); fetchProducts() }

  return (
    <div className="admin-products">
      <div className="ap-header">
        <h1 className="admin-page-title">Produtos</h1>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      <div className="ap-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Buscar por ID, título ou categoria..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
      </div>

      {loading ? <div className="spinner"></div> : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>ID</th>
                <th>Título</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="ap-empty">Nenhum produto encontrado</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.image_url || 'https://via.placeholder.com/50x50/1a1a1a/1db954?text=P'}
                      alt={p.title}
                      className="ap-thumb"
                    />
                  </td>
                  <td><code className="ap-id">{String(p.id).slice(0, 8)}…</code></td>
                  <td className="ap-title-cell">{p.title}</td>
                  <td><span className="badge">{p.category}</span></td>
                  <td className="ap-price">R$ {Number(p.price).toFixed(2).replace('.', ',')}</td>
                  <td>
                    <span className={`ap-stock ${p.stock <= 0 ? 'out' : p.stock <= 5 ? 'low' : ''}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`ap-status-btn ${p.active ? 'active' : 'inactive'}`}
                      onClick={() => toggleActive(p)}
                      title={p.active ? 'Clique para desativar' : 'Clique para ativar'}
                    >
                      {p.active ? <><Eye size={13} /> Ativo</> : <><EyeOff size={13} /> Inativo</>}
                    </button>
                  </td>
                  <td>
                    <div className="ap-actions">
                      <button className="ap-btn edit" onClick={() => openEdit(p)} title="Editar">
                        <Pencil size={15} />
                      </button>
                      <button
                        className="ap-btn delete"
                        onClick={() => deleteProduct(p.id)}
                        disabled={deleting === p.id}
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductFormModal
          product={editProduct}
          onClose={closeForm}
          onSaved={onSaved}
        />
      )}
    </div>
  )
}
