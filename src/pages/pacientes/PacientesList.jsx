import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPacientes, reset } from '../../features/pacientes/pacienteSlice';
import { FaUserPlus, FaUserEdit, FaUserMinus, FaSpinner } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Table, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PacientesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { pacientes, isLoading, isError, message } = useSelector(
    (state) => state.pacientes
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    }

    dispatch(getPacientes());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

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
          <h1>Pacientes</h1>
          <p>Gerencie seus pacientes</p>
        </Col>
        <Col xs="auto" className="align-self-center">
          <Button as={Link} to="/pacientes/novo" variant="primary">
            <FaUserPlus className="me-2" /> Novo Paciente
          </Button>
        </Col>
      </Row>

      {pacientes.length === 0 ? (
        <Alert variant="info">
          Você ainda não possui pacientes cadastrados. Clique em "Novo Paciente" para começar.
        </Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Plano de Saúde</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente) => (
                  <tr key={paciente._id}>
                    <td>
                      <Link to={`/pacientes/${paciente._id}`} className="text-decoration-none">
                        {paciente.nome}
                      </Link>
                    </td>
                    <td>{paciente.telefone}</td>
                    <td>{paciente.planoSaude}</td>
                    <td>
                      <Button
                        as={Link}
                        to={`/pacientes/${paciente._id}`}
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                      >
                        Ver
                      </Button>
                      <Button
                        as={Link}
                        to={`/pacientes/editar/${paciente._id}`}
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                      >
                        <FaUserEdit /> Editar
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

export default PacientesList;