'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';

interface GalleryImage {
  url: string;
  alt: string;
}

interface DestinationGalleryProps {
  images: GalleryImage[];
}

const DestinationGallery: React.FC<DestinationGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleNext = useCallback(() => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handlePrevious = useCallback(() => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxOpen) {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'Escape') setLightboxOpen(false);
    }
  }, [lightboxOpen, handleNext, handlePrevious]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="gallery-container">
      <div 
        className="gallery-main"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          className="gallery-main-image"
        />
        <div className="gallery-overlay">
          <div className="gallery-zoom-hint">
            <svg className="zoom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            <span>点击放大</span>
          </div>
        </div>
        <button className="gallery-nav-button prev-button" onClick={(e) => { e.stopPropagation(); handlePrevious(); }}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="gallery-nav-button next-button" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
              sizes="100px"
              className="thumbnail-image"
            />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-container">
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].alt}
                fill
                priority
                sizes="100vw"
                className="lightbox-image"
              />
            </div>
            <button className="lightbox-nav-button prev-button" onClick={handlePrevious}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="lightbox-nav-button next-button" onClick={handleNext}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="lightbox-caption">
              <p>{images[selectedImage].alt}</p>
              <span className="lightbox-counter">
                {selectedImage + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationGallery; 