import { useState } from 'react'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import CheckoutModal from '../components/CheckoutModal'
import './Cart.css'

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal } = useApp()
  const [showCheckout, setShowCheckout] = useState(false)

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={64} />
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione produtos para continuar</p>
        <Link to="/" className="btn-primary">← Ver Produtos</Link>
      </div>
    )
  }

  return (
    <div className="container cart-page">
      <div className="cart-header">
        <Link to="/" className="back-link"><ArrowLeft size={18} /> Continuar comprando</Link>
        <h1 className="cart-title">Meu Carrinho</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div className="cart-item" key={`${item.id}-${item.size}`}>
              <img
                src={item.image_url || 'https://via.placeholder.com/100x100/1a1a1a/1db954?text=P'}
                alt={item.title}
                className="cart-item-img"
              />
              <div className="cart-item-info">
                <span className="cart-item-cat">{item.category}</span>
                <h3 className="cart-item-title">{item.title}</h3>
                <span className="cart-item-size">Tamanho: <strong>{item.size}</strong></span>
                <div className="cart-item-price">R$ {Number(item.price).toFixed(2).replace('.', ',')}</div>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQty(item.id, item.size, item.qty - 1)}><Minus size={14} /></button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.size, item.qty + 1)}><Plus size={14} /></button>
                </div>
                <div className="cart-item-subtotal">
                  R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
                </div>
                <button className="cart-remove" onClick={() => removeFromCart(item.id, item.size)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Resumo</h2>
          <div className="summary-rows">
            {cart.map(item => (
              <div className="summary-row" key={`${item.id}-${item.size}`}>
                <span>{item.title} ({item.size}) × {item.qty}</span>
                <span>R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total">
            <span>Total</span>
            <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <button className="btn-primary summary-btn" onClick={() => setShowCheckout(true)}>
            <ShoppingBag size={16} /> Finalizar Pedido
          </button>
        </div>
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  )
}
