import React from 'react';
import { SelectedPage } from '@/Shared/types';

const BlogPage = () => {
  return (
    <div>
      <section id={SelectedPage.BLOG_LÀM_ĐẸP}>
        <h1>Blog Làm Đẹp</h1>
        <p>Thông tin và bài viết về làm đẹp.</p>
      </section>
    </div>
  );
};

export default BlogPage;
