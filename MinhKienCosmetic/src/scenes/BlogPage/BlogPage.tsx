import React, { useEffect, useState } from 'react';
import blogService from '@/Apis/Blog/Blog.api';
import { IBlog } from '@/Apis/Blog/Blog.interface';
import { Col, Divider, Row } from 'antd';
import { Link } from 'react-router-dom';

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getBlog(0, 4);
        setBlogs(data);
      } catch (error) {
        console.error('Lỗi khi tải blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <Divider
        orientation="center"
        style={{ fontSize: '28px', fontWeight: '700', paddingTop: '25px' }}
      >
        Tin Tức & Cẩm Nang Làm Đẹp
      </Divider>
      <Row className="flex items-center justify-center pb-4" gutter={16}>
        {blogs.map((item, index) => (
          <Col
            className="m-3 flex w-60 flex-col items-center justify-center rounded-md bg-slate-50 pb-4 font-bold shadow-lg"
            key={index}
            span={5}
          >
            <Link to={`/blog/${item.id}`}>
              <img
                src={item.thumbnails?.[0]}
                alt={item.title}
                className="h-full w-full rounded-md object-cover"
              />
            </Link>
            <Link to={`/blog/${item.id}`}>
              <div className="mt-2 w-full">
                <button className="truncate-limit-custom w-full text-sm font-semibold">
                  {item.title}
                </button>
              </div>
            </Link>

            <div className="truncate-limit-custom mt-1 w-full font-normal text-gray-600">
              {item.description}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BlogPage;
