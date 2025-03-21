import axios from 'axios'
import { getConfig } from '../auth/authService'

const API_URL = 'pacientes/'

const getPacientes = async () => {
  const response = await axios.get(API_URL, getConfig())

  return response.data
}

const getPaciente = async (pacienteId) => {
  const response = await axios.get(API_URL + pacienteId, getConfig())

  return response.data
}

const createPaciente = async (pacienteData) => {
  const response = await axios.post(API_URL, pacienteData, getConfig())

  return response.data
}

const updatePaciente = async (pacienteId, pacienteData) => {
  const response = await axios.put(
    API_URL + pacienteId,
    pacienteData,
    getConfig()
  )

  return response.data
}

const deletePaciente = async (pacienteId) => {
  const response = await axios.delete(API_URL + pacienteId, getConfig())

  return response.data
}

const pacienteService = {
  getPacientes,
  getPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
}

export default pacienteService