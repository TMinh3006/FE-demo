import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from 'antd';
import type { GetProps } from 'antd';
import ProductList from '@/components/ProductList/ProductList';

type SearchProps = GetProps<typeof Input.Search>;
type Product = {
  id: number;
  title: string;
  image: string;
};

function SearchBar() {
  const { Search } = Input;
  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResult] = useState<Product[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('https://fakestoreapi.com/products');
      setProducts(data);
    };
    fetchData();
  }, []);

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setSearchResult(
      products.filter((product) =>
        product.title.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    setSelectedProductIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    console.log(event.key);

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
        alert(`Bạn đã chọn ${selectedProduct.title}`);
        setQuery('');
        setSelectedProductIndex(-1);
        setSearchResult([]);
      }
    }
  }
  function handleProcductClick(product: Product) {
    alert(`You selected ${product.title}`);
    setQuery('');
    setSelectedProductIndex(-1);
    setSearchResult([]);
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col font-sans">
      <Search
        allowClear
        onSearch={onSearch}
        style={{ width: 200, borderRadius: 8 }}
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
