import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Input } from 'antd';

import ProductList from '@/components/ProductList/ProductList';
import productApi from '@/Apis/Product/Product.api';
import { IProductDetail } from '@/Apis/Product/Product.interface';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<IProductDetail[]>([]);
  const [searchResults, setSearchResult] = useState<IProductDetail[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(-1);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const response = await productApi.getProducts(0, 1000);
      setProducts(response.result.products);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setSearchResult(
      products.filter((product) =>
        product.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    setSelectedProductIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      setSelectedProductIndex((prevIndex) =>
        prevIndex === -1 ? searchResults.length - 1 : prevIndex - 1
      );
    } else if (event.key === 'ArrowDown') {
      setSelectedProductIndex((prevIndex) =>
        prevIndex === searchResults.length - 1 ? -1 : prevIndex + 1
      );
    } else if (event.key === 'Enter') {
      if (selectedProductIndex !== -1) {
        const selectedProduct = searchResults[selectedProductIndex];
        navigate(`/product/${selectedProduct.id}`);
        setQuery('');
        setSelectedProductIndex(-1);
        setSearchResult([]);
      }
    }
  }

  function handleProcductClick(product: IProductDetail) {
    navigate(`/productDetail/${product.id}`);
    setQuery('');
    setSelectedProductIndex(-1);
    setSearchResult([]);
  }

  return (
    <div className="mx-6 w-full max-w-3xl">
      <Input
        allowClear
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '16px',
          borderRadius: '50px',
          border: '1px solid #ddd',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        value={query}
        placeholder="Tìm kiếm sản phẩm..."
        prefix={<SearchOutlined />}
      />

      {query !== '' && searchResults.length > 0 && (
        <div className="mt-2">
          <ProductList
            products={searchResults}
            selectedProductIndex={selectedProductIndex}
            handleProcductClick={handleProcductClick}
          />
        </div>
      )}

      {query !== '' && searchResults.length === 0 && (
        <div className="mt-2 text-center text-gray-500">
          Không có sản phẩm nào
        </div>
      )}
    </div>
  );
}

export default SearchBar;
