import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { FaChartBar, FaUserInjured, FaNotesMedical, FaMoneyBillWave, FaFileAlt, FaEnvelope, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.token) {
    throw new Error('Usuário não autenticado');
  }
  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
};

function RelatoriosPage() {
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailType, setEmailType] = useState('completo');
  const [relatorioData, setRelatorioData] = useState({
    totalProcedimentos: 0,
    producao: 0,
    producaoParticular: 0,
    producaoPlanoSaude: 0,
    totalParticular: 0,
    totalPlanoSaude: 0,
    evolucoesGeradas: 0,
    evolucoesGeradasParticular: 0,
    evolucoesGeradasPlanoSaude: 0,
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
      console.log('Fazendo requisição para:', `${axios.defaults.baseURL}/relatorios?startDate=${startDate}&endDate=${endDate}`);
      const res = await axios.get(
        `/relatorios?startDate=${startDate}&endDate=${endDate}`,
        getConfig()
      );
      console.log('Resposta recebida:', res.data);
      setRelatorioData(res.data);
    } catch (error) {
      console.error('Error fetching relatorio data:', error.response || error);
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
    setEmailType('completo');
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
      let endpoint = '/relatorios/email';
      
      if (emailType === 'particular') {
        endpoint = '/relatorios/email/particular';
      } else if (emailType === 'plano-saude') {
        endpoint = '/relatorios/email/plano-saude';
      }
      
      const response = await axios.post(
        `${endpoint}?startDate=${startDate}&endDate=${endDate}`,
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

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      const { startDate, endDate } = dateRange;
      
      console.log('Iniciando download do PDF...');
      console.log('Período:', startDate, 'até', endDate);
      
      const response = await axios.get(
        `/relatorios/download?startDate=${startDate}&endDate=${endDate}`,
        {
          ...getConfig(),
          responseType: 'blob' // Importante para download de arquivos
        }
      );

      console.log('Resposta recebida:', response);

      // Criar URL do blob e fazer download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nome do arquivo baseado no período
      const fileName = `relatorio-${startDate}-${endDate}.pdf`;
      link.setAttribute('download', fileName);
      
      // Adicionar ao DOM, clicar e remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL do blob
      window.URL.revokeObjectURL(url);
      
      toast.success('Relatório baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      
      if (error.message === 'Usuário não autenticado') {
        toast.error('Sessão expirada. Faça login novamente.');
        // Redirecionar para login se necessário
        window.location.href = '/login';
      } else if (error.response?.status === 401) {
        toast.error('Não autorizado. Faça login novamente.');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.message || 'Erro ao baixar o relatório em PDF');
      }
    } finally {
      setDownloadingPDF(false);
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
            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                onClick={handleDownloadPDF}
                disabled={loading || downloadingPDF}
                className="d-flex align-items-center"
              >
                {downloadingPDF ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Baixando...
                  </>
                ) : (
                  <>
                    <FaDownload className="me-2" /> Baixar PDF
                  </>
                )}
              </Button>
              <Button 
                variant="success" 
                onClick={handleOpenEmailModal}
                disabled={loading}
                className="d-flex align-items-center"
              >
                <FaEnvelope className="me-2" /> Enviar Por Email
              </Button>
            </div>
          </div>

          <h3 className="section-title mb-3">Visão Geral</h3>
          <Row className="mb-4">
            <Col md={6} lg={4} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaMoneyBillWave size={40} className="mb-3 text-warning" />
                  <h3>Produção Total</h3>
                  <h2 className="mt-3">{formatCurrency(relatorioData.producaoParticular + relatorioData.producaoPlanoSaude)}</h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaFileAlt size={40} className="mb-3 text-info" />
                  <h3>Evoluções Geradas</h3>
                  <h2 className="mt-3">{relatorioData.evolucoesGeradas}</h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={4} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaUserInjured size={40} className="mb-3 text-warning" />
                  <h3>Pacientes Atendidos</h3>
                  <h2 className="mt-3">{relatorioData.pacientesAtendidos}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h3 className="section-title mb-3">Pacientes Particulares</h3>
          <Row className="mb-4">
            <Col md={6} lg={6} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaMoneyBillWave size={40} className="mb-3 text-success" />
                  <h3>Produção Particular</h3>
                  <h2 className="mt-3">{formatCurrency(relatorioData.producaoParticular)}</h2>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} lg={6} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaFileAlt size={40} className="mb-3 text-success" />
                  <h3>Evoluções Particular</h3>
                  <h2 className="mt-3">{relatorioData.evolucoesGeradasParticular}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h3 className="section-title mb-3">Pacientes de Planos de Saúde</h3>
          <Row className="mb-4">
            <Col md={6} lg={6} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaMoneyBillWave size={40} className="mb-3 text-primary" />
                  <h3>Produção Planos</h3>
                  <h2 className="mt-3">{formatCurrency(relatorioData.producaoPlanoSaude)}</h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={6} className="mb-4">
              <Card className="h-100 stat-card">
                <Card.Body className="text-center">
                  <FaFileAlt size={40} className="mb-3 text-primary" />
                  <h3>Evoluções Planos</h3>
                  <h2 className="mt-3">{relatorioData.evolucoesGeradasPlanoSaude}</h2>
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
              
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Relatório</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    label="Relatório Completo"
                    name="emailType"
                    id="emailTypeCompleto"
                    value="completo"
                    checked={emailType === 'completo'}
                    onChange={() => setEmailType('completo')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    label="Somente Pacientes Particulares"
                    name="emailType"
                    id="emailTypeParticular"
                    value="particular"
                    checked={emailType === 'particular'}
                    onChange={() => setEmailType('particular')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    label="Somente Planos de Saúde"
                    name="emailType"
                    id="emailTypePlanoSaude"
                    value="plano-saude"
                    checked={emailType === 'plano-saude'}
                    onChange={() => setEmailType('plano-saude')}
                  />
                </div>
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
