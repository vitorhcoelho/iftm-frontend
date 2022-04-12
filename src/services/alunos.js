import { request } from "../utils/utils";
import { stringify } from 'qs';

export async function getAllAlunos({ payload } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/aluno/all?${params}` })
};

export async function insertAluno({ payload, callback } = {}) {
  return await request({ method: 'post', url: '/aluno', data: payload, callback })
};

export async function updateAluno({ payload, callback } = {}) {
  return await request({ method: 'put', url: `/aluno/${payload?.id}`, data: payload, callback })
}

export async function deleteAluno({ payload, callback } = {}) {
  return await request({ method: 'delete', url: `/aluno/${payload}`, callback })
};

export async function getShort({ payload, callback } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/aluno/short?${params}`, callback })
}