import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCurso, getAllCursos, getShort, insertCurso, updateCurso } from '../services/cursos';

const fetchAllCursos = createAsyncThunk('cursos/getAll', getAllCursos);
const insertNewCurso = createAsyncThunk('cursos/insert', insertCurso);
const updateCursoById = createAsyncThunk('cursos/update', updateCurso);
const deleteCursoById = createAsyncThunk('cursos/delete', deleteCurso);
const fetchCursosShort = createAsyncThunk('cursos/short', getShort);

const initialState = {
  cursosList: [],
  cursosListLoading: false,
  totalPages: 0,
  deleteLoading: false,
  insertLoading: false,
  updateLoading: false,
  cursosShortListLoading: false,
  cursosShortList: [],
};

export const cursosStore = createSlice({
  name: 'cursos',
  initialState,
  reducers: {
    // definir funções que nao sejam relacionadas a chamada de api
  },
  extraReducers: {
    // GET ALL
    [fetchAllCursos.pending]: (state) => {
      state.cursosListLoading = true;
    },
    [fetchAllCursos.fulfilled]: (state, { payload }) => {
      state.cursosListLoading = false;
      if (payload === null || payload === undefined) return;
      state.cursosList = payload?.content;
      state.totalPages = payload?.totalPages;
    },
    [fetchAllCursos.rejected]: (state) => {
      state.cursosListLoading = false;
      state.cursosList = [];
    },

    // GET SHORT
    [fetchCursosShort.pending]: (state) => {
      state.cursosShortListLoading = true;
    },
    [fetchCursosShort.fulfilled]: (state, { payload }) => {
      state.cursosShortListLoading = false;
      if (payload === null || payload === undefined) return;
      state.cursosShortList = payload;
    },
    [fetchCursosShort.rejected]: (state) => {
      state.cursosShortListLoading = false;
      state.cursosShortList = [];
    },

    // INSERT
    [insertNewCurso.pending]: (state) => {
      state.insertLoading = true;
    },
    [insertNewCurso.fulfilled]: (state, { payload }) => {
      state.insertLoading = false;
    },
    [insertNewCurso.rejected]: (state) => {
      state.insertLoading = false;
    },

    // UPDATE
    [updateCursoById.pending]: (state) => {
      state.updateLoading = true;
    },
    [updateCursoById.fulfilled]: (state, { payload }) => {
      state.updateLoading = false;
    },
    [updateCursoById.rejected]: (state) => {
      state.updateLoading = false;
    },

    // DELETE
    [deleteCursoById.pending]: (state) => {
      state.deleteLoading = true;
    },
    [deleteCursoById.fulfilled]: (state, { payload }) => {
      state.deleteLoading = false;
    },
    [deleteCursoById.rejected]: (state) => {
      state.deleteLoading = false;
    },
  }
});

export { fetchAllCursos, deleteCursoById, insertNewCurso, updateCursoById, fetchCursosShort };
export default cursosStore.reducer;
