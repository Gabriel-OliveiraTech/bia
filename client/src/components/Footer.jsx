import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>Formação AWS 2026</p>
        <Link to="/about" className="footer-link">
          Sobre a BIA
        </Link>
        <Link to="/versao" className="footer-link">
          Versão da API
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
