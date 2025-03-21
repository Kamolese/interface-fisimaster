import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { FaChartBar, FaUserInjured, FaNotesMedical, FaMoneyBillWave, FaFileAlt, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
};

function RelatoriosPage() {
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [relatorioData, setRelatorioData] = useState({
    totalProcedimentos: 0,
    producao: 0,
    producaoParticular: 0,
    producaoPlanoSaude: 0,
    totalParticular: 0,
    totalPlanoSaude: 0,
    evolucoesGeradas: 0,
    pacientesAtendidos: 0,
    periodoInicio: null,
    periodoFim: null,
  });
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'),
  });

  const fetchRelatorioData = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = dateRange;
      const res = await axios.get(
        `/api/relatorios?startDate=${startDate}&endDate=${endDate}`,
        getConfig()
      );
      setRelatorioData(res.data);
    } catch (error) {
      console.error('Error fetching relatorio data:', error);
      toast.error('Erro ao carregar dados do relatório');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorioData();
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRelatorioData();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const handleOpenEmailModal = () => {
    setShowEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setEmailAddress('');
  };

  const handleEmailChange = (e) => {
    setEmailAddress(e.target.value);
  };

  const handleSendEmail = async () => {
    if (!emailAddress) {
      toast.error('Por favor, informe um endereço de email');
      return;
    }

    setSendingEmail(true);
    try {
      const { startDate, endDate } = dateRange;
      const response = await axios.post(
        `/api/relatorios/email?startDate=${startDate}&endDate=${endDate}`,
        { email: emailAddress },
        getConfig()
      );

      toast.success(response.data.message);
      handleCloseEmailModal();
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.error(error.response?.data?.message || 'Erro ao enviar o relatório por email');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div>
      <h1 className="page-header">Relatórios</h1>
      <p className="mb-4">Visualize os dados de produção e atendimentos.</p>

      <Card className="mb-4">
        <Card.Body>
          <h3 className="mb-3">Filtrar por Período</h3>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Inicial</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Final</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button type="submit" variant="primary" className="mb-3 w-100">
                  Filtrar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Carregando dados...</p>
        </div>
      ) : (
        <>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-3">Período do Relatório</h3>
              <p>
                <strong>De:</strong> {formatDate(relatorioData.periodoInicio)} <strong>até:</strong> {formatDate(relatorioData.periodoFim)}
              </p>
            </div>
            <Button 
              variant="success" 
              onClick={handleOpenEmailModal}
              disabled={loading}
              className="d-flex align-items-center"
            >
              <FaEnvelope className="me-2" /> Enviar Por Email
            </Button>
          </div>

          <Row className="mb-4">


            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaMoneyBillWave size={40} className="mb-3 text-warning" />
                  <h3>Produção Total</h3>
                  <h2 className="mt-3">{formatCurrency(relatorioData.producaoParticular + relatorioData.producaoPlanoSaude)}</h2>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaMoneyBillWave size={40} className="mb-3 text-success" />
                  <h3>Produção Particular</h3>
                  <h2 className="mt-3">{formatCurrency(relatorioData.producaoParticular)}</h2>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaMoneyBillWave size={40} className="mb-3 text-primary" />
                  <h3>Produção Planos</h3>
                  <h2 className="mt-3">{formatCurrency(relatorioData.producaoPlanoSaude)}</h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaFileAlt size={40} className="mb-3 text-info" />
                  <h3>Evoluções Geradas</h3>
                  <h2 className="mt-3">{relatorioData.evolucoesGeradas}</h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaUserInjured size={40} className="mb-3 text-warning" />
                  <h3>Pacientes Atendidos</h3>
                  <h2 className="mt-3">{relatorioData.pacientesAtendidos}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Email Modal */}
          <Modal show={showEmailModal} onHide={handleCloseEmailModal}>
            <Modal.Header closeButton>
              <Modal.Title>Enviar Relatório por Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Endereço de Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite o email para envio"
                  value={emailAddress}
                  onChange={handleEmailChange}
                  required
                />
                <Form.Text className="text-muted">
                  O relatório será enviado para este endereço de email.
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEmailModal}>
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSendEmail}
                disabled={sendingEmail}
              >
                {sendingEmail ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Enviando...
                  </>
                ) : (
                  'Enviar'
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
}

export default RelatoriosPage;