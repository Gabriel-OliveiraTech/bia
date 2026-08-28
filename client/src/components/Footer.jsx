import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>Formação AWS 2026</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/about" className="footer-link">
            Sobre a BIA
          </Link>
          <Link to="/versao" className="footer-link">
            Versão
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
