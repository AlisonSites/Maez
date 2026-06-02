import { useState } from 'react'
import { X, ShoppingCart, Tag, Layers, Package } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './ProductModal.css'

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useApp()
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Único')
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box product-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <div className="pm-grid">
          <div className="pm-image">
            <img src={product.image_url || 'https://via.placeholder.com/500x500/1a1a1a/1db954?text=Produto'} alt={product.title} />
          </div>
          <div className="pm-info">
            <span className="pm-category"><Tag size={12} /> {product.category}</span>
            <h2 className="pm-title">{product.title}</h2>
            <div className="pm-price">R$ {Number(product.price).toFixed(2).replace('.', ',')}</div>
            <p className="pm-desc">{product.description || 'Produto exclusivo da ReggaeStore.'}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="pm-sizes">
                <div className="pm-sizes-label"><Layers size={13} /> Tamanho</div>
                <div className="sizes-grid">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="pm-stock">
              <Package size={14} />
              {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
            </div>

            <button
              className={`btn-primary pm-add ${added ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={16} />
              {added ? 'Adicionado! ✓' : 'Adicionar ao Carrinho'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
