import { CountInput, KeyWord } from '@/components';
import MarkdownEditor from '@/components/MarkdownEditor';
import {
  addNavigationArticle,
  // getAllNavigationColumn,
  getAllNavigationColumnNewArticle,
  getAllNavigationPlatform,
  getAllNavigationTag,
  getNavigationArticleList,
  removeNavigationArticle,
  requestOnlineNavigationArticle,
  updateNavigationArticle,
  uploadImage,
} from '@/services';
import {
  formatterTime,
  getSingleUrl,
  getUploadFileList,
  transformData,
  withoutFileName,
} from '@/utils';
import useStateCallback from '@/utils/hooks/useStateCallback';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormUploadButton,
  ProTable,
} from '@ant-design/pro-components';
import { Access, history, useModel } from '@umijs/max';
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  //Input,
  Menu,
  message,
  Modal,
  Radio,
  Rate,
  Row,
  Tooltip,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// 默认的编辑器
// @ts-ignore
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
// @ts-ignore
import Table from 'braft-extensions/dist/table';
// @ts-ignore
import { columnList } from '@/pages/Navigation/ColumnList/contants';
import Markdown from 'braft-extensions/dist/markdown';

const options = {
  defaultColumns: 6, // 默认列数
  defaultRows: 5, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
};

BraftEditor.use(Table(options));
BraftEditor.use(Markdown(options));
const handleImageUpload = async (param: any) => {
  const file = param.file;
  const value = (await uploadImage(
    { petId: new Date().getTime() },
    { additionalMetadata: '', file },
    file,
  )) as any;
  if (value) {
    param.success({
      url: value.fileURL,
      meta: {
        id: param.id,
        title: withoutFileName(file.name),
        alt: withoutFileName(file.name),
      },
    });
  }
};

const handleOnline = async (selectedRow: any) => {
  const hide = message.loading('正在设置');
  if (!selectedRow) return true;
  try {
    await requestOnlineNavigationArticle(selectedRow);
    hide();
    message.success('设置成功');
    return true;
  } catch (error: any) {
    hide();
    message.error(error.message);
    return false;
  }
};

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (field: any) => {
  const hide = message.loading('正在添加');
  try {
    await addNavigationArticle({ ...field });
    hide();
    message.success('添加成功');
    return true;
  } catch (error: any) {
    hide();
    message.error(error.message);
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (field: any) => {
  const hide = message.loading('正在更新');
  try {
    await updateNavigationArticle(field);
    hide();
    message.success('更新成功');
    return true;
  } catch (error: any) {
    hide();
    message.error(error.message);
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: any) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    await removeNavigationArticle(selectedRow.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error: any) {
    hide();
    message.error(error.message);
    return false;
  }
};

const FirstAuth: React.FC = () => {
  const {
    location: { pathname },
  } = history;
  const nowColumnType = pathname?.split('/')?.pop() || '';
  const noPlatformArticleType = ['GameExperience', 'Topics', 'Qualification'];
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [state, setState] = useStateCallback({
    htmlValue: '<p></p>',
    markdownValue: '',
    editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
    isMarkdow: 2,
  });
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */

  const actionRef = useRef<ActionType>();
  const markDownRef = useRef();
  const [currentRow, setCurrentRow] = useState<any>();
  const [currentColumn, setCurrentColumn] = useState<any>();
  // const [columnList, setColumnList] = useState<Array<any>>([]);
  const [allPlatform, setAllPlatform] = useState<any>({});
  const formRef = useRef<ProFormInstance>();
  const table_formRef = useRef<ProFormInstance>();
  const { websites, website, setWebsite, getWebsite, isGetWebsite } = useModel('navigation');
  const { initialState } = useModel('@@initialState');
  const { canEdit, canView, canAdd, canDelete, onlineSite, hot } = useModel('auth');
  const [{ confirm }, contextHolder] = Modal.useModal();

  /**
   * 获取栏目列表
   */
  const getColumnListHandle = async (website: string) => {
    const list = await getAllNavigationColumnNewArticle({
      websiteId: website,
    }).then((res) => {
      const list = transformData(res?.list || []);
      return list;
    });
    const nowColumn = list.find((item) => {
      return item.type === nowColumnType;
    });

    setCurrentColumn(nowColumn);

    if (!nowColumn) {
      const d = columnList.find((item) => item.value === nowColumnType);
      const modal = Modal.confirm({
        title: '温馨提示',
        content: (
          <span>
            请先配置<span style={{ color: 'red' }}>{d?.label}</span>类型的栏目
          </span>
        ),
        footer: (
          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Button
              onClick={() => {
                history.back();
                modal.destroy();
              }}
              key={'cancle'}
            >
              取消
            </Button>
            ,
            <Button
              onClick={() => {
                history.push('/navigation/column/list');
                modal.destroy();
              }}
              type={'primary'}
              key={'confirm'}
            >
              确定
            </Button>
          </div>
        ),
      });
    }
  };
  /**
   * 获取所有平台列表
   */
  const getAllNavigationPlatformHandle = async (website: string) => {
    const data = await getAllNavigationPlatform({
      websiteId: website,
    }).then((res) => {
      return (res?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    });
    const obj: Record<string, string> = {};
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      obj[element.value] = element.label;
    }
    setAllPlatform(obj);
  };

  useEffect(() => {
    if (typeof website === 'undefined' && !website) getWebsite();
    if (website) {
      getColumnListHandle(website);
      getAllNavigationPlatformHandle(website);
    }
  }, [website]);

  let columns: ProColumns<any>[] = [
    {
      title: '行号',
      dataIndex: 'index',
      align: 'center',
      render: (text, record, index) => index + 1,
      search: false,
      width: '60px',
    },
    {
      title: '站点名称',
      dataIndex: ['website', 'id'],
      ellipsis: {
        showTitle: true,
      },
      align: 'left',
      valueType: 'select',
      hideInTable: true,
      fieldProps: {
        showSearch: true,
        allowClear: false,
        options: websites,
        onChange: (value) => {
          setWebsite(value);
          table_formRef.current?.submit();
        },
      },

      render: (text, record) => record?.website?.name,
      initialValue: website,
    },
    {
      title: 'SEO关键词',
      dataIndex: 'seoKey',
      align: 'left',
      search: false,
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: 'SEO标题',
      dataIndex: 'seoTitle',
      align: 'left',
      hideInSearch: true,
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: 'SEO描述',
      dataIndex: 'seoDesc',
      align: 'left',
      ellipsis: {
        showTitle: true,
      },
      search: false,
    },
    {
      title: '文章平台',
      dataIndex: ['platform', 'id'],
      align: 'left',
      ellipsis: {
        showTitle: true,
      },
      valueEnum: allPlatform,
      //@ts-ignore
      render: (text: { id: number; name: string }) => {
        return text;
      },
      fieldProps: {
        onChange: () => {
          table_formRef.current?.submit();
        },
      },
    },
    {
      title: '文章标签',
      dataIndex: 'tags',
      align: 'left',
      ellipsis: {
        showTitle: true,
      },
      search: false,
      //@ts-ignore
      render: (text: any[], record) => {
        if (!record.tags) {
          return '--';
        } else {
          const newText = record.tags.map((item: any) => item.name).join(',');

          return (
            <Tooltip placement="topLeft" title={newText}>
              {newText}
            </Tooltip>
          );
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'left',
      width: 80,
      valueEnum: {
        2: {
          text: '禁用',
          status: 'Error',
        },
        1: {
          text: '启用',
          status: 'Success',
        },
      },
      fieldProps: {
        onChange: () => {
          table_formRef.current?.submit();
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      search: false,
      align: 'left',
      width: '160px',
      render: (text: any) => {
        return text ? formatterTime(text * 1000) : '';
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: '150px',
      render: (_, record) => [
        <Access accessible={canEdit} key="config" fallback={null}>
          <a
            style={{ color: initialState?.settings?.colorPrimary }}
            key="config"
            onClick={() => {
              setCurrentRow(record);
              setState({
                htmlValue: record.content,
                markdownValue: record.markdownContent,
                editorState: BraftEditor.createEditorState(record.content),
                isMarkdow: record?.isMarkdow,
              });
              handleModalOpen(true);
            }}
          >
            修改
          </a>
        </Access>,
        <Access accessible={onlineSite || hot || canDelete} fallback={null} key="more">
          <Dropdown
            key="more"
            overlay={
              <Menu>
                {onlineSite && (
                  <Menu.Item key="setStoryOnline">
                    <Access accessible={onlineSite} fallback={null}>
                      <a
                        style={{ color: initialState?.settings?.colorPrimary }}
                        key="setStoryOnline"
                        onClick={() => {
                          confirm({
                            title: '设置确认',
                            content: record.status === 1 ? '是否禁用' : '是否启用',
                            onOk: async () => {
                              const success = await handleOnline({
                                id: record.id,
                                status: record.status === 1 ? 2 : 1,
                                websiteId: website,
                              });
                              if (actionRef.current && success) {
                                actionRef.current.reload();
                              }
                            },
                          });
                        }}
                      >
                        {record.status === 1 ? '禁用' : '启用'}
                      </a>
                    </Access>
                  </Menu.Item>
                )}
                {onlineSite && <Menu.Divider />}
                {canDelete && (
                  <Menu.Item key="subscribeAlert">
                    <Access accessible={canDelete} fallback={null} key="subscribeAlert">
                      <a
                        style={{ color: initialState?.settings?.colorPrimary }}
                        key="subscribeAlert"
                        onClick={() => {
                          confirm({
                            title: '删除确认',
                            content: `是否删除`,
                            onOk: async () => {
                              const success = await handleRemove(record);
                              if (success && actionRef.current) {
                                actionRef.current.reload();
                              }
                            },
                          });
                        }}
                      >
                        删除
                      </a>
                    </Access>
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <a style={{ color: initialState?.settings?.colorPrimary }}>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </Access>,
      ],
    },
  ];

  // 根据平台过滤参数
  columns = columns.filter((item) => {
    if (item.dataIndex === 'tags' && nowColumnType !== 'GameExperience') {
      return false;
    }
    if (item.title === '文章平台' && noPlatformArticleType.includes(nowColumnType)) {
      return false;
    }
    return true;
  });

  function handleEditorChange(text: string) {
    setState({
      markdownValue: text,
    });
  }

  return (
    <PageContainer>
      {contextHolder}
      {isGetWebsite && (
        <ProTable<
          any,
          API.PageParams & {
            title?: string;
            seoTitle?: string;
            status?: number;
            platform?: { id: number };
            website?: { id: number };
          }
        >
          headerTitle={'文章管理'}
          defaultSize="small"
          pagination={{
            pageSize: 10,
          }}
          actionRef={actionRef}
          formRef={table_formRef}
          rowKey="id"
          cardBordered
          search={
            canView
              ? {
                  labelWidth: 120,
                }
              : false
          }
          toolBarRender={() => [
            <Access accessible={canAdd} fallback={null} key="add">
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  if (!currentColumn?.value) {
                    return;
                  }
                  setCurrentRow({
                    isMarkdow: 2,
                  });
                  setState({
                    htmlValue: '<p></p>',
                    markdownValue: '',
                    isMarkdow: 2,
                    editorState: BraftEditor.createEditorState(''),
                  });
                  handleModalOpen(true);
                }}
              >
                <PlusOutlined /> 新增
              </Button>
            </Access>,
          ]}
          request={async (
            // 第一个参数 params 查询表单和 params 参数的结合
            // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
            params,
          ) => {
            // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
            // 如果需要转化参数可以在这里进行修改
            if (!canView) {
              return {
                data: [],
                // success 请返回 true，
                // 不然 table 会停止解析数据，即使有数据
                success: true,
                // 不传会使用 data 的长度，如果是分页一定要传
                total: 0,
              };
            }
            try {
              const msg = await getNavigationArticleList({
                page: params.current,
                pageSize: params.pageSize,
                title: params.title,
                seoTitle: params.seoTitle,
                websiteId: params?.website?.id,
                status: params?.status,
                columnType: nowColumnType,
                platformId: params?.platform?.id,
              });
              return {
                data: msg?.list,
                // success 请返回 true，
                // 不然 table 会停止解析数据，即使有数据
                success: true,
                // 不传会使用 data 的长度，如果是分页一定要传
                total: msg?.totalRecord,
              };
            } catch (error) {
              return {
                data: [],
                // success 请返回 true，
                // 不然 table 会停止解析数据，即使有数据
                success: true,
                // 不传会使用 data 的长度，如果是分页一定要传
                total: 0,
              };
            }
          }}
          columns={columns}
        />
      )}

      {
        <ModalForm
          name="modalForm"
          className="storyModalForm ArticleModalForm"
          title={currentRow?.id ? '修改' : '新增'}
          initialValues={{
            ...currentRow,
            image: getUploadFileList(currentRow?.image) || '',
            columnId: currentColumn?.value || '',
            tags: currentRow?.tags?.map((item: any) => Number(item.id)),
            platformId: currentRow?.platform?.id,
          }}
          formRef={formRef}
          modalProps={{
            destroyOnClose: true,
            maskClosable: false,
            centered: true,
          }}
          width={'90%'}
          open={createModalOpen}
          onOpenChange={handleModalOpen}
          onFinish={async (value) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { tags, platform, recommendIndex, ...rest } = currentRow;
            try {
              const services = !!currentRow?.id ? handleUpdate : handleAdd;

              const success = await services({
                ...rest,
                ...value,
                // columnId: Array.isArray(value?.columnId) ? value.columnId?.pop() : value.columnId,
                columnId: currentColumn?.value || '',
                websiteId: website,

                content:
                  //@ts-ignore
                  value.isMarkdow === 2 ? state.htmlValue : markDownRef?.current?.vditor.getHTML(),
                markdownContent: value.isMarkdow === 1 ? state.markdownValue : '',
                isMarkdow: value.isMarkdow,
                image: getSingleUrl(value.image),
              } as any);
              if (success) {
                handleModalOpen(false);
                setState({
                  htmlValue: '<p></p>',
                  markdownValue: '',
                  isMarkdow: 2,
                  editorState: BraftEditor.createEditorState(''),
                });
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <Row gutter={24}>
            <Col span={4}>
              <Form.Item
                label={'SEO关键词(Keywords)'}
                name="seoKey"
                rules={[
                  {
                    required: true,
                    message: '请输入SEO关键词',
                  },
                  {
                    validator(rule, value: string, callback) {
                      if (typeof value === 'string') {
                        let i = 0;
                        for (let j = 0; j < value.length; j++) {
                          if (value[j] === ',' || value[j] === '，') {
                            i++;
                          }
                        }
                        if (i > 5) {
                          callback('关键字太多，不要超过6个');
                        }
                        callback();
                      }
                      callback();
                    },
                  },
                ]}
              >
                <KeyWord isEdit={Boolean(!!currentRow?.id)} />
              </Form.Item>
              <Form.Item
                label={'SEO标题(Title)：'}
                name="seoTitle"
                rules={[
                  {
                    required: true,
                    message: '请输入SEO标题',
                  },
                  {
                    max: 30,
                    min: 10,
                    message: 'SEO标题长度为10-30',
                  },
                ]}
              >
                <CountInput
                  type={'input'}
                  placeholder="请输入SEO标题，长度为10-30"
                  maxLength={30}
                  minLength={10}
                />
              </Form.Item>

              <Form.Item
                label={'SEO描述(Description)：'}
                name="seoDesc"
                rules={[
                  {
                    required: true,
                    message: '请输入SEO描述',
                  },
                  {
                    max: 80,
                    min: 55,
                    message: 'SEOSEO描述长度为55-80',
                  },
                ]}
              >
                <CountInput
                  type={'textarea'}
                  placeholder="请输入SEO描述，长度为55-80"
                  maxLength={80}
                  minLength={55}
                />
              </Form.Item>

              <Divider style={{ marginTop: '20px', marginBottom: '10px' }} />

              <Form.Item
                label={'文章主标题：'}
                name="mainTitle"
                rules={[
                  {
                    required: true,
                    message: '请输入文章主标题',
                  },
                  {
                    max: 30,
                    min: 10,
                    message: '文章主标题长度为10-30',
                  },
                ]}
              >
                <CountInput
                  type={'input'}
                  placeholder="请输入文章主标题，长度为10-30"
                  maxLength={30}
                  minLength={10}
                />
              </Form.Item>

              <Form.Item
                label={'文章副标题：'}
                name="subtitle"
                rules={[
                  {
                    required: true,
                    message: '请输入文章副标题',
                  },
                  {
                    max: 50,
                    min: 20,
                    message: '文章副标题长度为20-50',
                  },
                ]}
              >
                <CountInput
                  type={'textarea'}
                  placeholder="请输入文章副标题，长度为20-50"
                  maxLength={50}
                  minLength={20}
                />
              </Form.Item>

              <Form.Item
                label={'文章简介：'}
                name="intro"
                rules={[
                  {
                    required: true,
                    message: '请输入文章简介',
                  },
                  {
                    max: 200,
                    min: 20,
                    message: '文章简介长度为20-200',
                  },
                ]}
              >
                <CountInput
                  type={'textarea'}
                  placeholder="请输入文章副标题，长度为20-200"
                  maxLength={200}
                  minLength={20}
                />
              </Form.Item>

              {/* <Form.Item
              label={'文章栏目：'}
              name="columnId"
              rules={[
                {
                  required: true,
                  message: '请选择文章栏目',
                },
              ]}
            >
              <Cascader
                allowClear
                placeholder={'请选择文章栏目'}
                changeOnSelect
                options={columnList}
              />
            </Form.Item> */}

              {nowColumnType === 'GameRecommend' && (
                <Form.Item
                  label={'推荐星数'}
                  name="recommendIndex"
                  rules={[
                    {
                      required: true,
                      message: '请选择推荐星数',
                    },
                  ]}
                >
                  <Rate allowHalf />
                </Form.Item>
              )}

              {nowColumnType === 'GameExperience' && (
                <ProFormSelect
                  name="tags"
                  label="文章标签："
                  mode="multiple"
                  allowClear
                  request={async () =>
                    getAllNavigationTag({
                      websiteId: website,
                    }).then((res) => {
                      return (res.list || []).map((item: any) => ({
                        label: item.name,
                        value: item.id,
                      }));
                    })
                  }
                  rules={[
                    {
                      required: true,
                      message: '请选择文章标签',
                    },
                  ]}
                />
              )}

              {!noPlatformArticleType.includes(nowColumnType) && (
                <ProFormSelect
                  name="platformId"
                  label="文章平台："
                  allowClear
                  placeholder={'请选择文章平台'}
                  request={async () =>
                    getAllNavigationPlatform({
                      websiteId: website,
                    }).then((res) => {
                      return (res.list || []).map((item: any) => ({
                        label: item.name,
                        value: item.id,
                      }));
                    })
                  }
                  rules={[
                    {
                      required: true,
                      message: '请选择文章平台',
                    },
                  ]}
                />
              )}

              <ProFormUploadButton
                label="封面图："
                name="image"
                tooltip={'如果不上传图片使用落地页默认图片'}
                fieldProps={{
                  listType: 'picture-card',
                  maxCount: 1,
                  action: '/admin/v1/common/file/upload',
                  headers: {
                    'X-API-TOKEN': `${sessionStorage.getItem('token')}`,
                  },
                  onChange: (info) => {
                    if (info.file.status === 'done') {
                      message.success('上传成功');
                      formRef.current?.setFieldsValue({
                        image: getUploadFileList(info.file.response.data.fileURL),
                      });
                    } else if (info.file.status === 'error') {
                      message.error('上传失败');
                    }
                  },
                }}
              />
            </Col>
            <Col span={20}>
              {/* <Form.Item label={'SEO 图片Alt'} name="imageAlt">
              <Input placeholder={'请输入文章图片描述'} />
            </Form.Item> */}
              <Form.Item label={''} name="isMarkdow">
                <Radio.Group
                  onChange={(e) => {
                    setState(
                      {
                        isMarkdow: e.target.value,
                      },
                      () => {
                        if (e.target.value === 1) {
                          setState({
                            markdownValue: state.markdownValue,
                          });
                        } else {
                          setState({
                            editorState: BraftEditor.createEditorState(state.htmlValue),
                          });
                        }
                      },
                    );
                  }}
                  value={state.isMarkdow}
                  style={{ marginBottom: 8 }}
                >
                  <Radio.Button value={2}>默认</Radio.Button>
                  <Radio.Button value={1}>Markdown</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label={''} name="content">
                <>
                  <div
                    className="editor-wrapper"
                    style={{
                      backgroundColor: '#ffffff',
                      visibility: state.isMarkdow === 1 ? 'visible' : 'hidden',
                      position: state.isMarkdow === 1 ? 'static' : 'absolute',
                      top: state.isMarkdow === 1 ? '' : '-9999px',
                    }}
                  >
                    <MarkdownEditor
                      onChange={handleEditorChange}
                      value={state.markdownValue}
                      height={664}
                      //@ts-ignore
                      ref={markDownRef}
                    />
                  </div>
                  <div
                    className="editor-wrapper"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0e0',
                      visibility: state.isMarkdow === 1 ? 'hidden' : 'visible',
                      position: state.isMarkdow !== 1 ? 'static' : 'absolute',
                      top: state.isMarkdow !== 1 ? '' : '-9999px',
                    }}
                  >
                    <BraftEditor
                      value={state.editorState}
                      onChange={(editorState: any) => {
                        const html = editorState.toHTML();
                        setState({ editorState: html }, () => {
                          setState({ htmlValue: html });
                        });
                      }}
                      style={{ color: '#333' }}
                      media={{ uploadFn: handleImageUpload }}
                    />
                  </div>
                </>
              </Form.Item>
            </Col>
          </Row>
        </ModalForm>
      }
    </PageContainer>
  );
};

export default FirstAuth;
