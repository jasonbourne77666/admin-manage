// @ts-ignore
/* eslint-disable */

declare namespace API {
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

  type LoginResult = {
    code: number;
    message: string;
    data?: any;
  };

  type CurrentUser = {
    username?: string;
    headPic?: string;
    id?: number;
    email?: string;
    roles?: string[];
    isAdmin?: boolean;
    isFrozen?: string;
    nickName?: string;
    permissions?: { code: string; description: string }[];
    phoneNumber?: string;
  };

  // ----

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

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

  type FakeCaptcha = {
    code?: number;
    status?: string;
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
