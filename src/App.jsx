import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PacientesList from './pages/pacientes/PacientesList';
import PacienteDetail from './pages/pacientes/PacienteDetail';
import PacienteForm from './pages/pacientes/PacienteForm';
import ProcedimentosList from './pages/procedimentos/ProcedimentosList';
import ProcedimentoDetail from './pages/procedimentos/ProcedimentoDetail';
import ProcedimentoForm from './pages/procedimentos/ProcedimentoForm';
import RelatoriosPage from './pages/relatorios/RelatoriosPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <Router>
        <div className="container-fluid p-0 d-flex flex-column min-vh-100">
          <Header />
          <main className="container flex-grow-1 py-3">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/pacientes" element={
                <PrivateRoute>
                  <PacientesList />
                </PrivateRoute>
              } />
              <Route path="/pacientes/novo" element={
                <PrivateRoute>
                  <PacienteForm />
                </PrivateRoute>
              } />
              <Route path="/pacientes/:id" element={
                <PrivateRoute>
                  <PacienteDetail />
                </PrivateRoute>
              } />
              <Route path="/pacientes/editar/:id" element={
                <PrivateRoute>
                  <PacienteForm />
                </PrivateRoute>
              } />
              
              <Route path="/procedimentos" element={
                <PrivateRoute>
                  <ProcedimentosList />
                </PrivateRoute>
              } />
              <Route path="/procedimentos/novo" element={
                <PrivateRoute>
                  <ProcedimentoForm />
                </PrivateRoute>
              } />
              <Route path="/procedimentos/:id" element={
                <PrivateRoute>
                  <ProcedimentoDetail />
                </PrivateRoute>
              } />
              <Route path="/procedimentos/editar/:id" element={
                <PrivateRoute>
                  <ProcedimentoForm />
                </PrivateRoute>
              } />
            
              <Route path="/relatorios" element={
                <PrivateRoute>
                  <RelatoriosPage />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;