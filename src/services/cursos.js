import { request } from "../utils/utils";
import { stringify } from 'qs';

export async function getAllCursos({ payload } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/curso/all?${params}` })
};

export async function insertCurso({ payload, callback } = {}) {
  return await request({ method: 'post', url: '/curso', data: payload, callback })
}

export async function updateCurso({ payload, callback } = {}) {
  return await request({ method: 'put', url: `/curso/${payload?.id}`, data: payload, callback })
}

export async function deleteCurso({ payload, callback } = {}) {
  return await request({ method: 'delete', url: `/curso/${payload}`, callback })
};

export async function getShort({ payload, callback } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/curso/short?${params}` })
};