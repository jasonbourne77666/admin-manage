import { request } from '@umijs/max';

/** 发送验证码 POST /api/login/captcha */
export async function getEmailCaptcha(
  params: {
    // query
    /** 邮箱 */
    email: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/user/email-login-captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 邮箱登录接口 POST /api/login/account */
export async function loginEmail(body: API.LoginEmailParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/user/email-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 账号密码登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
