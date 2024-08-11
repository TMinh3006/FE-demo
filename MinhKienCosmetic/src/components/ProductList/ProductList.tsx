import { useEffect } from 'react';

type Product = {
  id: number;
  title: string;
  image: string;
};
type ProductListsProps = {
  selectedProductIndex: number;
  products: Product[];
  handleProcductClick: (product: Product) => void;
};

function ProductList({
  products,
  selectedProductIndex,
  handleProcductClick,
}: ProductListsProps) {
  function scrollActiveProductIntoView(index: number) {
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
  }

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
          <p>{product.title}</p>
          <img src={product.image} alt="" className="w-8" />
        </div>
      ))}
    </div>
  );
}
export default ProductList;
