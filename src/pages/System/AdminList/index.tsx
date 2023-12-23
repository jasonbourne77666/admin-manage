import { addRule, removeRule } from '@/services/ant-design-pro/api';
import { getUserList, register, freeze, update, deleteUser } from '@/services/user';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import type { ActionType, ProColumns, FormInstance } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
// import type { FormValueType } from './components/Modal';
import UserModalForm from './components/Modal';

/**
 * @en-US Add node
 * @zh-CN 冻结用户
 * @param fields
 */
const freezeUser = async (fields: API.FrozenParams) => {
  const hide = message.loading('正在添加');
  try {
    const res = await freeze({ ...fields });
    hide();
    if (res.code === 200) {
      message.success('冻结成功');
      return true;
    } else {
      message.error('冻结失败');
      return false;
    }
  } catch (error) {
    hide();
    message.error('冻结失败');
    return false;
  }
};
/**
 * @en-US delete
 * @zh-CN 删除用户
 * @param fields
 */
const handleDelete = async (fields: { id: number | string }) => {
  const hide = message.loading('正在添加');
  try {
    const res = await deleteUser({ ...fields });
    hide();
    if (res.code === 200) {
      message.success('删除成功');
      return true;
    } else {
      message.error('删除失败');
      return false;
    }
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};
/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('Configuring');
//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
//     hide();

//     message.success('Configuration is successful');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Configuration failed, please try again!');
//     return false;
//   }
// };

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const tableRef = useRef<FormInstance>();
  const [currentRow, setCurrentRow] = useState<API.UserListItem>();
  const { initialState } = useModel('@@initialState');

  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      tip: 'The rule name is the unique key',
    },
    {
      title: '用户角色',
      dataIndex: 'roles',
      renderText: (val: any) => `${val?.[0]?.name}`,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      search: false,
      renderText: (val: string = '') => `${val}`,
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      search: false,
      renderText: (val: string) => `${val}`,
    },
    {
      title: '是否冻结',
      dataIndex: 'isFrozen',
      valueEnum: {
        0: {
          text: '正常',
          status: '0',
        },
        1: {
          text: '冻结',
          status: '1',
        },
      },
      render(_, entity) {
        return <span style={{ color: entity.isFrozen === '1' ? 'red' : '' }}>{_}</span>;
      },
      fieldProps: {
        onChange: (e) => {
          tableRef.current?.submit();
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          style={{ color: initialState?.currentUser?.id === record.id ? '#999' : '' }}
          onClick={async () => {
            if (initialState?.currentUser?.id === record.id) {
              return;
            }
            Modal.confirm({
              title: '提示',
              content: `是否确认${record?.isFrozen === '1' ? '解冻' : '冻结'}该用户？`,
              onOk: async () => {
                const res = await freezeUser({ id: record.id });
                if (res) {
                  tableRef.current?.submit();
                }
              },
            });
          }}
        >
          {record?.isFrozen === '1' ? '解冻' : '冻结'}
        </a>,
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            setTimeout(() => {
              handleModalOpen(true);
            }, 100);
          }}
        >
          修改
        </a>,
        <a
          key="del"
          onClick={() => {
            Modal.confirm({
              title: '提示',
              content: '是否确认删除该用户？',
              onOk: async () => {
                const res = await deleteUser({ id: record.id });
                if (res) {
                  tableRef.current?.submit();
                }
              },
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserListItem, API.PageParams & API.UserListItem>
        headerTitle={'用户列表'}
        actionRef={actionRef}
        formRef={tableRef}
        cardBordered
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={async (params) => {
          try {
            const res = await getUserList({
              pageNo: params.current,
              pageSize: params.pageSize,
              isFrozen: params.isFrozen,
              username: params.username,
            });

            return {
              data: res?.data?.list,
              success: true,
              total: res?.data?.totalCount,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
      />

      {createModalOpen && (
        <UserModalForm
          key={'createModal'}
          updateModalOpen={createModalOpen}
          onCancel={() => {
            handleModalOpen(false);
            setCurrentRow(undefined);
          }}
          values={currentRow}
          onSubmit={async (value) => {
            const service = value?.userId ? update : register;
            const success = await service(value);

            if (success.code === 200) {
              message.success(`${currentRow?.id ? '修改' : '添加'}成功`);
              handleModalOpen(false);
              tableRef.current?.submit();
            }
          }}
        />
      )}
    </PageContainer>
  );
};

export default TableList;
