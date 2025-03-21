import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import { FaUser } from 'react-icons/fa';
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('As senhas não conferem');
    } else {
      const userData = {
        name,
        email,
        password,
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card className="p-4">
          <Card.Body>
            <div className="text-center mb-4">
              <h1>
                <FaUser className="me-2" /> Cadastro
              </h1>
              <p>Crie sua conta para gerenciar pacientes e procedimentos</p>
            </div>

            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Digite seu nome completo"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Digite seu email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Digite sua senha"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password2">
                <Form.Label>Confirme a Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  placeholder="Confirme sua senha"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Cadastrar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Register;