import React, { useState, useEffect } from "react";

// Redux
import { fetchAllCursos, deleteCursoById, insertNewCurso, updateCursoById } from "../model/cursosStore";
import { useSelector, useDispatch } from 'react-redux';

import { useSnackbar } from "notistack";

// Components
import { DataGrid } from "@mui/x-data-grid";
import { Button, CircularProgress, Pagination, TextField, Grid, Tooltip } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { FormBtnContainer, FormTitle, TableHeader } from "../utils/styles";

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// ENUMS
import { DEFAULT_ORDENATION, DEFAULT_PAGINATION } from "../app/generalEnums";
import { exists, notExists, requiredFieldError, safeNull } from "../utils/utils";


// Se nao definir os valores com array vazio, o campo de input buga, e nao limpa o que digitou se colocar undefined
const DEFAULT_FORM_VALUES = { type: '', description: '' };

function Cursos() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { cursosList, cursosListLoading, totalPages, deleteLoading, insertLoading, updateLoading } = useSelector((state) => state.cursos);

  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const [ordenation, setOrdenation] = useState({ ...DEFAULT_ORDENATION });
  const [formFields, setFormFields] = useState({ ...DEFAULT_FORM_VALUES });
  const [hasSendForm, setHasSendForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [showForm, setShowForm] = useState(false);

  function retrieveCursosList() {
    const params = { ...pagination, ...ordenation };
    dispatch(fetchAllCursos({ payload: params }))
  }

  function onOrdenationChange(value) {
    if (notExists(value)) return;

    const orderObj = value.length > 0 ? value[0] : { ...DEFAULT_ORDENATION };
    setOrdenation({ field: orderObj?.field, order: orderObj?.sort });
  }

  function onPageChange(_, pageNumber) {
    setPagination({ ...pagination, page: pageNumber });
  }

  function onFormCancel() {
    setIsUpdating(false);
    setHasSendForm(false);
    setFormFields({ ...DEFAULT_FORM_VALUES });
    setShowForm(false);
  }

  function openInsertForm() {
    setShowForm(true);
    setIsUpdating(false);
  }

  function insertCurso() {
    setHasSendForm(true);
    const hasSomeError = requiredFieldError(formFields?.type) || requiredFieldError(formFields?.description);
    if (hasSomeError) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      onFormCancel();
      retrieveCursosList();
      enqueueSnackbar('Novo curso inserido com sucesso', { variant: 'success' });
    };

    dispatch(insertNewCurso({ payload: formFields, callback }));
  }

  function updateCurso() {
    setHasSendForm(true);
    const hasSomeError = requiredFieldError(formFields?.type) || requiredFieldError(formFields?.description);
    if (hasSomeError) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      onFormCancel();
      retrieveCursosList();
      enqueueSnackbar('Curso atualizado com sucesso', { variant: 'success' });
    };

    dispatch(updateCursoById({ payload: formFields, callback }));
  }

  function deleteCurso(record) {
    if (notExists(record?.id)) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      retrieveCursosList();
      enqueueSnackbar('Curso excluido com sucesso', { variant: 'success' });
    }

    dispatch(deleteCursoById({ payload: record?.id, callback }))
  }

  function mapRowDataToForm(record) {
    const body = {
      type: record?.type,
      description: record?.description,
      id: record?.id,
    };

    setFormFields(body);
    setShowForm(true);
    setIsUpdating(true);
  }

  useEffect(() => {
    retrieveCursosList();
  }, [ordenation, pagination]);


  const renderActionButtons = ({ row }) => (
    <div style={{ position: 'relative' }}>
      {!deleteLoading ? <Tooltip title="Excluir curso" placement="top"><DeleteIcon onClick={() => deleteCurso(row)} className="tableActionIcon" /></Tooltip> : <CircularProgress size={30} />}
      {<Tooltip title="Editar curso" placement="top"><EditIcon onClick={() => mapRowDataToForm(row)} className="tableActionIcon" /></Tooltip>}
    </div>
  )

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'description', headerName: 'Descrição', flex: 1 },
    { field: 'type', headerName: 'Curso', sortable: true, flex: 1, valueGetter: ({ row }) => safeNull(row?.type) },
    { headerName: 'Ações', renderCell: renderActionButtons, flex: 1 },
  ];

  const renderNewTypeForm = () => {
    return (
      <Grid item xs={12} md={6} lg={5} xl={3}>
        <div className="container" style={{ textAlign: "center" }}>
          <FormTitle>{isUpdating ? 'Editar Curso' : 'Novo Curso'}</FormTitle>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(formFields?.type) && hasSendForm}
                value={formFields?.type}
                onChange={e => setFormFields({ ...formFields, type: e?.target?.value })}
                label="Nome do curso"
                fullWidth
                helperText={requiredFieldError(formFields?.type) && hasSendForm ? "Campo obrigatório" : ""}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(formFields?.description) && hasSendForm}
                value={formFields?.description}
                onChange={e => setFormFields({ ...formFields, description: e?.target?.value })}
                label="Descrição do curso"
                fullWidth
                helperText={requiredFieldError(formFields?.description) && hasSendForm ? "Campo obrigatório" : ""}
                variant="standard"
              />
            </Grid>
          </Grid>
          <FormBtnContainer>
            <Button variant="outlined" onClick={onFormCancel} startIcon={<CloseIcon />}>Cancelar</Button>
            <LoadingButton variant="contained" onClick={isUpdating ? updateCurso : insertCurso} loading={updateLoading || insertLoading} startIcon={<SaveIcon />}>
              {isUpdating ? 'Atualizar' : 'Inserir'}
            </LoadingButton>
          </FormBtnContainer>
        </div>
      </Grid>
    )
  }

  return (
    <div className="App">
      <Grid container spacing={2} className="alignContentCenter">
        {showForm && renderNewTypeForm()}
      </Grid>
      <div className="container">
        <TableHeader>
          <span>Lista de cursos</span>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openInsertForm} disabled={isUpdating}>
            Novo curso
          </Button>
        </TableHeader>
        <DataGrid
          className="table"
          autoHeight
          rows={cursosList ?? []}
          columns={columns ?? []}
          checkboxSelection
          headerHeight={45}
          hideFooterPagination
          hideFooter
          sortingMode="server"
          onSortModelChange={onOrdenationChange}
          rowHeight={45}
          loading={cursosListLoading}
        />
        <div className="paginationAlign">
          <Pagination count={totalPages} size="small" onChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}

export default Cursos;