import { IBlog } from './Blog.interface';
import { apiService } from '@/configs/apiService';

export default {
  getBlog(page: number, limit: number): Promise<IBlog[]> {
    return apiService
      .get(`/products/blogs/get-all-blogs`, {
        params: { page, limit },
      })
      .then((response) => response.data);
  },
  getBlogById(id: string): Promise<IBlog> {
    return apiService
      .get(`/products/blogs/${id}`)
      .then((response) => response.data);
  },
};
