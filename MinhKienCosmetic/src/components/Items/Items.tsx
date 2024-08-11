import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Divider, Row } from 'antd';
import { StarOutlined } from '@ant-design/icons';

import NTT from '@/assets/NTT.jpeg';

const Items: React.FC = () => (
  <div>
    <Divider orientation="left">SẢN PHẨM BÁN CHẠY</Divider>
    <Row gutter={9}>
      <Col span={6}>
        <div className="m-3 flex w-40 flex-col items-center justify-center rounded-md bg-pink-20 py-6">
          <img src={NTT} className="flex h-20 w-20 rounded-md" />
          <div>Sunplay</div>
          <Link to="/ProductDetail">
            <button>Nước Tẩy trang</button>
          </Link>
          <div>
            <StarOutlined />
          </div>

          <div>88.000</div>
        </div>
      </Col>
    </Row>
  </div>
);

export default Items;
