import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaUserInjured, FaNotesMedical, FaChartBar, FaCalendarAlt, FaMoneyBillWave, FaFileAlt, FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getConfig } from '../features/auth/authService';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalPacientes: 0,
    totalProcedimentos: 0,
    procedimentosMes: 0,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let pacientesData = [];
        let procedimentosData = [];
        let relatorioData = {};
        let hasError = false;

        try {
          const pacientesRes = await axios.get('/pacientes', getConfig());
          pacientesData = pacientesRes.data;
        } catch (error) {
          console.error('Error fetching pacientes:', error);
          hasError = true;
        }

        try {
          const procedimentosRes = await axios.get('/procedimentos', getConfig());
          procedimentosData = procedimentosRes.data;
        } catch (error) {
          console.error('Error fetching procedimentos:', error);
          hasError = true;
        }

        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        try {
          const startDate = firstDayOfMonth.toISOString().split('T')[0];
          const endDate = lastDayOfMonth.toISOString().split('T')[0];
          const relatorioRes = await axios.get(
            `/relatorios?startDate=${startDate}&endDate=${endDate}`,
            getConfig()
          );
          relatorioData = relatorioRes.data;
          setRelatorioData(relatorioData);
        } catch (error) {
          console.error('Error fetching relatório data:', error);
          hasError = true;
        }

        if (hasError) {
          toast.warning('Alguns dados do dashboard não puderam ser carregados');
        }

        const procedimentosMes = procedimentosData.filter(
          (proc) => {
            const procDate = new Date(proc.dataRealizacao);
            return procDate >= firstDayOfMonth && procDate <= lastDayOfMonth;
          }
        ).length;

        setStats({
          totalPacientes: pacientesData.length,
          totalProcedimentos: procedimentosData.length,
          procedimentosMes,
        });

        const planoData = {};
        procedimentosData.forEach((proc) => {
          if (!proc.planoSaude) return;
          
          if (!planoData[proc.planoSaude]) {
            planoData[proc.planoSaude] = 0;
          }
          planoData[proc.planoSaude]++;
        });

        setChartData({
          labels: Object.keys(planoData),
          datasets: [
            {
              label: 'Procedimentos por Plano de Saúde',
              data: Object.values(planoData),
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erro ao carregar dados do dashboard');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribuição de Procedimentos por Plano de Saúde',
      },
    },
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div>
      <h1 className="page-header">Dashboard</h1>
      <p className="mb-4">Bem-vindo(a), {user?.name}! Aqui está um resumo da sua atividade.</p>

      <h2 className="section-title mb-3">Visão Geral</h2>
      <div className="dashboard-stats">
        <Card className="stat-card">
          <Card.Body>
            <FaUserInjured size={30} className="mb-3 text-primary" />
            <h3>Total de Pacientes</h3>
            <p>{stats.totalPacientes}</p>
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="mt-3" 
              onClick={() => navigate('/pacientes')}
            >
              Ver Pacientes
            </Button>
          </Card.Body>
        </Card>



        <Card className="stat-card">
          <Card.Body>
            <FaMoneyBillWave size={30} className="mb-3 text-warning" />
            <h3>Produção Total</h3>
            <p>{formatCurrency(relatorioData.producaoParticular + relatorioData.producaoPlanoSaude)}</p>
            <Button 
              variant="outline-warning" 
              size="sm" 
              className="mt-3" 
              onClick={() => navigate('/relatorios')}
            >
              Ver Relatórios
            </Button>
          </Card.Body>
        </Card>
      </div>

      <h2 className="section-title mb-3 mt-4">Pacientes Particulares</h2>
      <div className="dashboard-stats">
        <Card className="stat-card">
          <Card.Body>
            <FaNotesMedical size={30} className="mb-3 text-success" />
            <h3>Procedimentos</h3>
            <p>{relatorioData.totalParticular}</p>
            <Button 
              variant="outline-success" 
              size="sm" 
              className="mt-3" 
              onClick={() => navigate('/procedimentos')}
            >
              Ver Detalhes
            </Button>
          </Card.Body>
        </Card>

        <Card className="stat-card">
          <Card.Body>
            <FaMoneyBillWave size={30} className="mb-3 text-success" />
            <h3>Produção</h3>
            <p>{formatCurrency(relatorioData.producaoParticular)}</p>
            <Button 
              variant="outline-success" 
              size="sm" 
              className="mt-3" 
              onClick={() => navigate('/relatorios')}
            >
              Ver Detalhes
            </Button>
          </Card.Body>
        </Card>

        <Card className="stat-card">
          <Card.Body>
            <FaFileAlt size={30} className="mb-3 text-success" />
            <h3>Evoluções</h3>
            <p>{relatorioData.evolucoesGeradasParticular}</p>
            <Button 
              variant="outline-success" 
              size="sm" 
              className="mt-3" 
              onClick={() => navigate('/relatorios')}
            >
              Ver Detalhes
            </Button>
          </Card.Body>
        </Card>
      </div>

      <h2 className="section-title mb-3 mt-4">Pacientes de Planos de Saúde</h2>
      <div className="dashboard-stats">
        <Card className="stat-card">
          <Card.Body>
            <FaNotesMedical size={30} className="mb-3 text-primary" />
            <h3>Procedimentos</h3>
            <p>{relatorioData.totalPlanoSaude}</p>
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="mt-3" 
              onClick={() => navigate('/procedimentos')}
            >
              Ver Detalhes
            </Button>
          </Card.Body>
        </Card>

        <Card className="stat-card">
          <Card.Body>
            <FaMoneyBillWave size={30} className="mb-3 text-primary" />
            <h3>Produção</h3>
            <p>{formatCurrency(relatorioData.producaoPlanoSaude)}</p>
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="mt-3" 
              onClick={() => navigate('/relatorios')}
            >
              Ver Detalhes
            </Button>
          </Card.Body>
        </Card>

        <Card className="stat-card">
          <Card.Body>
            <FaFileAlt size={30} className="mb-3 text-primary" />
            <h3>Evoluções</h3>
            <p>{relatorioData.evolucoesGeradasPlanoSaude}</p>
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="mt-3" 
              onClick={() => navigate('/relatorios')}
            >
              Ver Detalhes
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;