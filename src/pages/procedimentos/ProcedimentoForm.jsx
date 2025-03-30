import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createProcedimento, getProcedimento, updateProcedimento, reset } from '../../features/procedimentos/procedimentoSlice';
import { getPacientes } from '../../features/pacientes/pacienteSlice';
import { FaNotesMedical, FaArrowLeft, FaSpinner, FaSearch } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Select from 'react-select';

function ProcedimentoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const pacienteIdFromQuery = queryParams.get('paciente');

  const { user } = useSelector((state) => state.auth);
  const { procedimento, isLoading: procedimentoLoading, isError, message } = useSelector(
    (state) => state.procedimentos
  );
  const { pacientes, isLoading: pacientesLoading } = useSelector((state) => state.pacientes);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    paciente: pacienteIdFromQuery || '',
    dataRealizacao: new Date().toISOString().split('T')[0],
    evolucao: '',
    planoSaude: 'SUS',
    valorPlano: '',
  });

  const { nome, descricao, paciente, dataRealizacao, evolucao, planoSaude, valorPlano } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getPacientes());

    if (id) {
      dispatch(getProcedimento(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [id, user, navigate, isError, message, dispatch]);

  useEffect(() => {
    if (id && procedimento && procedimento._id === id) {
      const procedimentoData = { ...procedimento };
      
      if (procedimentoData.dataRealizacao) {
        const date = new Date(procedimentoData.dataRealizacao);
        procedimentoData.dataRealizacao = date.toISOString().split('T')[0];
      }
      
      if (procedimentoData.paciente && typeof procedimentoData.paciente === 'object') {
        procedimentoData.paciente = procedimentoData.paciente._id;
      }
      
      setFormData(procedimentoData);
    }
  }, [id, procedimento]);

  const onChange = (e) => {
    const { name, value } = e.target;
    
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    
    if (name === 'planoSaude') {
      switch (value) {
        case 'SUS':
          updatedFormData.valorPlano = '6.35';
          break;
        case 'UNIMED':
          updatedFormData.valorPlano = '5';
          break;
        case 'APAS':
          updatedFormData.valorPlano = '5';
          break;
        case 'Particular':
          break;
        default:
          break;
      }
    }
    
    setFormData(updatedFormData);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!paciente || !planoSaude || !valorPlano) {
      toast.error('Por favor preencha os campos obrigatórios');
      return;
    }

    const procedimentoData = {
      nome,
      descricao,
      paciente,
      dataRealizacao,
      evolucao,
      planoSaude,
      valorPlano: parseFloat(valorPlano),
    };

    if (id) {
      dispatch(updateProcedimento({ id, procedimentoData }));
      toast.success('Procedimento atualizado com sucesso!');
    } else {
      dispatch(createProcedimento(procedimentoData));
      toast.success('Procedimento registrado com sucesso!');
    }

    navigate('/procedimentos');
  };

  if (procedimentoLoading || pacientesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <FaSpinner className="spinner-border" role="status" />
        <span className="sr-only ms-2">Carregando...</span>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPacientes, setFilteredPacientes] = useState([]);

  useEffect(() => {
    if (pacientes && pacientes.length > 0) {
      const pacientesOptions = pacientes.map(p => ({
        value: p._id,
        label: p.nome
      }));
      setFilteredPacientes(pacientesOptions);      
      
      if (paciente && !pacientesOptions.some(option => option.value === paciente)) {
        const selectedPaciente = pacientes.find(p => p._id === paciente);
        if (selectedPaciente) {
          setFilteredPacientes(prev => [
            ...prev,
            { value: selectedPaciente._id, label: selectedPaciente.nome }
          ]);
        }
      }
    }
  }, [pacientes, paciente]);
  
  useEffect(() => {
    if (pacienteIdFromQuery && pacientes && pacientes.length > 0) {
      const selectedPaciente = pacientes.find(p => p._id === pacienteIdFromQuery);
      if (selectedPaciente) {
        setFormData(prev => ({
          ...prev,
          paciente: pacienteIdFromQuery
        }));
      }
    }
  }, [pacienteIdFromQuery, pacientes]);

  const handlePacienteChange = (selectedOption) => {

    setFormData({
      ...formData,
      paciente: selectedOption ? selectedOption.value : ''
    });
  };
  
  const selectedPacienteOption = filteredPacientes.find(option => option.value === paciente) || null;
  
  useEffect(() => {
    if (pacienteIdFromQuery && !paciente && pacientes && pacientes.length > 0) {
      const selectedPaciente = pacientes.find(p => p._id === pacienteIdFromQuery);
      if (selectedPaciente) {
        setFormData(prev => ({
          ...prev,
          paciente: pacienteIdFromQuery
        }));
      }
    }
  }, [pacienteIdFromQuery, paciente, pacientes]);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>{id ? 'Editar Procedimento' : 'Novo Procedimento'}</h1>
          <p>{id ? 'Atualize os dados do procedimento' : 'Registre um novo procedimento'}</p>
        </Col>
        <Col xs="auto" className="align-self-center">
          <Button variant="outline-secondary" onClick={() => navigate('/procedimentos')}>
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
                  <Form.Label>Nome do Procedimento</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={nome}
                    onChange={onChange}
                    placeholder="Nome do procedimento"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Paciente*</Form.Label>
                  <Select
                    name="paciente"
                    value={selectedPacienteOption}
                    onChange={handlePacienteChange}
                    options={filteredPacientes || []}
                    isDisabled={pacienteIdFromQuery ? true : false}
                    placeholder="Pesquisar paciente..."
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "Nenhum paciente encontrado"}
                    classNamePrefix="select"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Realização*</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataRealizacao"
                    value={dataRealizacao}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
              </Col>
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
                    <option value="APAS">APAS</option>
                    <option value="UNIMED">UNIMED</option>
                    <option value="Particular">Particular</option>
                    <option value="Outros">Outros</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor do Plano (R$)*</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="valorPlano"
                    value={valorPlano}
                    onChange={onChange}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    type="text"
                    name="descricao"
                    value={descricao}
                    onChange={onChange}
                    placeholder="Descrição breve do procedimento"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Evolução</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="evolucao"
                value={evolucao}
                onChange={onChange}
                placeholder="Descreva a evolução do paciente após o procedimento"
              />
            </Form.Group>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button variant="secondary" onClick={() => navigate('/procedimentos')} className="me-md-2">
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {id ? 'Atualizar' : 'Registrar'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProcedimentoForm;