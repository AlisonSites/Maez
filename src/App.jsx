import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Login from './pages/Login'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminSizes from './pages/admin/AdminSizes'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAdmins from './pages/admin/AdminAdmins'

function ClientLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
          <Route path="/cart" element={<ClientLayout><Cart /></ClientLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="sizes" element={<AdminSizes />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="admins" element={<AdminAdmins />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
