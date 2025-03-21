import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createPaciente, getPaciente, updatePaciente, reset } from '../../features/pacientes/pacienteSlice';
import { FaUser, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

function PacienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { paciente, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.pacientes
  );

  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    endereco: '',
    planoSaude: 'SUS',
    numeroCarteirinha: '',
    observacoes: '',
  });

  const { nome, dataNascimento, telefone, email, endereco, planoSaude, numeroCarteirinha, observacoes } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!user) {
      navigate('/login');
      return;
    }

    if (id) {
      dispatch(getPaciente(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [id, user, navigate, isError, message, dispatch]);

  useEffect(() => {
    if (id && paciente && paciente._id === id) {
      const pacienteData = { ...paciente };
      
      if (pacienteData.dataNascimento) {
        const date = new Date(pacienteData.dataNascimento);
        pacienteData.dataNascimento = date.toISOString().split('T')[0];
      }
      
      setFormData(pacienteData);
    }
  }, [id, paciente]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!nome || !telefone || !planoSaude) {
      toast.error('Por favor preencha os campos obrigatórios');
      return;
    }

    const pacienteData = {
      nome,
      dataNascimento,
      telefone,
      email,
      endereco,
      planoSaude,
      numeroCarteirinha,
      observacoes,
    };

    if (id) {
      dispatch(updatePaciente({ pacienteId: id, pacienteData }));
      toast.success('Paciente atualizado com sucesso!');
    } else {
      dispatch(createPaciente(pacienteData));
      toast.success('Paciente cadastrado com sucesso!');
    }

    navigate('/pacientes');
  };

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
          <h1>{id ? 'Editar Paciente' : 'Novo Paciente'}</h1>
          <p>{id ? 'Atualize os dados do paciente' : 'Cadastre um novo paciente'}</p>
        </Col>
        <Col xs="auto" className="align-self-center">
          <Button variant="outline-secondary" onClick={() => navigate('/pacientes')}>
            <FaArrowLeft className="me-2" /> Voltar
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome*</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={nome}
                    onChange={onChange}
                    placeholder="Nome completo"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataNascimento"
                    value={dataNascimento}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone*</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefone"
                    value={telefone}
                    onChange={onChange}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="email@exemplo.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                name="endereco"
                value={endereco}
                onChange={onChange}
                placeholder="Rua, número, bairro, cidade, estado"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plano de Saúde*</Form.Label>
                  <Form.Select
                    name="planoSaude"
                    value={planoSaude}
                    onChange={onChange}
                    required
                  >
                    <option value="SUS">SUS</option>
                    <option value="Unimed">Unimed</option>
                    <option value="Bradesco">Bradesco</option>
                    <option value="Amil">Amil</option>
                    <option value="Particular">Particular</option>
                    <option value="Outros">Outros</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Número da Carteirinha</Form.Label>
                  <Form.Control
                    type="text"
                    name="numeroCarteirinha"
                    value={numeroCarteirinha}
                    onChange={onChange}
                    placeholder="Número da carteirinha do plano"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observacoes"
                value={observacoes}
                onChange={onChange}
                placeholder="Informações adicionais sobre o paciente"
              />
            </Form.Group>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button variant="primary" type="submit">
                {id ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PacienteForm;