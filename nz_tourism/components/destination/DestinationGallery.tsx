'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryImage {
  url: string;
  alt: string;
}

interface DestinationGalleryProps {
  images: GalleryImage[];
}

const DestinationGallery: React.FC<DestinationGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="gallery-container">
      <div className="gallery-main">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].alt}
          fill
          className="gallery-main-image"
        />
      </div>
      <div className="gallery-thumbnails">
        {images.map((image, index) => (
          <button
            key={index}
            className={`thumbnail-button ${index === selectedImage ? 'active' : ''}`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="thumbnail-image"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default DestinationGallery; 