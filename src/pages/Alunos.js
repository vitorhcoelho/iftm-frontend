import React, { useEffect, useState } from "react";

// Redux
import { fetchAllAlunos, insertNewAluno, updateAlunoById, deleteAlunoById } from "../model/alunosStore";
import { fetchCursosShort } from "../model/cursosStore";
import { useSelector, useDispatch } from 'react-redux';

// Components
import { DataGrid } from "@mui/x-data-grid";
import { Autocomplete, Button, CircularProgress, MenuItem, Pagination, TextField, Grid, Tooltip } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

// Utils
import { exists, formatDateToRequest, notExists, requiredFieldError, safeNull } from "../utils/utils";
import { DEFAULT_ORDENATION, DEFAULT_PAGINATION } from "../app/generalEnums";
import { useSnackbar } from "notistack";

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DolarIcon from '@mui/icons-material/AttachMoney';

// Styles
import { FormBtnContainer, FormTitle, TableHeader } from "../utils/styles";

const DEFAULT_ALUNO_VALUES = { name: '', description: '', curseId: '' };

function Alunos() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { alunosList, alunosListLoading, totalPages, insertLoading, updateLoading, deleteLoading } = useSelector((state) => state.alunos);
  const { cursosShortList } = useSelector((state) => state.cursos);

  const [filters, setFilters] = useState({ curso: null });
  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const [ordenation, setOrdenation] = useState({ ...DEFAULT_ORDENATION });
  const [alunoFormFields, setAlunoFormFields] = useState({ ...DEFAULT_ALUNO_VALUES });
  const [hasSendAlunoForm, setHasSendAlunoForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAlunoForm, setShowAlunoForm] = useState(false);

  function retrieveAlunosList() {
    const params = { ...pagination, ...ordenation, curseId: filters?.curso?.id };
    dispatch(fetchAllAlunos({ payload: params }))
  }

  function retrieveCursosShort() {
    dispatch(fetchCursosShort())
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
    setHasSendAlunoForm(false);
    setAlunoFormFields({ ...DEFAULT_ALUNO_VALUES });
    setShowAlunoForm(false);
  }

  function openInsertForm() {
    setShowAlunoForm(true);
    setIsUpdating(false);
  }

  function insertAluno() {
    setHasSendAlunoForm(true);

    const hasSomeError = (
      requiredFieldError(alunoFormFields?.name) || requiredFieldError(alunoFormFields?.address) ||
      requiredFieldError(alunoFormFields?.curseId) || requiredFieldError(alunoFormFields?.email) ||
      requiredFieldError(alunoFormFields?.password)
    );

    if (hasSomeError) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }

      onFormCancel();
      retrieveAlunosList();
      enqueueSnackbar('Novo aluno inserido com sucesso', { variant: 'success' });
    }

    dispatch(insertNewAluno({ payload: alunoFormFields, callback }));
  }

  function updateAluno() {
    setHasSendAlunoForm(true);
    const hasSomeError = (
      requiredFieldError(alunoFormFields?.name) || requiredFieldError(alunoFormFields?.address) ||
      requiredFieldError(alunoFormFields?.curseId) || requiredFieldError(alunoFormFields?.email)
    );

    if (hasSomeError) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }
      onFormCancel();
      retrieveAlunosList();
      enqueueSnackbar('Aluno atualizado com sucesso', { variant: 'success' });
    };

    dispatch(updateAlunoById({ payload: alunoFormFields, callback }));
  }

  function deleteAluno(record) {
    if (notExists(record?.id)) return;

    const callback = (response) => {
      if (exists(response?.error)) {
        enqueueSnackbar(response?.error, { variant: 'error' });
        return;
      }
      retrieveAlunosList();
      enqueueSnackbar('Aluno excluido com sucesso', { variant: 'success' });
    }

    dispatch(deleteAlunoById({ payload: record?.id, callback }))
  }

  function mapRowDataToForm(record) {
    const body = {
      id: record?.id,
      name: record?.name,
      address: record?.address,
      curseId: record?.curseId,
      email: record?.email
    };

    setAlunoFormFields(body);
    setShowAlunoForm(true);
    // ou assim setalunoFormFields({...record}) !!! Porem assim, os campos que vem do back tem que estar exatamente iguais aos do form que vc usa no input
    setIsUpdating(true);
  }

  useEffect(() => {
    retrieveAlunosList();
  }, [ordenation, pagination, filters?.curso]);

  useEffect(() => {
    retrieveCursosShort();
  }, []);

  const renderActionButtons = ({ row }) => (
    <div style={{ position: 'relative' }}>
      {!deleteLoading ?
        <Tooltip title="Excluir aluno" placement="top">
          <DeleteIcon onClick={() => deleteAluno(row)} className="tableActionIcon" />
        </Tooltip>
        :
        <CircularProgress size={30} />
      }
      {<Tooltip title="Editar aluno" placement="top"><EditIcon onClick={() => mapRowDataToForm(row)} className="tableActionIcon" /></Tooltip>}
    </div>
  )

  const renderNewAlunoForm = () => {
    return (
      <Grid item xs={12} md={6} lg={5} xl={3}>
        <div className="container" style={{ textAlign: "center" }}>
          <FormTitle>{isUpdating ? 'Editar Aluno' : 'Novo Aluno'}</FormTitle>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(alunoFormFields?.name) && hasSendAlunoForm}
                value={alunoFormFields?.name}
                onChange={e => setAlunoFormFields({ ...alunoFormFields, name: e?.target?.value })}
                label="Nome do aluno"
                variant="standard"
                fullWidth
                helperText={requiredFieldError(alunoFormFields?.name) && hasSendAlunoForm ? "Campo obrigatório" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(alunoFormFields?.address) && hasSendAlunoForm}
                value={alunoFormFields?.address}
                onChange={e => setAlunoFormFields({ ...alunoFormFields, address: e?.target?.value })}
                label="Endereço"
                variant="standard"
                fullWidth
                helperText={requiredFieldError(alunoFormFields?.address) && hasSendAlunoForm ? "Campo obrigatório" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(alunoFormFields?.curseId) && hasSendAlunoForm}
                variant="standard"
                value={alunoFormFields?.curseId}
                style={{ textAlign: 'left' }}
                fullWidth
                select
                onChange={(event) => setAlunoFormFields({ ...alunoFormFields, curseId: event?.target?.value })}
                label="Curso"
                helperText={requiredFieldError(alunoFormFields?.curseId) && hasSendAlunoForm ? "Campo obrigatório" : ""}
              >
                {exists(cursosShortList) && cursosShortList.length > 0 && cursosShortList.map(currentCurso => (
                  <MenuItem value={currentCurso?.id}>{currentCurso?.description}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={requiredFieldError(alunoFormFields?.email) && hasSendAlunoForm}
                variant="standard"
                value={alunoFormFields?.email}
                style={{ textAlign: 'left' }}
                fullWidth
                onChange={(event) => setAlunoFormFields({ ...alunoFormFields, email: event?.target?.value })}
                label="E-mail"
                helperText={requiredFieldError(alunoFormFields?.email) && hasSendAlunoForm ? "Campo obrigatório" : ""}
              />
            </Grid>
            {!isUpdating &&
              <Grid item xs={12}>
                <TextField
                  error={requiredFieldError(alunoFormFields?.password) && hasSendAlunoForm}
                  value={alunoFormFields?.password}
                  onChange={e => setAlunoFormFields({ ...alunoFormFields, password: e?.target?.value })}
                  label="Senha"
                  variant="standard"
                  fullWidth
                  type="password"
                  helperText={requiredFieldError(alunoFormFields?.password) && hasSendAlunoForm ? "Campo obrigatório" : ""}
                />
              </Grid>
            }
          </Grid>
          <FormBtnContainer>
            <Button variant="outlined" onClick={onFormCancel} startIcon={<CloseIcon />}>
              Cancelar
            </Button>
            <LoadingButton variant="contained" onClick={isUpdating ? updateAluno : insertAluno} startIcon={<SaveIcon />} loading={isUpdating ? updateLoading : insertLoading}>
              {isUpdating ? 'Atualizar' : 'Inserir'}
            </LoadingButton>
          </FormBtnContainer>
        </div>
      </Grid>
    )
  }

  const columns = [
    // { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Aluno', flex: 1, valueGetter: ({ row }) => safeNull(row?.name), sortable: true },
    { field: 'address', headerName: 'Endereço', flex: 1 },
    { field: 'curseId', headerName: 'Curso', valueGetter: ({ row }) => safeNull(row?.curso?.description), flex: 1 },
    { field: 'email', headerName: 'E-mail', flex: 1 },
    { headerName: 'Ações', renderCell: renderActionButtons, flex: 1 },
  ];

  return (
    <div className="App">
      <Grid container spacing={2} className="alignContentCenter">
        {showAlunoForm && renderNewAlunoForm()}
      </Grid>
      <div className="container">
        <TableHeader>
          <Autocomplete
            disablePortal
            options={cursosShortList ?? []}
            getOptionLabel={(option) => option.description}
            sx={{ width: 300 }}
            value={filters?.curso}
            onChange={(_, value) => setFilters({ ...filters, curso: value })}
            renderInput={(params) => <TextField {...params} label="Curso" variant="standard" />}
          />
          <span>Lista de alunos</span>
          <LoadingButton variant="contained" startIcon={<AddIcon />} onClick={openInsertForm} disabled={isUpdating}>
            Adicionar aluno
          </LoadingButton>
        </TableHeader>
        <DataGrid
          autoHeight
          rows={alunosList ?? []}
          columns={columns ?? []}
          headerHeight={45}
          // checkboxSelection
          hideFooterPagination
          hideFooter
          onSortModelChange={onOrdenationChange}
          rowHeight={45}
          loading={alunosListLoading}
        />
        <div className="paginationAlign">
          <Pagination count={totalPages} size="small" onChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}

export default Alunos;