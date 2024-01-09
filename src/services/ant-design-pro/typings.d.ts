// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Response<T = any> = {
    code?: number;
    message?: string;
    data: T;
  };

  type LoginEmailParams = {
    email: string;
    code?: string;
    autoLogin?: boolean;
  };
  type LoginParams = {
    username: string;
    password: string;
    autoLogin?: boolean;
  };

  type RegisterParams = {
    username?: string;
    password?: string;
    email?: string;
    nickName?: string;
    phoneNumber?: string;
    captcha?: string;
    userId?: string;
    roles?: number;
  };

  type FrozenParams = {
    id: string;
  };

  type LoginResult = {
    code: number;
    message: string;
    data?: any;
  };

  type CurrentUser = {
    username?: string;
    headPic?: string;
    id?: number | string;
    email?: string;
    roles?: string[];
    isAdmin?: boolean;
    isFrozen?: string;
    nickName?: string;
    permissions?: { code: string; description: string }[];
    phoneNumber?: string;
  };

  type UserListParams = {
    username?: string;
    nickName?: string;
    email?: string;
    phoneNumber?: string;
    isFrozen?: string;
    pageNo?: number;
    pageSize?: number;
  };

  type UserListItem = {
    id: string;
    username: string;
    nickName: string;
    email: string;
    phoneNumber: string;
    isFrozen: string;
    headPic: string;
    createTime: string;
    roles: any[];
  };

  type UserList = {
    list?: UserListItem[];
    /** 列表的内容总数 */
    totalCount?: number;
    pageNo?: number;
    pageSize?: number;
  };

  type PageParams = {
    pageNo?: number;
    pageSize?: number;
  };

  type FakeCaptcha = {
    code?: number;
    message?: string;
    data?: string;
  };

  // role
  type RoleListParams = {
    name?: string;
    status?: string;
    pageNo?: number;
    pageSize?: number;
  };

  type RoleListItem = {
    id?: number;
    name?: string;
    desc?: string;
    status?: number;
    updatedAt?: string;
    createTime?: string;
    permissions?: PermissionListItem[];
  };

  type RoleList = {
    list?: RoleListItem[];
    /** 列表的内容总数 */
    totalCount?: number;
    pageNo?: number;
    pageSize?: number;
  };

  type RoleAddParams = {
    id?: number;
    name: string;
    desc?: string;
  };

  // Permission
  type PermissionListParams = {
    code?: string;
    pageNo?: number;
    pageSize?: number;
  };

  type PermissionListItem = {
    id?: number;
    code?: string;
    desc?: string;
    updatedAt?: string;
    createTime?: string;
  };

  type PermissionList = {
    list?: PermissionListItem[];
    /** 列表的内容总数 */
    totalCount?: number;
    pageNo?: number;
    pageSize?: number;
  };

  type PermissionAddParams = {
    id?: number;
    code: string;
    desc?: string;
  };

  // ----

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
