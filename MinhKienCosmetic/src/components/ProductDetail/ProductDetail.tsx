import React from 'react';
import Gallary from './Gallary';
import Productinfo from './Productinfo';
import Brand1 from '@/assets/skinAqua.png';
import Brand2 from '@/assets/3-CE.png';
import Brand3 from '@/assets/BIO-ESSENCE.jpg';
import Brand4 from '@/assets/BOM.png';
import Brand5 from '@/assets/SIMPLE.jpg';

const ProductDetail: React.FC = () => {
  const images = [Brand1, Brand2, Brand3, Brand4, Brand5];
  return (
    <div className="flex flex-col gap-20 p-6 pt-24">
      <section className="flex gap-16 px-8 py-0">
        <div>
          <Gallary images={images} />
        </div>
        <div>
          <Productinfo id={'kfj24'} title="Product title" price={25} />
        </div>
      </section>
      <section>
        <div>mô tả</div>
      </section>
    </div>
  );
};

export default ProductDetail;
