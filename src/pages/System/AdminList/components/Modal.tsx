import { ProFormText, ProFormCaptcha, ProFormSelect, ModalForm } from '@ant-design/pro-components';
import { LockOutlined } from '@ant-design/icons';
import { getRoleAll } from '@/services/role';
import { Modal, message } from 'antd';
import React from 'react';
import { getRegisterEmailCaptcha, getUpdateEmailCaptcha } from '@/services/user';

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: API.RegisterParams) => Promise<void>;
  updateModalOpen: boolean;
  values: API.UserListItem | undefined;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      open={props.updateModalOpen}
      title={`${props?.values?.id ? '修改' : '新增'}基本信息`}
      modalProps={{
        width: 640,
        bodyStyle: { padding: '32px 40px 48px' },
        destroyOnClose: true,
        title: `${props?.values?.id ? '修改' : '新增'}用户`,
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      initialValues={{
        ...props.values,
        roles: props?.values?.roles?.[0]?.id,
      }}
      onFinish={(values) => {
        if (props?.values?.id) {
          return props.onSubmit({
            userId: props?.values?.id,
            ...values,
          });
        } else {
          return props.onSubmit(values);
        }
      }}
    >
      <ProFormText
        name={'username'}
        label={'用户名'}
        width="md"
        placeholder={'字母或者数字，并以字母开头'}
        rules={[
          {
            required: true,
            message: '请输入用户名！',
            // 字母或者数字
            pattern: /^[a-zA-z]\w{3,15}$/,
          },
        ]}
      />
      {!props?.values?.id ? (
        <ProFormText
          name="password"
          width="md"
          label={'密码'}
          placeholder={'请输入至少6个字符'}
          rules={[
            {
              required: true,
              message: '请输入至少五个字符的规则描述！',
              min: 6,
            },
          ]}
        />
      ) : null}
      <ProFormSelect
        name="roles"
        width="md"
        label={'角色'}
        placeholder={'请选择角色'}
        rules={[
          {
            required: true,
            message: '请选择角色',
          },
        ]}
        request={async () => {
          const res = await getRoleAll();
          const { list = [] } = res.data || {};

          return list.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        }}
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '请输入用户昵称！',
          },
        ]}
        name="nickName"
        width="md"
        label={'用户昵称'}
        placeholder={'请输入用户昵称'}
      />
      <ProFormText
        name="phoneNumber"
        width="md"
        label={'手机号'}
        placeholder={'请输入手机号'}
        rules={[
          {
            required: true,
            message: '请输入手机号',
            pattern: /^1\d{10}$/,
          },
        ]}
      />
      <ProFormText
        name="email"
        width="md"
        label={'邮箱'}
        placeholder={'请输入邮箱'}
        rules={[
          {
            required: true,
            message: '请输入邮箱',
            type: 'email',
          },
        ]}
      />

      <ProFormCaptcha
        fieldProps={{
          size: 'middle',
          prefix: <LockOutlined />,
        }}
        captchaProps={{
          size: 'middle',
        }}
        placeholder={'请输入邮箱验证码'}
        captchaTextRender={(timing, count) => {
          if (timing) {
            return `${count} 获取邮箱验证码`;
          }
          return '获取邮箱验证码';
        }}
        name="captcha"
        phoneName={'email'}
        rules={[
          {
            required: true,
            message: '请输入邮箱验证码！',
          },
        ]}
        onGetCaptcha={async (email) => {
          const service = props?.values?.id ? getUpdateEmailCaptcha : getRegisterEmailCaptcha;
          const result = await service({
            email: email || '',
          });
          if (result.code === 200) {
            message.success('获取邮箱验证码成功!');
          }
        }}
      />
    </ModalForm>
  );
};

export default UpdateForm;
