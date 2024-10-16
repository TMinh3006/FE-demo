import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Pagination, Select, Spin, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { Rate } from 'antd';
import productApi from '@/Apis/Product/Product.api';
import categoryApi from '@/Apis/Categories/Category.api';
import { IProduct, IProductResponse } from '@/Apis/Product/Product.interface';

const { Option } = Select;

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<IProduct[]>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(16);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categoryName, setCategoryName] = useState<string>('');
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

  const fetchProductsByCategoryId = async (categoryId: string) => {
    try {
      setLoading(true);
      const response: IProductResponse = await productApi.getCategoryId(
        categoryId,
        page + 1,
        limit
      );
      console.log('danh sach san pham:', response);
      setProducts(response.products);
      setAllProducts(response.products);
      setTotalProducts(response.totalPages * limit);

      // Trích xuất thương hiệu từ sản phẩm
      const uniqueBrands = Array.from(
        new Set(response.products.map((product) => product.brandName))
      );
      const brandOptions = uniqueBrands.map((brand) => ({
        label: brand,
        value: brand,
      }));
      setBrandOptions(brandOptions);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
      setProducts([]);
      setAllProducts([]);
      setLoading(false);
    }
  };
  const fetchCategoryName = async (categoryId: string) => {
    try {
      const response = await categoryApi.getCategoryById(categoryId);
      setCategoryName(response.name || 'Danh mục');
    } catch (error) {
      console.error('Error fetching category name:', error);
      setCategoryName('Danh mục');
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductsByCategoryId(id);
      fetchCategoryName(id);
    }
  }, [id, page, limit]);

  useEffect(() => {
    if (allProducts.length > 0) {
      // Lọc sản phẩm theo khoảng giá
      const filteredByPrice = allProducts.filter((product) => {
        const productPrice = product.price;
        const [minPrice, maxPrice] = priceRange || [0, Infinity];
        return productPrice >= minPrice && productPrice <= maxPrice;
      });

      // Lọc sản phẩm theo thương hiệu
      const filteredByBrand = filteredByPrice.filter((product) => {
        return brands.length === 0 || brands.includes(product.brandName);
      });

      // Sắp xếp sản phẩm
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

  // Xử lý thay đổi trang và số lượng sản phẩm mỗi trang
  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setLimit(pageSize);
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Xử lý thay đổi khoảng giá
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
    return <Spin />;
  }

  return (
    <div className="m-12 flex flex-col">
      <h1 className="-mb-1 text-2xl font-bold">{categoryName}</h1>
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
        {/* Bộ lọc sản phẩm nằm bên trái */}
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

        {/* Danh sách sản phẩm nằm bên phải */}
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

          {/* Phân trang */}
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

export default CategoryPage;
