import { ProFormText, ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { getPermissionAll } from '@/services/permission';
import MarkdownEditor from '@/components/MarkdownEditor';
import useStateCallback from '@/hooks/useStateCallback';
import React, { useRef } from 'react';
import { Form, Radio } from 'antd';

// 富文本编辑器
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
// @ts-ignore
import Table from 'braft-extensions/dist/table';
// @ts-ignore
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

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: API.ArticleListItem) => Promise<void>;
  updateModalOpen: boolean;
  values: API.ArticleListItem | undefined;
};

const handleImageUpload = async (param: any) => {
  const file = param.file;
  console.log(file);
  // const value = (await uploadImage(
  //   { petId: new Date().getTime() },
  //   { additionalMetadata: '', file },
  //   file,
  // )) as any;
  // if (value) {
  //   param.success({
  //     url: value.fileURL,
  //     meta: {
  //       id: param.id,
  //       title: (file.name),
  //       alt: (file.name),
  //     },
  //   });
  // }
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const markDownRef = useRef<any>(null);
  const [state, setState] = useStateCallback({
    htmlValue: '<p></p>',
    markdownValue: '',
    editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
    isMarkdow: 2,
  });

  function handleEditorChange(text: string) {
    setState({
      markdownValue: text,
    });
  }

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
      title={`${props?.values?.id ? '修改' : '新增'}文章`}
      width={'90%'}
      initialValues={{
        ...props.values,
        isMarkdow: props?.values?.isMarkdow || 2,
      }}
      onFinish={async (values) => {
        const obj = {
          ...values,
          content:
            values.isMarkdow === 2 ? state.htmlValue : markDownRef?.current?.vditor?.getHTML?.(),
          markdownContent: values.isMarkdow === 1 ? state.markdownValue : '',
          isMarkdow: values.isMarkdow,
        };
        if (props?.values?.id) {
          return props.onSubmit({
            id: props?.values?.id,
            ...obj,
          });
        } else {
          return props.onSubmit(obj);
        }
      }}
    >
      <ProFormText
        name={'title'}
        label={'文章标题'}
        width="md"
        placeholder={'请输入文章标题！'}
        rules={[
          {
            required: true,
            message: '请输入文章标题！',
          },
        ]}
      />

      {state.isMarkdow && (
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
            style={{ marginBottom: 8 }}
          >
            <Radio.Button value={2}>默认</Radio.Button>
            <Radio.Button value={1}>Markdown</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}

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
    </ModalForm>
  );
};

export default UpdateForm;
