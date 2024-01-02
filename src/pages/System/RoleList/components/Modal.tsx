import { ProFormText, ModalForm } from '@ant-design/pro-components';
import React from 'react';

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: API.RoleListItem) => Promise<void>;
  updateModalOpen: boolean;
  values: API.RoleListItem | undefined;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      open={props.updateModalOpen}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      title={`${props?.values?.id ? '修改' : '新增'}角色`}
      width={640}
      initialValues={{
        ...props.values,
      }}
      onFinish={async (values) => {
        if (props?.values?.id) {
          return props.onSubmit({
            id: props?.values?.id,
            ...values,
          });
        } else {
          return props.onSubmit(values);
        }
      }}
    >
      <ProFormText
        name={'name'}
        label={'角色名'}
        width="md"
        placeholder={'请输入角色名！'}
        rules={[
          {
            required: true,
            message: '请输入角色名！',
          },
        ]}
      />
      <ProFormText name={'desc'} label={'角色描述'} width="md" placeholder={'请输入角色描述！'} />
    </ModalForm>
  );
};

export default UpdateForm;
