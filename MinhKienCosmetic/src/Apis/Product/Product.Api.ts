import { AddToCartRequest, IProduct } from './Product.Interface';
import { apiService } from '@/configs/apiService';

export default {
  getProducts(page: number, limit: number): Promise<IProduct[]> {
    return apiService
      .get(`/api/v1/products`, {
        params: { page, limit },
      })
      .then((response) => response.data.products);
  },

  getById(id: string): Promise<IProduct & { id?: string }> {
    return apiService.get(`/api/v1/products/${id}`).then((response) => {
      console.log('API:', response);
      return response.data;
    });
  },

  getCategoryId(
    categoryId: string,
    page: number,
    limit: number,
    sortBy: string,
    priceRange?: [number, number], // Thêm khoảng giá
    brands?: string[]
  ): Promise<{ items: IProduct[]; total: number }> {
    // Khởi tạo params
    const params: {
      page: number;
      limit: number;
      sortBy: string;
      brands?: string;
    } = {
      page,
      limit,
      sortBy,
    };

    return apiService
      .get(`/api/v1/products/category/${categoryId}`, { params })
      .then((response) => {
        console.log('sanpham:', response);

        let items = response.data || [];
        if (priceRange) {
          items = items.filter(
            (product: IProduct) =>
              product.price >= priceRange[0] && product.price <= priceRange[1]
          );
        }

        if (brands && brands.length > 0) {
          items = items.filter((product: IProduct) =>
            brands.includes(product.brand.name)
          );
        }

        return {
          items,
          total: response.data || items.length,
        };
      });
  },
  addToCart(
    userId: string,
    data: AddToCartRequest
  ): Promise<AddToCartRequest[]> {
    console.log('Gửi yêu cầu đến API');
    return apiService

      .post(`/api/v1/carts/add?userId=${userId}`, data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('giỏ hàng sai:', error);
        throw error; // Ném lỗi để xử lý ở nơi khác
      });
  },
};
