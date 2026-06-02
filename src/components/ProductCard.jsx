import { ShoppingCart, Eye } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './ProductCard.css'

export default function ProductCard({ product, onDetails }) {
  const { addToCart } = useApp()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    const sizes = product.sizes || []
    const firstSize = sizes.length > 0 ? sizes[0] : 'Único'
    addToCart(product, firstSize)
    // Show quick toast
    const t = document.createElement('div')
    t.className = 'toast'
    t.textContent = '✓ Adicionado ao carrinho!'
    document.body.appendChild(t)
    setTimeout(() => t.remove(), 2500)
  }

  return (
    <div className="product-card">
      <div className="card-image" onClick={() => onDetails(product)}>
        <img src={product.image_url || 'https://via.placeholder.com/400x400/1a1a1a/1db954?text=Produto'} alt={product.title} loading="lazy" />
        <div className="card-overlay">
          <Eye size={20} />
        </div>
        {product.stock <= 0 && <div className="out-badge">Esgotado</div>}
      </div>
      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <h3 className="card-title">{product.title}</h3>
        <div className="card-price">R$ {Number(product.price).toFixed(2).replace('.', ',')}</div>
        <div className="card-actions">
          <button
            className="btn-primary card-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart size={15} /> 
            <span>
              Carrinho
            </span>
          </button>
          <button className="btn-outline card-btn" onClick={() => onDetails(product)}>
            <Eye size={15} />
            <span>
              Detalhes
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
