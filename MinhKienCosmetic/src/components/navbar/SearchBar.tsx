import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Input } from 'antd';
import type { GetProps } from 'antd';
import ProductList from '@/components/ProductList/ProductList';
import productApi from '@/Apis/Product/Product.api';
import { IProduct } from '@/Apis/Product/Product.interface';
import { useNavigate } from 'react-router-dom';

type SearchProps = GetProps<typeof Input.Search>;

function SearchBar() {
  const { Search } = Input;
  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [searchResults, setSearchResult] = useState<IProduct[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(-1);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const response = await productApi.getProducts(0, 80);
      setProducts(response);
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

  function handleProcductClick(product: IProduct) {
    navigate(`/productDetail/${product.id}`);
    setQuery('');
    setSelectedProductIndex(-1);
    setSearchResult([]);
  }

  return (
    <div className="mx-4 w-full max-w-3xl">
      <Search
        allowClear
        onSearch={onSearch}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
        }}
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        value={query}
        placeholder="Tìm kiếm sản phẩm..."
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
    </div>
  );
}

export default SearchBar;
