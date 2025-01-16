import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const FailurePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>❌ Thanh toán thất bại!</h1>
      <p>Vui lòng kiểm tra lại hoặc thử thanh toán lần nữa.</p>
      <Button type="primary" onClick={() => navigate('/cart')}>
        Quay lại giỏ hàng
      </Button>
    </div>
  );
};

export default FailurePage;
