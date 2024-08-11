import React, { useState } from 'react';

interface GallaryProps {
  images: string[];
}

const Gallary: React.FC<GallaryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState<string>(images[0]);
  console.log(mainImage);
  return (
    <div className="w-[calc(50% - 64%)] mt-5 flex flex-col gap-8">
      <div className="image flex h-[300px] w-[80%] justify-center align-middle">
        <img className="h-full object-cover" src={mainImage} />
      </div>
      <div className="option flex w-[80%] justify-center gap-6">
        {images.map((file, index) => (
          <div
            className="img flex h-[72px] w-[72px] cursor-pointer justify-center border border-solid border-[#f04c9b] align-middle"
            onClick={() => setMainImage(file)}
          >
            <img
              alt={`Thumbnail ${index}`}
              className="h-full w-full object-cover"
              src={file}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallary;
