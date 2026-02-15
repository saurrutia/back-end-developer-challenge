import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        hashed: false,
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ff6b35',
          borderRadius: 8,
          colorTextPlaceholder: '#999999',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
