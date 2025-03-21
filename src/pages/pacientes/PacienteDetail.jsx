import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPaciente, reset } from '../../features/pacientes/pacienteSlice';
import { getProcedimentosByPaciente } from '../../features/procedimentos/procedimentoSlice';
import { FaUserEdit, FaArrowLeft, FaSpinner, FaNotesMedical, FaCalendarPlus } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, ListGroup } from 'react-bootstrap';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function PacienteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { paciente, isLoading: pacienteLoading } = useSelector((state) => state.pacientes);
  const { procedimentos, isLoading: procedimentosLoading } = useSelector(
    (state) => state.procedimentos
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getPaciente(id));
    dispatch(getProcedimentosByPaciente(id));

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, id, dispatch]);

  if (pacienteLoading || procedimentosLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <FaSpinner className="spinner-border" role="status" />
        <span className="sr-only ms-2">Carregando...</span>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Detalhes do Paciente</h1>
        </Col>
        <Col xs="auto" className="align-self-center">
          <Button variant="outline-secondary" onClick={() => navigate('/pacientes')} className="me-2">
            <FaArrowLeft className="me-2" /> Voltar
          </Button>
          <Button
            as={Link}
            to={`/pacientes/editar/${id}`}
            variant="outline-primary"
          >
            <FaUserEdit className="me-2" /> Editar
          </Button>
        </Col>
      </Row>

      {!paciente ? (
        <Alert variant="danger">Paciente não encontrado</Alert>
      ) : (
        <>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Informações Pessoais</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Nome:</strong> {paciente.nome}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Data de Nascimento:</strong> {formatDate(paciente.dataNascimento)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Telefone:</strong> {paciente.telefone}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Email:</strong> {paciente.email || 'Não informado'}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Endereço:</strong> {paciente.endereco || 'Não informado'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Plano de Saúde:</strong> {paciente.planoSaude}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Número da Carteirinha:</strong> {paciente.numeroCarteirinha || 'Não informado'}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              {paciente.observacoes && (
                <Row className="mt-3">
                  <Col>
                    <Card>
                      <Card.Header>Observações</Card.Header>
                      <Card.Body>
                        <p className="mb-0">{paciente.observacoes}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Procedimentos</h5>
              <Button
                as={Link}
                to={`/procedimentos/novo?paciente=${id}`}
                variant="primary"
                size="sm"
              >
                <FaCalendarPlus className="me-2" /> Novo Procedimento
              </Button>
            </Card.Header>
            <Card.Body>
              {procedimentos.length === 0 ? (
                <Alert variant="info">
                  Este paciente ainda não possui procedimentos registrados.
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Procedimento</th>
                      <th>Plano</th>
                      <th>Valor</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procedimentos.map((proc) => (
                      <tr key={proc._id}>
                        <td>{formatDate(proc.dataRealizacao)}</td>
                        <td>{proc.nome}</td>
                        <td>{proc.planoSaude}</td>
                        <td>R$ {proc.valorPlano.toFixed(2)}</td>
                        <td>
                          <Button
                            as={Link}
                            to={`/procedimentos/${proc._id}`}
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
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
}

export default PacienteDetail;