import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import pacienteReducer from '../features/pacientes/pacienteSlice';
import procedimentoReducer from '../features/procedimentos/procedimentoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pacientes: pacienteReducer,
    procedimentos: procedimentoReducer,
  },
});