import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-light py-3 mt-auto">
      <Container className="text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} FisiMaster - Sistema de Gestão para Fisioterapeutas</p>
      </Container>
    </footer>
  );
}

export default Footer;