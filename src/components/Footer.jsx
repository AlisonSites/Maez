import './Footer.css'
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png'

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
                  <img src={Logo} alt="" />
                </span>
              </Link>
            </div>
            <p className="brand-description">
              Vista o hype, não é sobre chamar atenção.<br />
              É sobre estar no lugar certo!
            </p>
            <div className="rasta-stripes">
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
              <li><a href="#" target="_blank"> Princesa Isabel, 2020 - Centro, Macau/RN.</a></li>
              <li><a href="https://instagram.com/usemaez" target="_blank"> @usemaez</a></li>
              <li><a href="https://wa.me/5584996002433" target="_blank"> (84) 9 9600-2433</a></li>
              <li><a href="mailto:contato@usemaez.com"> contato@usemaez.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {currentYear} MAEZ</span>
          <span id='exceLink'>Feito pela Excelência Web -
            <a href="https://wa.me/5584996002433"> Fale conosco</a>
          </span>
        </div>
      </div>
    </footer>
  )
}