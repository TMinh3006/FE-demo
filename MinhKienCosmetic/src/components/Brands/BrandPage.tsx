import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Pagination, Select, Spin, Checkbox } from 'antd';
import { Rate } from 'antd';

import brandApi from '@/Apis/Product/Product.api';
import brandsApi from '@/Apis/Brands/Brand.api';
import { IProduct, IProductDetail } from '@/Apis/Product/Product.interface';
import { IBrands } from '@/Apis/Brands/Brands.interface';
import BgBrands from '@/assets/category.webp';

const { Option } = Select;

const BrandPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<IProductDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // Thay đổi về giá trị ban đầu của page
  const [limit, setLimit] = useState(16);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [brandName, setBrandName] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('price');
  const [sortDirection, setSortDirection] = useState<string>('asc');
  const [priceRange, setPriceRange] = useState<[number, number] | undefined>(
    undefined
  );
  const [brands, setBrands] = useState<Record<string, IBrands>>({});
  const [filteredProducts, setFilteredProducts] = useState<IProductDetail[]>(
    []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);

  const fetchProductsByBrandId = async (brandId: string) => {
    setLoading(true);
    try {
      const response: IProduct = await brandApi.getBrandById(
        brandId,
        page,
        limit,
        sortBy,
        sortDirection,
        selectedBrand,
        priceRange
      );
      setProducts(response.result.products);
      setFilteredProducts(response.result.products);
      setTotalPages(response.result.totalPages);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      const fetchedBrands: Record<string, IBrands> = {};
      try {
        for (const product of products) {
          const brandId = product.brandId;
          if (brandId && !fetchedBrands[brandId]) {
            const brand = await brandsApi.getBrandId(brandId);
            fetchedBrands[brandId] = brand;
          }
        }
        setBrands((prevBrands) => ({ ...prevBrands, ...fetchedBrands }));
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    if (products.length > 0) {
      fetchBrands();
    }
  }, [products]);

  const fetchBrandName = async (id: string) => {
    try {
      const response = await brandsApi.getBrandId(id);

      setBrandName(response.name || 'Thương hiệu');
    } catch (error) {
      console.error('Error fetching category name:', error);
      setBrandName('Thương hiệu');
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductsByBrandId(id);
      fetchBrandName(id);
    }
  }, [id, page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (value: string) => {
    if (value.startsWith('price')) {
      setSortBy('price');
    } else if (value.startsWith('name')) {
      setSortBy('name');
    }
    setSortDirection(value.endsWith('_asc') ? 'asc' : 'desc');
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

  const brandOptions = Object.values(brands).map((brand) => ({
    label: brand.name,
    value: brand.id,
  }));

  useEffect(() => {
    if (selectedBrand.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        selectedBrand.includes(product.brandId)
      );
      setFilteredProducts(filtered);
    }
  }, [selectedBrand, products]);

  const handleBrandChange = (checkedValues: string[]) => {
    setSelectedBrand(checkedValues);
  };
  const handleLimitChange = (value: number) => {
    setLimit(value);
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="mx-12 mb-4 flex flex-col">
      <img
        src={BgBrands}
        className="h-[200px] w-full object-cover"
        alt="Brand Background"
      />
      <div className="m-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{brandName}</h1>
        <div className="flex items-center justify-center">
          <h3 className="mr-4 text-base font-semibold">Sắp xếp theo</h3>
          <Select
            style={{ height: 40, width: 200 }}
            value={`${sortBy}_${sortDirection}`}
            onChange={handleSortChange}
            className="rounded-md"
          >
            <Option value="price_asc">Giá tăng dần</Option>
            <Option value="price_desc">Giá giảm dần</Option>
            <Option value="name_asc">Tên A-Z</Option>
            <Option value="name_desc">Tên Z-A</Option>
          </Select>
        </div>
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
            className="flex flex-col font-medium"
            options={brandOptions}
            value={selectedBrand}
            onChange={handleBrandChange}
          />
        </div>

        <div className="w-full pl-12">
          <Row className="flex flex-wrap" gutter={12}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Col
                  className="m-3 flex flex-col items-center justify-center rounded-md bg-white p-4 shadow-md"
                  key={product.id}
                  span={5}
                >
                  {Array.isArray(product.thumbnails) &&
                  product.thumbnails.length > 0 ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-md">
                      <img
                        src={product.thumbnails[0]}
                        alt={product.name}
                        className="absolute h-full w-full rounded-md object-cover transition-opacity duration-300 hover:opacity-0"
                      />

                      <img
                        src={product.thumbnails[1]}
                        alt={`${product.name}-hover`}
                        className="absolute h-full w-full rounded-md object-cover opacity-0 transition-opacity duration-300 hover:opacity-100"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-200">
                      <span>No image</span>
                    </div>
                  )}
                  <div className="mt-3 w-full font-semibold hover:underline">
                    <Link to={`/brand/${product.brandId}`}>
                      <span className="hover:!text-black">
                        {brands[product.brandId]?.name || 'Đang tải...'}
                      </span>
                    </Link>
                  </div>
                  <Link to={`/ProductDetail/${product.id}`}>
                    <button className="truncate-limit-custom w-full hover:!font-bold hover:!text-black">
                      {product.name}
                    </button>
                  </Link>
                  <div className="text-sm font-semibold text-red-600">
                    {product.price.toLocaleString()}đ
                  </div>

                  <div className="flex w-full space-x-1">
                    <div className="mt-1 flex flex-grow items-center justify-center">
                      <Rate
                        className={`mr-1 ${product.sold > 0 ? 'text-yellow-500' : 'text-gray-400'}`}
                        value={product.sold > 0 ? 4.5 : 0}
                        disabled
                        style={{ fontSize: '12px' }}
                      />
                    </div>

                    <div className="flex flex-grow items-center justify-center space-x-1">
                      <div className="text-xs text-slate-600">Đã bán:</div>
                      <div className="text-xs font-semibold text-gray-800">
                        {product.sold}
                      </div>
                    </div>
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
              total={totalPages}
              onChange={handlePageChange}
              showSizeChanger={false}
              onShowSizeChange={(_, size) => handleLimitChange(size)}
              pageSizeOptions={['8', '16', '32', '64']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
