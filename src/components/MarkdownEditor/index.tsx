import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from 'react';
import Vditor from 'vditor';

import 'vditor/dist/index.css';

export interface MarkdownEditorProps {
  height?: number;
  minHeight?: number;
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = forwardRef(
  ({ height = 500, minHeight = 300, value, onChange }, ref) => {
    const vRef = useRef<any>(null);
    const [vd, setVd] = useState<Vditor>();
    useImperativeHandle(ref, () => ({
      vditor: vd,
    }));
    useEffect(() => {
      if (vRef?.current) {
        console.log(vRef?.current);
        const vditor = new Vditor('vditor', {
          height,
          minHeight,
          mode: 'sv',
          preview: {
            mode: 'both',
            actions: ['desktop', 'mobile'],
          },
          counter: {
            enable: true,
          },
          toolbar: [
            'headings',
            'bold',
            'italic',
            'strike',
            'link',
            '|',
            'list',
            'ordered-list',
            'check',
            'outdent',
            'indent',
            '|',
            'quote',
            'line',
            'code',
            'inline-code',
            'insert-before',
            'insert-after',
            '|',
            'upload',
            'table',
            '|',
            'undo',
            'redo',
            '|',
            'fullscreen',
            'edit-mode',
          ],

          outline: {
            enable: true,
            position: 'right',
          },
          theme: 'classic',
          // upload: {
          //   url: '/admin/v1/common/file/upload',
          //   linkToImgUrl: '/admin/v1/common/file/upload',
          //   headers: {
          //     'X-API-TOKEN': `${sessionStorage.getItem('token')}`,
          //   },
          //   withCredentials: true,
          //   fieldName: 'file',
          //   multiple: false,
          //   format: (files: File[], responseText: string) => {
          //     // eslint-disable-next-line no-eval
          //     const res = eval('(' + responseText + ')');
          //     if (res.status_code === 6000) {
          //       const data = {
          //         msg: res.message,
          //         code: 0,
          //         data: {
          //           errFiles: [],
          //           succMap: {
          //             [res.data.filename]: res.data.fileURL,
          //           },
          //         },
          //       };
          //       return JSON.stringify(data);
          //     } else {
          //       const data = {
          //         msg: res.message,
          //         code: 0,
          //         data: {
          //           errFiles: [res.data.filename],
          //           succMap: {},
          //         },
          //       };
          //       return JSON.stringify(data);
          //     }
          //   },
          // },
          after: () => {
            vditor.setValue(value);
            setVd(vditor);
          },
          input(md) {
            onChange(md);
          },
        });
      }
    }, [vRef?.current]);
    return <div ref={vRef} id="vditor" className="vditor"></div>;
  },
);

export default MarkdownEditor;
