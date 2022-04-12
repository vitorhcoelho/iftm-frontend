import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllAlunos, insertAluno, updateAluno, deleteAluno } from '../services/alunos';

const fetchAllAlunos = createAsyncThunk('alunos/getAll', getAllAlunos);
const insertNewAluno = createAsyncThunk('alunos/insert', insertAluno);
const updateAlunoById = createAsyncThunk('alunos/update', updateAluno);
const deleteAlunoById = createAsyncThunk('alunos/delete', deleteAluno);

const initialState = {
  alunosList: [],
  alunosListLoading: false,
  totalPages: 0,
  insertLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

export const alunosStore = createSlice({
  name: 'alunos',
  initialState,
  reducers: {
    // definir funções que nao sejam relacionadas a chamada de api
  },
  extraReducers: {
    // GET ALL
    [fetchAllAlunos.pending]: (state) => {
      state.alunosListLoading = true;
    },
    [fetchAllAlunos.fulfilled]: (state, { payload }) => {
      state.alunosListLoading = false;
      if (payload === null || payload === undefined) return;
      state.alunosList = payload?.content;
      state.totalPages = payload?.totalPages;
    },
    [fetchAllAlunos.rejected]: (state) => {
      state.alunosListLoading = false;
      state.alunosList = [];
    },

    // INSERT
    [insertNewAluno.pending]: (state) => {
      state.insertLoading = true;
    },
    [insertNewAluno.fulfilled]: (state, { payload }) => {
      state.insertLoading = false;
    },
    [insertNewAluno.rejected]: (state) => {
      state.insertLoading = false;
    },

    // UPDATE
    [updateAlunoById.pending]: (state) => {
      state.deleteLoading = true;
    },
    [updateAlunoById.fulfilled]: (state, { payload }) => {
      state.deleteLoading = false;
    },
    [updateAlunoById.rejected]: (state) => {
      state.deleteLoading = false;
    },

    // DELETE
    [deleteAlunoById.pending]: (state) => {
      state.deleteLoading = true;
    },
    [deleteAlunoById.fulfilled]: (state, { payload }) => {
      state.deleteLoading = false;
    },
    [deleteAlunoById.rejected]: (state) => {
      state.deleteLoading = false;
    },
  }
});

export { fetchAllAlunos, insertNewAluno, updateAlunoById, deleteAlunoById };
export default alunosStore.reducer;
