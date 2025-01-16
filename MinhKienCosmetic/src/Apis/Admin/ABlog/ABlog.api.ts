import { Blog, IBlog, IBlogResponse } from './ABlog.interface';
import { apiService } from '@/configs/apiService';

export default {
  getBlog(page: number, limit: number): Promise<IBlog[]> {
    return apiService
      .get(`/products/blogs/get-all-blogs`, {
        params: { page, limit },
      })
      .then((response) => response.data);
  },

  getBlogbyId(id: string): Promise<IBlog> {
    return apiService
      .get(`/products/blogs/${id}`)
      .then((response) => response.data);
  },

  createBlog(data: Blog): Promise<IBlogResponse> {
    return apiService
      .post(`/products/blogs/create-blog`, data)
      .then((response) => response.data);
  },

  updateBlog(id: string, data: Blog): Promise<IBlogResponse> {
    return apiService
      .put(`/products/blogs/${id}`, data)
      .then((response) => response.data);
  },
  deleteBlog(id: string): Promise<IBlogResponse> {
    return apiService
      .delete(`/products/blogs/${id}`)
      .then((response) => response.data);
  },
};
