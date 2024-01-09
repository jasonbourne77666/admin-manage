import { ProFormText, ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { getPermissionAll } from '@/services/permission';
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
        destroyOnClose: true,
        onCancel: () => {
          props.onCancel();
        },
      }}
      title={`${props?.values?.id ? '修改' : '新增'}角色`}
      width={640}
      initialValues={{
        ...props.values,
        permissionIds: props?.values?.permissions?.map((item) => item.id),
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
      <ProFormSelect
        name="permissionIds"
        mode="multiple"
        width="md"
        label={'权限'}
        placeholder={'请选择权限'}
        rules={[
          {
            required: true,
            message: '请选择权限',
          },
        ]}
        request={async () => {
          const res = await getPermissionAll();
          const { list = [] } = res.data || {};

          return list.map((item) => {
            return {
              label: item.desc,
              value: item.id,
            };
          });
        }}
      />
      <ProFormText name={'desc'} label={'角色描述'} width="md" placeholder={'请输入角色描述！'} />
    </ModalForm>
  );
};

export default UpdateForm;
