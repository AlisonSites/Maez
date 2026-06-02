import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const addToCart = (product, size) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size)
      if (existing) {
        return prev.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, size, qty: 1 }]
    })
  }

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.size === size)))
  }

  const updateQty = (id, size, qty) => {
    if (qty <= 0) { removeFromCart(id, size); return }
    setCart(prev => prev.map(i => i.id === id && i.size === size ? { ...i, qty } : i))
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const signOut = async () => { await supabase.auth.signOut() }

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount, user, signOut, loading }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
