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

/** 新增 /api/user/register */
export async function register(params: API.UserListParams, options?: { [key: string]: any }) {
  return request<API.Response<Partial<API.UserListItem>>>('/api/user/register', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

// 注册时发送验证码
export async function getRegisterEmailCaptcha(
  params: {
    // query
    /** 邮箱 */
    email: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/user/register-captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改用户信息 post /api/user/update */
export async function update(params: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.Response<string>>('/api/user/update', {
    method: 'POST',
    data: { ...params },
    ...(options || {}),
  });
}

// 修改用户信息时发送验证码
export async function getUpdateEmailCaptcha(
  params: {
    // query
    /** 邮箱 */
    email: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/user/update/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 冻结用户 GET /api/user/freeze */
export async function freeze(params: API.FrozenParams, options?: { [key: string]: any }) {
  return request<API.Response<string>>('/api/user/freeze', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 删除用户 GET /api/user/delete */
export async function deleteUser(
  params: { id: number | string },
  options?: { [key: string]: any },
) {
  return request<API.Response<string>>('/api/user/delete', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
