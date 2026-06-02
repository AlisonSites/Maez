import './Footer.css'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <Link to="/" className="logo-link">
                {/* <span className="logo-icon">💎</span> */}
                <span className="logo-text">
                  <span className="logo-green">JÓIAS</span>
                  <span className="logo-yelo"> DO </span>
                  <span className="logo-red"> KAUAN</span>
                </span>
              </Link>
            </div>
            <p className="brand-description">
              Moda com alma, estilo com raízes. <br />
              Viva o reggae. Viva a cultura.
            </p>
            <div className="rasta-stripes">
              <span className="stripe-red"></span>
              <span className="stripe-yellow"></span>
              <span className="stripe-green"></span>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Navegação</h3>
            <ul className="footer-links-list">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/produtos">Produtos</Link></li>
              <li><Link to="/sobre">Sobre Nós</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Contato</h3>
            <ul className="footer-contact-list">
              <li><a href="https://instagram.com/joiasdokauan" target="_blank"> @joiasdokauan</a></li>
              <li><a href="https://wa.me/5584996002433" target="_blank"> (84) 9 9600-2433</a></li>
              <li><a href="mailto:contato@joiasdokauan.com"> contato@joiasdokauan.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {currentYear} Joias Do Kauan</span>
          <span id='exceLink'>Feito pela ExcelênciaWeb - 
            <a href="https://wa.me/5584996002433"> Fale conosco</a>
          </span>
        </div>
      </div>
    </footer>
  )
}