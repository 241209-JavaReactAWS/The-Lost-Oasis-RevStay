import React, { useState } from 'react';
import './ImageCarousel.css';

interface ImageCarouselProps {
    images: string[];
    altText?: string;
    variant?: 'table' | 'detail';
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altText = "Image", variant = 'detail' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="carousel-container">
                <div className="no-image">No images available</div>
            </div>
        );
    }

    const goToPrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    return (
        <div className={`carousel-container ${variant}`}>
            <div className="carousel-content">
                <img
                    src={images[currentIndex]}
                    alt={`${altText} ${currentIndex + 1}`}
                    className="carousel-image"
                />

                {images.length > 1 && (
                    <>
                        <button
                            className="carousel-button prev"
                            onClick={goToPrevious}
                            aria-label="Previous image"
                        >
                            &#x2039;
                        </button>
                        <button
                            className="carousel-button next"
                            onClick={goToNext}
                            aria-label="Next image"
                        >
                            &#x203A;
                        </button>

                        <div className="carousel-indicators">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageCarousel;