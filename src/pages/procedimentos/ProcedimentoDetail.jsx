import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProcedimento, deleteProcedimento, reset } from '../../features/procedimentos/procedimentoSlice';
import { FaEdit, FaTrash, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ProcedimentoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { procedimento, isLoading, isError, message } = useSelector(
    (state) => state.procedimentos
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getProcedimento(id));

    return () => {
      dispatch(reset());
    };
  }, [id, user, navigate, isError, message, dispatch]);

  const onDelete = () => {
    dispatch(deleteProcedimento(id));
    toast.success('Procedimento excluído com sucesso');
    navigate('/procedimentos');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <FaSpinner className="spinner-border" role="status" />
        <span className="sr-only ms-2">Carregando...</span>
      </div>
    );
  }

  if (!procedimento || !procedimento._id) {
    return (
      <Container>
        <Alert variant="danger">Procedimento não encontrado</Alert>
        <Button variant="secondary" onClick={() => navigate('/procedimentos')}>
          <FaArrowLeft className="me-2" /> Voltar para Procedimentos
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Detalhes do Procedimento</h1>
        </Col>
        <Col xs="auto" className="align-self-center">
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/procedimentos')}
            className="me-2"
          >
            <FaArrowLeft className="me-2" /> Voltar
          </Button>
          <Button
            as={Link}
            to={`/procedimentos/editar/${id}`}
            variant="outline-primary"
            className="me-2"
          >
            <FaEdit className="me-2" /> Editar
          </Button>
          <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
            <FaTrash className="me-2" /> Excluir
          </Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Informações do Procedimento</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Nome:</strong> {procedimento.nome}
              </p>
              <p>
                <strong>Data de Realização:</strong> {formatDate(procedimento.dataRealizacao)}
              </p>
              <p>
                <strong>Paciente:</strong>{' '}
                {procedimento.paciente && (
                  <Link
                    to={`/pacientes/${procedimento.paciente._id}`}
                    className="text-decoration-none"
                  >
                    {procedimento.paciente.nome}
                  </Link>
                )}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Plano de Saúde:</strong> {procedimento.planoSaude}
              </p>
              <p>
                <strong>Valor do Plano:</strong> R$ {procedimento.valorPlano?.toFixed(2)}
              </p>
              <p>
                <strong>Valor Fixo:</strong> R$ {procedimento.valor?.toFixed(2)} <small className="text-muted">(valor padrão para cada procedimento)</small>
              </p>
            </Col>
          </Row>

          {procedimento.descricao && (
            <Row className="mt-3">
              <Col>
                <Card>
                  <Card.Header>Descrição</Card.Header>
                  <Card.Body>
                    <p className="mb-0">{procedimento.descricao}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          <Row className="mt-3">
            <Col>
              <Card>
                <Card.Header>Evolução</Card.Header>
                <Card.Body>
                  <p className="mb-0">{procedimento.evolucao}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este procedimento? Esta ação não pode ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProcedimentoDetail;