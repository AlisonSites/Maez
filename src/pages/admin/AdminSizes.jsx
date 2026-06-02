import { useEffect, useState } from 'react'
import { Plus, Trash2, Ruler, Edit3, Check, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './AdminSizes.css'

export default function AdminSizes() {
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('')
  const [newSize, setNewSize] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [saving, setSaving] = useState(false)
  
  // Estados para edição
  const [editingCategory, setEditingCategory] = useState(null) // { oldName, newName }
  const [editingSize, setEditingSize] = useState(null) // { id, value }

  useEffect(() => { fetchSizes() }, [])

  async function fetchSizes() {
    setLoading(true)
    const { data } = await supabase.from('product_sizes').select('*').order('category').order('size')
    setSizes(data || [])
    setLoading(false)
  }

  const categories = [...new Set(sizes.map(s => s.category))]

  async function addCategory() {
    if (!newCategory.trim()) return
    setSaving(true)
    await supabase.from('product_sizes').insert([{ category: newCategory.trim(), size: 'Único' }])
    setNewCategory('')
    await fetchSizes()
    setSaving(false)
  }

  async function addSize() {
    if (!selectedCat || !newSize.trim()) return
    setSaving(true)
    await supabase.from('product_sizes').insert([{ category: selectedCat, size: newSize.trim() }])
    setNewSize('')
    await fetchSizes()
    setSaving(false)
  }

  async function deleteSize(id) {
    await supabase.from('product_sizes').delete().eq('id', id)
    setSizes(prev => prev.filter(s => s.id !== id))
  }

  async function deleteCategory(categoryName) {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${categoryName}" e todos os seus tamanhos?`)) return
    
    await supabase.from('product_sizes').delete().eq('category', categoryName)
    await fetchSizes()
    
    // Limpa seleção se a categoria excluída estava selecionada
    if (selectedCat === categoryName) {
      setSelectedCat('')
    }
  }

  // Iniciar edição da categoria
  function startEditCategory(categoryName) {
    setEditingCategory({ oldName: categoryName, newName: categoryName })
  }

  // Cancelar edição da categoria
  function cancelEditCategory() {
    setEditingCategory(null)
  }

  // Salvar edição da categoria
  async function saveEditCategory() {
    if (!editingCategory || !editingCategory.newName.trim()) return
    if (editingCategory.oldName === editingCategory.newName) {
      setEditingCategory(null)
      return
    }

    setSaving(true)
    // Atualiza todas as linhas com a categoria antiga para o novo nome
    const { error } = await supabase
      .from('product_sizes')
      .update({ category: editingCategory.newName.trim() })
      .eq('category', editingCategory.oldName)

    if (!error) {
      // Atualiza a seleção se necessário
      if (selectedCat === editingCategory.oldName) {
        setSelectedCat(editingCategory.newName.trim())
      }
      setEditingCategory(null)
      await fetchSizes()
    }
    setSaving(false)
  }

  // Iniciar edição do tamanho
  function startEditSize(sizeId, currentValue) {
    setEditingSize({ id: sizeId, value: currentValue })
  }

  // Cancelar edição do tamanho
  function cancelEditSize() {
    setEditingSize(null)
  }

  // Salvar edição do tamanho
  async function saveEditSize() {
    if (!editingSize || !editingSize.value.trim()) return

    setSaving(true)
    const { error } = await supabase
      .from('product_sizes')
      .update({ size: editingSize.value.trim() })
      .eq('id', editingSize.id)

    if (!error) {
      setEditingSize(null)
      await fetchSizes()
    }
    setSaving(false)
  }

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = sizes.filter(s => s.category === cat)
    return acc
  }, {})

  return (
    <div className="admin-sizes">
      <h1 className="admin-page-title">Tamanhos dos Produtos</h1>

      {/* Add Category */}
      <div className="as-section">
        <h2 className="as-subtitle"><Ruler size={18} /> Nova Categoria</h2>
        <div className="as-add-row">
          <input
            type="text"
            placeholder="Ex: Camisetas, Calças, Acessórios..."
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
          />
          <button className="btn-primary" onClick={addCategory} disabled={saving || !newCategory.trim()}>
            <Plus size={15} /> Adicionar
          </button>
        </div>
      </div>

      {/* Add Size to Category */}
      <div className="as-section">
        <h2 className="as-subtitle"><Plus size={18} /> Adicionar Tamanho</h2>
        <div className="as-add-row">
          <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
            <option value="">Selecione a categoria</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            placeholder="Ex: P, M, G, GG, 36, 38..."
            value={newSize}
            onChange={e => setNewSize(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSize()}
          />
          <button className="btn-primary" onClick={addSize} disabled={saving || !selectedCat || !newSize.trim()}>
            <Plus size={15} /> Adicionar
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? <div className="spinner"></div> : (
        <div className="as-groups">
          {categories.length === 0 ? (
            <div className="as-empty">Nenhuma categoria cadastrada ainda.</div>
          ) : categories.map(cat => (
            <div className="as-group" key={cat}>
              <div className="as-group-title">
                {editingCategory && editingCategory.oldName === cat ? (
                  <div className="as-edit-row">
                    <input
                      type="text"
                      value={editingCategory.newName}
                      onChange={e => setEditingCategory({...editingCategory, newName: e.target.value})}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEditCategory()
                        if (e.key === 'Escape') cancelEditCategory()
                      }}
                      autoFocus
                    />
                    <button className="as-icon-btn save" onClick={saveEditCategory} title="Salvar">
                      <Check size={14} />
                    </button>
                    <button className="as-icon-btn cancel" onClick={cancelEditCategory} title="Cancelar">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="badge">{cat}</span>
                    <span className="as-count">{grouped[cat].length} tamanho(s)</span>
                    <div className="as-group-actions">
                      <button 
                        className="as-icon-btn edit" 
                        onClick={() => startEditCategory(cat)} 
                        title="Editar categoria"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button 
                        className="as-icon-btn delete-cat" 
                        onClick={() => deleteCategory(cat)} 
                        title="Excluir categoria"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="as-sizes-list">
                {grouped[cat].map(s => (
                  <div className="as-size-item" key={s.id}>
                    {editingSize && editingSize.id === s.id ? (
                      <div className="as-edit-row">
                        <input
                          type="text"
                          value={editingSize.value}
                          onChange={e => setEditingSize({...editingSize, value: e.target.value})}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEditSize()
                            if (e.key === 'Escape') cancelEditSize()
                          }}
                          autoFocus
                        />
                        <button className="as-icon-btn save" onClick={saveEditSize} title="Salvar">
                          <Check size={14} />
                        </button>
                        <button className="as-icon-btn cancel" onClick={cancelEditSize} title="Cancelar">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span>{s.size}</span>
                        <div className="as-size-actions">
                          <button 
                            className="as-icon-btn edit" 
                            onClick={() => startEditSize(s.id, s.size)} 
                            title="Editar tamanho"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button 
                            className="as-del" 
                            onClick={() => deleteSize(s.id)} 
                            title="Excluir tamanho"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}