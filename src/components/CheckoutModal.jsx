import { useState } from 'react'
import { X, MapPin, Truck, CreditCard, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './CheckoutModal.css'

const WHATSAPP_NUMBER = '5584996002433'

export default function CheckoutModal({ onClose }) {
  const { cart, cartTotal, clearCart } = useApp()
  const [step, setStep] = useState(1) // 1: delivery, 2: payment
  const [form, setForm] = useState({
    name: '',
    deliveryType: 'entrega',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    payment: 'pix'
  })
  const [sending, setSending] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const isStep1Valid = () => {
    if (!form.name.trim()) return false
    if (form.deliveryType === 'entrega') {
      return form.street && form.number && form.neighborhood && form.city
    }
    return true
  }

  const buildWhatsAppMessage = () => {
    const lines = []
    lines.push('🛍️ *NOVO PEDIDO - ReggaeStore*')
    lines.push('━━━━━━━━━━━━━━━━━━━━━━')
    lines.push(`👤 *Cliente:* ${form.name}`)
    lines.push('')
    lines.push('📦 *ITENS DO PEDIDO:*')
    cart.forEach(item => {
      lines.push(`• *${item.title}*`)
      lines.push(`  ID: \`${item.id}\` | Tamanho: ${item.size}`)
      lines.push(`  Qtd: ${item.qty} × R$ ${Number(item.price).toFixed(2).replace('.', ',')} = R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}`)
    })
    lines.push('')
    lines.push(`💰 *TOTAL: R$ ${cartTotal.toFixed(2).replace('.', ',')}*`)
    lines.push('')
    lines.push('🚚 *ENTREGA:*')
    if (form.deliveryType === 'entrega') {
      lines.push(`Tipo: Entrega em domicílio`)
      lines.push(`Endereço: ${form.street}, ${form.number}`)
      lines.push(`Bairro: ${form.neighborhood}`)
      lines.push(`Cidade: ${form.city}`)
    } else {
      lines.push(`Tipo: Retirada na loja`)
    }
    lines.push('')
    const paymentLabels = { dinheiro: '💵 Dinheiro', pix: '📱 PIX', credito: '💳 Crédito', debito: '💳 Débito' }
    lines.push(`💳 *PAGAMENTO:* ${paymentLabels[form.payment]}`)
    lines.push('')
    lines.push('━━━━━━━━━━━━━━━━━━━━━━')
    lines.push('_Pedido enviado pelo site ReggaeStore_')
    return lines.join('\n')
  }

  const handleSend = () => {
    setSending(true)
    const msg = encodeURIComponent(buildWhatsAppMessage())
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
    window.open(url, '_blank')
    setTimeout(() => {
      clearCart()
      onClose()
      setSending(false)
    }, 1000)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box checkout-modal" onClick={e => e.stopPropagation()}>
        <div className="checkout-header">
          <div>
            <div className="checkout-steps">
              <span className={step >= 1 ? 'active' : ''}>1. Entrega</span>
              <span className="step-sep">›</span>
              <span className={step >= 2 ? 'active' : ''}>2. Pagamento</span>
            </div>
            <h2 className="checkout-title">Finalizar Pedido</h2>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="checkout-body">
          {step === 1 && (
            <div className="checkout-step">
              <div className="form-group">
                <label>Seu Nome *</label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>

              <div className="delivery-toggle">
                <button
                  className={`toggle-btn ${form.deliveryType === 'retirada' ? 'active' : ''}`}
                  onClick={() => set('deliveryType', 'retirada')}
                >
                  <MapPin size={16} /> Retirada
                </button>
                <button
                  className={`toggle-btn ${form.deliveryType === 'entrega' ? 'active' : ''}`}
                  onClick={() => set('deliveryType', 'entrega')}
                >
                  <Truck size={16} /> Entrega
                </button>
              </div>

              {form.deliveryType === 'entrega' && (
                <div className="address-fields">
                  <div className="form-group">
                    <label>Rua *</label>
                    <input type="text" placeholder="Nome da rua" value={form.street} onChange={e => set('street', e.target.value)} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Número *</label>
                      <input type="text" placeholder="Nº" value={form.number} onChange={e => set('number', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Bairro *</label>
                      <input type="text" placeholder="Bairro" value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cidade *</label>
                    <input type="text" placeholder="Cidade" value={form.city} onChange={e => set('city', e.target.value)} />
                  </div>
                </div>
              )}

              <button
                className="btn-primary checkout-next"
                onClick={() => setStep(2)}
                disabled={!isStep1Valid()}
              >
                Próximo → Pagamento
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-step">
              <button className="back-step" onClick={() => setStep(1)}>← Voltar</button>

              <div className="payment-section">
                <div className="payment-label"><CreditCard size={16} /> Forma de Pagamento</div>
                <div className="payment-options">
                  {[
                    { value: 'dinheiro', label: '💵 Dinheiro' },
                    { value: 'pix', label: '📱 PIX' },
                    { value: 'credito', label: '💳 Crédito' },
                    { value: 'debito', label: '💳 Débito' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      className={`payment-btn ${form.payment === opt.value ? 'active' : ''}`}
                      onClick={() => set('payment', opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="order-summary-mini">
                <div className="os-title">Resumo do Pedido</div>
                {cart.map(item => (
                  <div className="os-row" key={`${item.id}-${item.size}`}>
                    <span>{item.title} ({item.size}) ×{item.qty}</span>
                    <span>R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
                <div className="os-total">
                  <span>Total</span>
                  <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <button
                className="btn-primary checkout-send"
                onClick={handleSend}
                disabled={sending}
              >
                <Send size={16} />
                {sending ? 'Enviando...' : 'Enviar Pedido via WhatsApp'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
