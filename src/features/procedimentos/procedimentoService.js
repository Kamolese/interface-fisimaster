import axios from 'axios'
import { getConfig } from '../auth/authService'

const API_URL = 'procedimentos/'

const getProcedimentos = async () => {
  const response = await axios.get(API_URL, getConfig())

  return response.data
}

const getProcedimentosByPaciente = async (pacienteId) => {
  const response = await axios.get(
    API_URL + `paciente/${pacienteId}`,
    getConfig()
  )

  return response.data
}

const getProcedimento = async (procedimentoId) => {
  const response = await axios.get(API_URL + procedimentoId, getConfig())

  return response.data
}

const createProcedimento = async (procedimentoData) => {
  const response = await axios.post(API_URL, procedimentoData, getConfig())

  return response.data
}

const updateProcedimento = async (procedimentoId, procedimentoData) => {
  const response = await axios.put(
    API_URL + procedimentoId,
    procedimentoData,
    getConfig()
  )

  return response.data
}

const deleteProcedimento = async (procedimentoId) => {
  const response = await axios.delete(API_URL + procedimentoId, getConfig())

  return response.data
}

const procedimentoService = {
  getProcedimentos,
  getProcedimentosByPaciente,
  getProcedimento,
  createProcedimento,
  updateProcedimento,
  deleteProcedimento,
}

export default procedimentoService