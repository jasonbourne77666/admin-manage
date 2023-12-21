import { PageContainer } from '@ant-design/pro-components';

import React from 'react';

const Admin: React.FC = () => {
  return (
    <PageContainer content={''}>
      <p style={{ textAlign: 'center', marginTop: 24 }}>
        Want to add more pages? Please refer to{' '}
        <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
          use block
        </a>
        。
      </p>
    </PageContainer>
  );
};

export default Admin;
