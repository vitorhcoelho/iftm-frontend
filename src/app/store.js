import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import alunosStore from '../model/alunosStore';
import currentUserStore from '../model/currentUserStore';
import cursosStore from '../model/cursosStore';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    alunos: alunosStore,
    cursos: cursosStore,
    currentUser: currentUserStore
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});