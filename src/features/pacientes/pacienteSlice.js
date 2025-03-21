import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pacienteService from './pacienteService'

const initialState = {
  pacientes: [],
  paciente: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const getPacientes = createAsyncThunk(
  'pacientes/getAll',
  async (_, thunkAPI) => {
    try {
      return await pacienteService.getPacientes()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getPaciente = createAsyncThunk(
  'pacientes/get',
  async (id, thunkAPI) => {
    try {
      return await pacienteService.getPaciente(id)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const createPaciente = createAsyncThunk(
  'pacientes/create',
  async (pacienteData, thunkAPI) => {
    try {
      return await pacienteService.createPaciente(pacienteData)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updatePaciente = createAsyncThunk(
  'pacientes/update',
  async ({ id, pacienteData }, thunkAPI) => {
    try {
      return await pacienteService.updatePaciente(id, pacienteData)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const deletePaciente = createAsyncThunk(
  'pacientes/delete',
  async (id, thunkAPI) => {
    try {
      return await pacienteService.deletePaciente(id)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const pacienteSlice = createSlice({
  name: 'paciente',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPacientes.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPacientes.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.pacientes = action.payload
      })
      .addCase(getPacientes.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getPaciente.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPaciente.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.paciente = action.payload
      })
      .addCase(getPaciente.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createPaciente.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createPaciente.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.pacientes.push(action.payload)
      })
      .addCase(createPaciente.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updatePaciente.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updatePaciente.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.paciente = action.payload
        state.pacientes = state.pacientes.map((paciente) =>
          paciente._id === action.payload._id ? action.payload : paciente
        )
      })
      .addCase(updatePaciente.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deletePaciente.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deletePaciente.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.pacientes = state.pacientes.filter(
          (paciente) => paciente._id !== action.payload.id
        )
      })
      .addCase(deletePaciente.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = pacienteSlice.actions
export default pacienteSlice.reducer