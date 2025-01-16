import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Link, useParams } from 'react-router-dom';
import blogApi from '@/Apis/Blog/Blog.api'; // Giả sử API này có sẵn
import { IBlog } from '@/Apis/Blog/Blog.interface';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL params
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [otherBlogs, setOtherBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Hàm lấy dữ liệu blog từ API
  const fetchBlog = async (id: string) => {
    try {
      const blogData = await blogApi.getBlogById(id); // Gọi API để lấy blog theo id
      setBlog(blogData);

      const allBlogs = await blogApi.getBlog(0, 5);
      setOtherBlogs(allBlogs.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!blog) {
    return <div>Không tìm thấy bài viết</div>;
  }

  const renderContent = () => {
    const content: JSX.Element[] = [];
    const maxLength = Math.max(
      blog.thumbnails?.length || 0,
      blog.description.length
    );

    for (let i = 0; i < maxLength; i++) {
      content.push(
        <div className="my-4">
          {/* Description */}
          {blog.description[i] && (
            <p className="mb-2 mt-4 text-base">{blog.description[i]}</p>
          )}

          {/* Thumbnails */}
          {blog.thumbnails?.[i] && (
            <div className="my-4 flex items-center justify-center">
              <img
                src={blog.thumbnails[i]}
                alt={`${blog.title} - image ${i + 1}`}
                className="h-[500px] w-[600px] rounded-md object-contain"
              />
            </div>
          )}
        </div>
      );
    }

    return content;
  };

  return (
    <div className="grid grid-cols-12 gap-6 bg-white p-6 px-20">
      {/* Cột bên trái: Chi tiết blog */}
      <div className="col-span-8">
        <h1 className="mb-6 text-2xl font-bold">{blog.title}</h1>
        {renderContent()}
      </div>

      {/* Cột bên phải: Danh sách các blog khác */}
      <div className="col-span-4">
        <h2 className="mb-4 text-xl font-semibold">Các bài viết khác</h2>
        <ul className="space-y-4">
          {otherBlogs.map((item) => (
            <li key={item.id} className="rounded-md border p-4 hover:shadow-md">
              <Link to={`/blog/${item.id}`}>
                <img
                  src={item.thumbnails?.[0]}
                  alt={item.title}
                  className="h-full w-full rounded-md object-cover"
                />
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="truncate-limit-custom font-base mt-1 w-full text-xs text-gray-600">
                  {item.description[0]}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogDetail;
