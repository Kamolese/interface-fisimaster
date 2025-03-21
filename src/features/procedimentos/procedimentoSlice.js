import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import procedimentoService from './procedimentoService'

const initialState = {
  procedimentos: [],
  procedimento: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const getProcedimentos = createAsyncThunk(
  'procedimentos/getAll',
  async (_, thunkAPI) => {
    try {
      return await procedimentoService.getProcedimentos()
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

export const getProcedimentosByPaciente = createAsyncThunk(
  'procedimentos/getByPaciente',
  async (pacienteId, thunkAPI) => {
    try {
      return await procedimentoService.getProcedimentosByPaciente(pacienteId)
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

export const getProcedimento = createAsyncThunk(
  'procedimentos/get',
  async (id, thunkAPI) => {
    try {
      return await procedimentoService.getProcedimento(id)
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

export const createProcedimento = createAsyncThunk(
  'procedimentos/create',
  async (procedimentoData, thunkAPI) => {
    try {
      return await procedimentoService.createProcedimento(procedimentoData)
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

export const updateProcedimento = createAsyncThunk(
  'procedimentos/update',
  async ({ id, procedimentoData }, thunkAPI) => {
    try {
      return await procedimentoService.updateProcedimento(id, procedimentoData)
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

export const deleteProcedimento = createAsyncThunk(
  'procedimentos/delete',
  async (id, thunkAPI) => {
    try {
      return await procedimentoService.deleteProcedimento(id)
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

export const procedimentoSlice = createSlice({
  name: 'procedimento',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProcedimentos.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProcedimentos.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.procedimentos = action.payload
      })
      .addCase(getProcedimentos.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getProcedimentosByPaciente.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProcedimentosByPaciente.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.procedimentos = action.payload
      })
      .addCase(getProcedimentosByPaciente.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getProcedimento.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProcedimento.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.procedimento = action.payload
      })
      .addCase(getProcedimento.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createProcedimento.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProcedimento.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.procedimentos.push(action.payload)
      })
      .addCase(createProcedimento.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateProcedimento.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProcedimento.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.procedimento = action.payload
        state.procedimentos = state.procedimentos.map((procedimento) =>
          procedimento._id === action.payload._id ? action.payload : procedimento
        )
      })
      .addCase(updateProcedimento.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteProcedimento.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProcedimento.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.procedimentos = state.procedimentos.filter(
          (procedimento) => procedimento._id !== action.payload.id
        )
      })
      .addCase(deleteProcedimento.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = procedimentoSlice.actions
export default procedimentoSlice.reducer