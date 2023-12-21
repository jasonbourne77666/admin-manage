import { request } from '@umijs/max';

/** 用户列表 GET /api/user/list */
export async function getUserList(params: API.UserListParams, options?: { [key: string]: any }) {
  return request<API.Response<API.UserList>>('/api/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
