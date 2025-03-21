import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProcedimentos, reset } from '../../features/procedimentos/procedimentoSlice';
import { FaNotesMedical, FaCalendarPlus, FaSpinner, FaFilter } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Table, Alert, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ProcedimentosList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filtroPlano, setFiltroPlano] = useState('Todos');

  const { user } = useSelector((state) => state.auth);
  const { procedimentos, isLoading, isError, message } = useSelector(
    (state) => state.procedimentos
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    }

    dispatch(getProcedimentos());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const handleFiltroChange = (e) => {
    setFiltroPlano(e.target.value);
  };

  const procedimentosFiltrados = procedimentos.filter((procedimento) => {
    if (filtroPlano === 'Todos') return true;
    return procedimento.planoSaude === filtroPlano;
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <FaSpinner className="spinner-border" role="status" />
        <span className="sr-only ms-2">Carregando...</span>
      </div>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Procedimentos</h1>
          <p>Gerencie os procedimentos realizados</p>
        </Col>
        <Col xs="auto" className="align-self-center">
          <Button as={Link} to="/procedimentos/novo" variant="primary">
            <FaCalendarPlus className="me-2" /> Novo Procedimento
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label><FaFilter className="me-2" />Filtrar por Plano de Saúde</Form.Label>
            <Form.Select value={filtroPlano} onChange={handleFiltroChange}>
              <option value="Todos">Todos os Planos</option>
              <option value="SUS">SUS</option>
              <option value="APAS">APAS</option>
              <option value="UNIMED">UNIMED</option>
              <option value="Particular">Particular</option>
              <option value="Outros">Outros</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {procedimentos.length === 0 ? (
        <Alert variant="info">
          Você ainda não possui procedimentos registrados. Clique em "Novo Procedimento" para começar.
        </Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Paciente</th>
                  <th>Procedimento</th>
                  <th>Plano</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {procedimentosFiltrados.map((procedimento) => (
                  <tr key={procedimento._id}>
                    <td>{formatDate(procedimento.dataRealizacao)}</td>
                    <td>
                      <Link
                        to={`/pacientes/${procedimento.paciente._id}`}
                        className="text-decoration-none"
                      >
                        {procedimento.paciente.nome}
                      </Link>
                    </td>
                    <td>{procedimento.nome}</td>
                    <td>{procedimento.planoSaude}</td>
                    <td>R$ {procedimento.valorPlano.toFixed(2)}</td>
                    <td>
                      <Button
                        as={Link}
                        to={`/procedimentos/${procedimento._id}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        <FaNotesMedical className="me-1" /> Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default ProcedimentosList;