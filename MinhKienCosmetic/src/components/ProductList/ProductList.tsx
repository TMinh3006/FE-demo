import { useEffect } from 'react';
import { IProductDetail } from '@/Apis/Product/Product.interface';

type ProductListsProps = {
  selectedProductIndex: number;
  products: IProductDetail[];
  handleProcductClick: (product: IProductDetail) => void;
};

const ProductList = ({
  products,
  selectedProductIndex,
  handleProcductClick,
}: ProductListsProps) => {
  const scrollActiveProductIntoView = (index: number) => {
    const activeProduct = document.getElementById(`product-${index}`);
    console.log(`scrollIntoView called for product-${index}`, activeProduct);
    if (activeProduct) {
      activeProduct.scrollIntoView({
        block: 'nearest',
        inline: 'start',
        behavior: 'smooth',
      });
    } else {
      console.log(`Element with id product-${index} not found`);
    }
  };

  useEffect(() => {
    if (selectedProductIndex !== -1) {
      scrollActiveProductIntoView(selectedProductIndex);
    }
  }, [selectedProductIndex]);

  return (
    <div className="resultProductContainer max-h-96 overflow-y-scroll bg-white">
      {products.map((product, index) => (
        <div
          key={product.id}
          id={`product-${index}`}
          className={`${selectedProductIndex === index ? 'bg-gray-200' : ''} flex cursor-pointer items-center justify-between gap-8 px-4 py-2 hover:bg-gray-200`}
          onClick={() => handleProcductClick(product)}
        >
          <img
            src={product.thumbnails?.[0] || '/default-image.jpg'}
            alt={product.name}
            className="w-8"
          />
          <p className="truncate-limit-custom2">{product.name}</p>

          <p>{product.price.toLocaleString()}đ</p>
        </div>
      ))}
    </div>
  );
};
export default ProductList;
