import { request } from '@umijs/max';

/** role列表 GET /api/role/list */
export async function getRoleList(params: API.RoleListParams, options?: { [key: string]: any }) {
  return request<API.Response<API.RoleList>>('/api/role/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** role列表 GET /api/role/list */
export async function getRoleAll(options?: { [key: string]: any }) {
  return request<API.Response<API.RoleList>>('/api/role/getAll', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新增 /api/role/add */
export async function roleAdd(params: API.RoleListItem, options?: { [key: string]: any }) {
  return request<API.Response<string>>('/api/role/add', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

/** 修改用户信息 post /api/role/update */
export async function roleUpdate(params: API.RoleListItem, options?: { [key: string]: any }) {
  return request<API.Response<string>>('/api/role/update', {
    method: 'Post',
    data: { ...params },
    ...(options || {}),
  });
}

/** 删除用户 delete /api/role/:id */
export async function deleteRole(
  params: { id: number | string },
  options?: { [key: string]: any },
) {
  return request<API.Response<string>>('/api/role/' + params.id, {
    method: 'DELETE',
    ...(options || {}),
  });
}
