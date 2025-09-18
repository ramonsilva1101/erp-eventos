import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <h1>ERP Eventos</h1>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/equipamentos">Equipamentos</Link>
        <Link to="/clientes">Clientes</Link>
      </nav>
    </header>
  );
}

export default Header;