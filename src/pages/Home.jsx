import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import './Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('Todos')
  const [selectedModal, setSelectedModal] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (data) {
      setProducts(data)
      const cats = ['Todos', ...new Set(data.map(p => p.category).filter(Boolean))]
      setCategories(cats)
    }
    setLoading(false)
  }

  const filtered = products.filter(p => {
    const matchCat = selectedCat === 'Todos' || p.category === selectedCat
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-stripe red"></div>
          <div className="hero-stripe yellow"></div>
          <div className="hero-stripe green"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-tag">Nova Coleção</div>
          <h1 className="hero-title">
            
            <span className="hero-accent">VISTA A </span>
            MELHOR
            <br />
            PRATA DA 
            <span className="hero-accent-1"> REGIÃO
            </span>
          </h1>
          <p className="hero-sub">Correntes e acessórios com a alma da prata e ouro. Estilo autêntico, raízes verdadeiras.</p>
          <div className="hero-cta">
            <a href="#produtos" className="btn-primary hero-btn">Ver Produtos</a>
            <a href="#produtos" className="btn-outline hero-btn">Nova Coleção</a>
          </div>
        </div>
        <div className="hero-deco">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <section id="produtos" className="store-section">
        <div className="container">
          <div className="store-top">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="filter-cats">
              <SlidersHorizontal size={16} className="filter-icon" />
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${selectedCat === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="products-header">
            <h2 className="section-title">
              {selectedCat === 'Todos' ? 'Todos os Produtos' : selectedCat}
            </h2>
            <span className="products-count">{filtered.length} produto{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span>😔</span>
              <p>Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onDetails={setSelectedModal} />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedModal && (
        <ProductModal product={selectedModal} onClose={() => setSelectedModal(null)} />
      )}
    </div>
  )
}
