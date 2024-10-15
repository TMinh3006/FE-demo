import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Row,
  Col,
  Pagination,
  Select,
  Spin,
  Checkbox,
  notification,
} from 'antd';
import { Rate } from 'antd';

import brandApi from '@/Apis/Brands/Brand.api';
import { IProduct, IProductResponse } from '@/Apis/Brands/Brands.interface';

const { Option } = Select;

const BrandPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // Thay đổi về giá trị ban đầu của page
  const [limit, setLimit] = useState(16);
  const [totalProducts, setTotalProducts] = useState(0);
  const [brandName, setBrandName] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('Giá');
  const [priceRange, setPriceRange] = useState<[number, number] | undefined>(
    undefined
  );
  const [brands, setBrands] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);

  const fetchProductsByBrandId = async (brandId: string) => {
    try {
      setLoading(true);
      const response: IProductResponse = await brandApi.getBrandById(
        brandId,
        page - 2, // Truyền page + 1 cho API
        limit
      );
      setProducts(response.products);
      setAllProducts(response.products);
      setTotalProducts(response.totalPages * limit);

      const uniqueBrands = Array.from(
        new Set(response.products.map((product) => product.brandName))
      );
      const brandOptions = uniqueBrands.map((brand) => ({
        label: brand,
        value: brand,
      }));
      setBrandOptions(brandOptions);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
      setProducts([]);
      setAllProducts([]);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải sản phẩm. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandName = async (brandId: string) => {
    try {
      const response = await brandApi.getBrandById(brandId, page - 2, limit);
      setBrandName(response.products[0]?.brandName || 'Thương hiệu');
    } catch (error) {
      console.error('Error fetching brand name:', error);
      setBrandName('Thương hiệu');
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductsByBrandId(id);
      fetchBrandName(id);
    }
  }, [id, page, limit]);

  useEffect(() => {
    if (allProducts.length > 0) {
      const filteredByPrice = allProducts.filter((product) => {
        const productPrice = product.price;
        const [minPrice, maxPrice] = priceRange || [0, Infinity];
        return productPrice >= minPrice && productPrice <= maxPrice;
      });

      const filteredByBrand = filteredByPrice.filter((product) => {
        return brands.length === 0 || brands.includes(product.brandName);
      });

      const sortedProducts = [...filteredByBrand].sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.price - b.price;
        } else if (sortBy === 'price_desc') {
          return b.price - a.price;
        }
        return 0;
      });

      setProducts(sortedProducts);
    }
  }, [priceRange, brands, allProducts, sortBy]);

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page); // Chuyển đổi page từ 1 sang 0
    setLimit(pageSize);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePriceRangeChange = (checkedValues: string[]) => {
    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    switch (checkedValues[0]) {
      case 'duoi_100':
        maxPrice = 100000;
        break;
      case '100_500':
        minPrice = 100000;
        maxPrice = 500000;
        break;
      case 'tren_500':
        minPrice = 500000;
        break;
      default:
        minPrice = undefined;
        maxPrice = undefined;
    }

    setPriceRange([minPrice || 0, maxPrice || Infinity]);
    setSelectedPriceRange(checkedValues);
  };

  const handleBrandChange = (checkedValues: string[]) => {
    setBrands(checkedValues);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="m-12 flex flex-col">
      <h1 className="-mb-1 text-2xl font-bold">{brandName}</h1>
      <div className="flex items-end justify-end">
        <h3 className="mx-4 my-3 text-lg font-semibold">Sắp xếp theo</h3>
        <Select
          value={sortBy}
          onChange={handleSortChange}
          className="mb-4 h-auto w-1/5"
        >
          <Option value="price_asc">Giá tăng dần</Option>
          <Option value="price_desc">Giá giảm dần</Option>
        </Select>
      </div>

      <div className="mt-1 flex flex-row">
        <div className="h-1/3 w-56 rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-3 text-lg font-semibold">Khoảng giá</h3>
          <Checkbox.Group
            className="flex flex-col"
            options={[
              { label: 'Dưới 100,000 VND', value: 'duoi_100' },
              { label: '100,000 - 500,000 VND', value: '100_500' },
              { label: 'Trên 500,000 VND', value: 'tren_500' },
            ]}
            value={selectedPriceRange}
            onChange={handlePriceRangeChange}
          />

          <h3 className="my-3 text-lg font-semibold">Thương hiệu</h3>
          <Checkbox.Group
            className="flex flex-col"
            options={brandOptions}
            value={brands}
            onChange={handleBrandChange}
          />
        </div>

        <div className="w-full pl-12">
          <Row className="flex flex-wrap">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <Col
                  className="m-3 flex flex-col items-center justify-center rounded-md bg-white p-4 shadow-md"
                  key={product.id}
                  span={5}
                >
                  {product.thumbnails.length > 0 ? (
                    <img
                      src={product.thumbnails[0]}
                      alt={product.name}
                      className="h-40 w-40 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-40 items-center justify-center rounded-md bg-gray-200">
                      <span>No image</span>
                    </div>
                  )}
                  <div className="mt-3 w-full">{product.brandName}</div>
                  <Link to={`/ProductDetail/${product.id}`}>
                    <button className="truncate-limit-custom mt-2 w-full text-center text-base font-semibold">
                      {product.name}
                    </button>
                  </Link>
                  <div className="mt-2 flex items-center">
                    <Rate className="mr-2 text-yellow-500" />
                  </div>
                  <div className="text-lg text-red-500">
                    {product.price.toLocaleString()}đ
                  </div>
                </Col>
              ))
            ) : (
              <div>Không có sản phẩm nào.</div>
            )}
          </Row>

          <div className="mt-6 flex justify-center">
            <Pagination
              current={page}
              pageSize={limit}
              total={totalProducts}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
