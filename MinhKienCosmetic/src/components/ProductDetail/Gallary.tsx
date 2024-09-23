import React, { useState } from 'react';

interface GallaryProps {
  images: string[];
}

const Gallary: React.FC<GallaryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState<string>(images[0]);

  return (
    <div className="w-[calc(50% - 64%)] mt-5 flex flex-col gap-8">
      <div className="image flex h-[600px] w-[80%] justify-center align-middle">
        <img
          className="h-full rounded-md object-cover"
          src={mainImage}
          alt="Main"
        />
      </div>
      <div className="option flex w-[80%] justify-center gap-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="img mt-[-25px] flex h-[82px] w-[82px] cursor-pointer justify-center border border-solid border-[#f04c9b] align-middle"
            onClick={() => setMainImage(img)}
          >
            <img
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
              src={img}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallary;
