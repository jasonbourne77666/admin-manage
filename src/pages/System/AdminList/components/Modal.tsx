import { ProFormText, ProFormCaptcha, StepsForm } from '@ant-design/pro-components';
import { LockOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
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
  const { initialState } = useModel('@@initialState');

  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            key={'createModal'}
            width={640}
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title={`${props?.values?.id ? '修改' : '新增'}用户`}
            open={props.updateModalOpen}
            maskClosable={false}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
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
      <StepsForm.StepForm
        initialValues={{
          ...props.values,
        }}
        title={`${props?.values?.id ? '修改' : '新增'}基本信息`}
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
      </StepsForm.StepForm>
      <StepsForm.StepForm title={'获取超级管理员邮箱验证码'}>
        <ProFormCaptcha
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
          }}
          captchaProps={{
            size: 'large',
          }}
          label={initialState?.currentUser?.email}
          placeholder={'请输入验证码'}
          captchaTextRender={(timing, count) => {
            if (timing) {
              return `${count} 获取验证码`;
            }
            return '获取验证码';
          }}
          name="captcha"
          rules={[
            {
              required: true,
              message: '请输入验证码！',
            },
          ]}
          onGetCaptcha={async () => {
            const service = props?.values?.id ? getUpdateEmailCaptcha : getRegisterEmailCaptcha;
            const result = await service({
              email: initialState?.currentUser?.email || '',
            });
            if (result.code === 200) {
              message.success('获取验证码成功!');
            }
          }}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
