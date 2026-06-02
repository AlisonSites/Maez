import { useState, useEffect, useRef } from 'react'
import { X, Upload, ImagePlus, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import './ProductFormModal.css'

export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = !!product
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    title: '', description: '', price: '', stock: '',
    category: '', image_url: '', active: true, sizes: []
  })
  const [categories, setCategories] = useState([])
  const [availableSizes, setAvailableSizes] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Upload state
  const [uploadState, setUploadState] = useState('idle') // idle | uploading | success | error
  const [uploadMsg, setUploadMsg] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || 0,
        category: product.category || '',
        image_url: product.image_url || '',
        active: product.active !== false,
        sizes: product.sizes || []
      })
    }
    fetchCategoriesAndSizes()
  }, [product])

  async function fetchCategoriesAndSizes() {
    const { data: sizesData } = await supabase.from('product_sizes').select('*').order('category')
    if (sizesData) {
      const cats = [...new Set(sizesData.map(s => s.category))]
      setCategories(cats)
      setAvailableSizes(sizesData)
    }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const getSizesForCategory = () => {
    if (!form.category) return []
    return availableSizes.filter(s => s.category === form.category).map(s => s.size)
  }

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
    }))
  }

  // ─── UPLOAD HANDLER ───────────────────────────────────────────
  const processFile = async (file) => {
    if (!file) return

    // Validações
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setUploadState('error')
      setUploadMsg('Formato inválido. Use JPG, PNG, WEBP ou GIF.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadState('error')
      setUploadMsg('Imagem muito grande. Máximo 5MB.')
      return
    }

    setUploadState('uploading')
    setUploadMsg('Enviando imagem...')

    try {
      // Nome único: pasta produtos/ + timestamp + extensão
      const ext = file.name.split('.').pop().toLowerCase()
      const fileName = `produtos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })

      if (uploadError) {
        // Se falhar no Storage, tenta salvar como base64 diretamente
        console.warn('Storage error, usando base64:', uploadError.message)
        await fallbackBase64(file)
        return
      }

      // Pega a URL pública
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(data.path)

      set('image_url', urlData.publicUrl)
      setUploadState('success')
      setUploadMsg('Imagem enviada com sucesso!')

    } catch (err) {
      console.error('Upload exception:', err)
      await fallbackBase64(file)
    }
  }

  // Fallback: converte para base64 e salva na URL (funciona sem Storage configurado)
  const fallbackBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        set('image_url', e.target.result)
        setUploadState('success')
        setUploadMsg('Imagem carregada localmente!')
        resolve()
      }
      reader.onerror = () => {
        setUploadState('error')
        setUploadMsg('Erro ao processar imagem.')
        resolve()
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileInput = (e) => {
    processFile(e.target.files[0])
    // Reset input para permitir selecionar o mesmo arquivo novamente
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)
  // ─────────────────────────────────────────────────────────────

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
      image_url: form.image_url,
      active: form.active,
      sizes: form.sizes
    }
    if (isEdit) {
      const { error } = await supabase.from('products').update(payload).eq('id', product.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('products').insert([payload])
      if (error) { setError(error.message); setSaving(false); return }
    }
    setSaving(false)
    onSaved()
  }

  const sizesForCat = getSizesForCategory()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box pf-modal" onClick={e => e.stopPropagation()}>
        <div className="pf-header">
          <h2 className="pf-title">{isEdit ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {error && <div className="pf-error"><AlertCircle size={15} /> {error}</div>}

        <form onSubmit={handleSave} className="pf-form">
          <div className="pf-grid">

            {/* ── ESQUERDA ── */}
            <div className="pf-left">
              <div className="form-group">
                <label>Título *</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Nome do produto" />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descrição detalhada..." style={{ resize: 'vertical' }} />
              </div>
              <div className="pf-row">
                <div className="form-group">
                  <label>Preço (R$) *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} required placeholder="0,00" />
                </div>
                <div className="form-group">
                  <label>Estoque *</label>
                  <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} required placeholder="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <select value={form.category} onChange={e => { set('category', e.target.value); set('sizes', []) }}>
                  <option value="">Selecione a categoria</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {sizesForCat.length > 0 && (
                <div className="form-group">
                  <label>Tamanhos disponíveis</label>
                  <div className="sizes-select">
                    {sizesForCat.map(s => (
                      <button type="button" key={s} className={`size-btn ${form.sizes.includes(s) ? 'active' : ''}`} onClick={() => toggleSize(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="form-group">
                <label>Status</label>
                <div className="pf-toggle">
                  <button type="button" className={`toggle-btn ${form.active ? 'active' : ''}`} onClick={() => set('active', true)}>✓ Ativo</button>
                  <button type="button" className={`toggle-btn ${!form.active ? 'active' : ''}`} onClick={() => set('active', false)}>✕ Inativo</button>
                </div>
              </div>
            </div>

            {/* ── DIREITA ── */}
            <div className="pf-right">

              {/* Área de Upload (drag & drop) */}
              <div
                className={`pf-dropzone ${dragOver ? 'drag-over' : ''} ${uploadState === 'success' && form.image_url ? 'has-image' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />

                {form.image_url ? (
                  <div className="pf-preview-inner">
                    <img src={form.image_url} alt="Preview" />
                    <div className="pf-preview-overlay">
                      <ImagePlus size={20} />
                      <span>Trocar imagem</span>
                    </div>
                  </div>
                ) : (
                  <div className="pf-dropzone-placeholder">
                    {uploadState === 'uploading' ? (
                      <>
                        <Loader size={28} className="spin-icon" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={28} />
                        <span>Clique ou arraste uma imagem aqui</span>
                        <small>JPG, PNG, WEBP, GIF — máx. 5MB</small>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Status do upload */}
              {uploadState !== 'idle' && (
                <div className={`pf-upload-status ${uploadState}`}>
                  {uploadState === 'uploading' && <Loader size={13} className="spin-icon" />}
                  {uploadState === 'success' && <CheckCircle size={13} />}
                  {uploadState === 'error' && <AlertCircle size={13} />}
                  <span>{uploadMsg}</span>
                </div>
              )}

              {/* URL manual (alternativa) */}
              <div className="form-group" style={{ marginTop: '10px' }}>
                <label>Ou cole uma URL de imagem</label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={e => { set('image_url', e.target.value); setUploadState('idle') }}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
          </div>

          <div className="pf-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving || uploadState === 'uploading'}>
              {saving ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}