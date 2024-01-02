import { addRule, removeRule } from '@/services/ant-design-pro/api';
import {
  getPermissionList,
  permissionAdd,
  permissionUpdate,
  deletePermission,
} from '@/services/permission';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, FormInstance } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
// import type { FormValueType } from './components/Modal';
import UserModalForm from './components/Modal';

/**
 * @en-US delete
 * @zh-CN 删除用户
 * @param fields
 */
const handleDelete = async (fields: { id: number | string }) => {
  const hide = message.loading('正在添加');
  try {
    const res = await deletePermission({ ...fields });
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
  const [currentRow, setCurrentRow] = useState<API.PermissionListItem>();

  const columns: ProColumns<API.PermissionListItem>[] = [
    {
      title: '权限代码',
      dataIndex: 'code',
    },
    {
      title: '权限描述',
      dataIndex: 'desc',
      search: false,
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
          key="edit"
          onClick={async () => {
            setCurrentRow(record);
            handleModalOpen(true);
            console.log(record);
          }}
        >
          修改
        </a>,
        <a
          key="del"
          onClick={async () => {
            const modal = Modal.confirm({
              title: '删除角色',
              content: '确定删除该角色吗？',
              okText: '确定',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleDelete({ id: record.id! });
                if (success) {
                  modal.destroy();
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
      <ProTable<API.PermissionListItem, API.PageParams & API.PermissionListItem>
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
            const res = await getPermissionList({
              pageNo: params.current,
              pageSize: params.pageSize,
              code: params.code,
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

      <UserModalForm
        key={'createPermissionModal'}
        updateModalOpen={createModalOpen}
        onCancel={() => {
          handleModalOpen(false);
          setCurrentRow(undefined);
        }}
        values={currentRow}
        onSubmit={async (value) => {
          const service = value?.id ? permissionUpdate : permissionAdd;

          const success = await service(value);

          if (success.code === 200) {
            message.success(`${currentRow?.id ? '修改' : '添加'}成功`);
            handleModalOpen(false);
            tableRef.current?.submit();
          }
        }}
      />
    </PageContainer>
  );
};

export default TableList;
