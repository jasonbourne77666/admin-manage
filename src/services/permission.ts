import { request } from '@umijs/max';

/** permission列表 GET /api/permission/list */
export async function getPermissionList(
  params: API.PermissionListParams,
  options?: { [key: string]: any },
) {
  return request<API.Response<API.PermissionList>>('/api/permission/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 所有权限 GET /api/permission/getAll */
export async function getPermissionAll(options?: { [key: string]: any }) {
  return request<API.Response<API.PermissionList>>('/api/permission/getAll', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新增 /api/permission/add */
export async function permissionAdd(
  params: API.PermissionListItem,
  options?: { [key: string]: any },
) {
  return request<API.Response<string>>('/api/permission/add', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

/** 修改用户信息 post /api/permission/update */
export async function permissionUpdate(
  params: API.PermissionListItem,
  options?: { [key: string]: any },
) {
  return request<API.Response<string>>('/api/permission/update', {
    method: 'Post',
    data: { ...params },
    ...(options || {}),
  });
}

/** 删除用户 delete /api/permission/:id */
export async function deletePermission(
  params: { id: number | string },
  options?: { [key: string]: any },
) {
  return request<API.Response<string>>('/api/permission/' + params.id, {
    method: 'DELETE',
    ...(options || {}),
  });
}
