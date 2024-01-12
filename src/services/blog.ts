import { request } from '@umijs/max';

/** article列表 GET /api/article/list */
export async function getArticleList(
  params: API.ArticleListParams,
  options?: { [key: string]: any },
) {
  return request<API.Response<API.ArticleList>>('/api/article/list', {
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
export async function articleAdd(params: API.ArticleListItem, options?: { [key: string]: any }) {
  return request<API.Response<string>>('/api/article/create', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

/** 修改用户信息 post /api/role/update */
export async function articleUpdate(params: API.ArticleListItem, options?: { [key: string]: any }) {
  return request<API.Response<string>>('/api/article/update', {
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
