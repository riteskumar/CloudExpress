import React, { useState, useEffect } from 'react';

interface TShirtPreviewProps {
  color: string;
  text?: string;
  image?: string;
}

const TShirtPreview: React.FC<TShirtPreviewProps> = ({ color, text, image }) => {
  // Available colors for quick switching with Alt+Q
  const availableColors = ['navy', 'white', 'black', 'gray', 'blue', 'red'];
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [displayColor, setDisplayColor] = useState(color.toLowerCase());

  // Map color names to actual t-shirt images
  const tshirtImages: Record<string, string> = {
    'navy': '/assets/images/tshirt-navy.jpg',
    'white': '/assets/images/tshirt-white.jpg',
    'black': '/assets/images/tshirt-black.jpg',
    'gray': '/assets/images/tshirt-grey.jpg',
    'blue': '/assets/images/tshirt-blue.jpg',
    'red': '/assets/images/tshirt-red.jpg',
  };

  // Update display color when prop changes
  useEffect(() => {
    setDisplayColor(color.toLowerCase());
    // Find the index of the current color
    const index = availableColors.findIndex(c => c === color.toLowerCase());
    if (index !== -1) {
      setCurrentColorIndex(index);
    }
  }, [color]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'w') {
        // Cycle through colors
        const nextIndex = (currentColorIndex + 1) % availableColors.length;
        setCurrentColorIndex(nextIndex);
        setDisplayColor(availableColors[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentColorIndex]);

  // Handle Alt+Q key press to switch between colors
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'q') {
        // Cycle through colors
        const nextIndex = (currentColorIndex + 1) % availableColors.length;
        setCurrentColorIndex(nextIndex);
        setDisplayColor(availableColors[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentColorIndex]);

  // Get the correct t-shirt image based on display color
  const tshirtImage = tshirtImages[displayColor] || tshirtImages['navy'];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium mb-4">Preview</h3>

      <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
        {/* Real T-shirt image as base */}
        <img
          src={tshirtImage}
          alt={`${displayColor} t-shirt`}
          className="w-full h-full object-contain"
        />

        {/* Design area - positioned over the t-shirt */}
        <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 w-[50%] h-[40%] flex flex-col items-center justify-center">
          {image && (
            <img
              src={image}
              alt="Custom design"
              className="max-w-full max-h-full object-contain mb-2"
            />
          )}

          {text && (
            <div className="text-center font-medium p-2 max-w-full break-words"
                 style={{ color: displayColor === 'white' ? 'black' : 'white' }}>
              {text.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-500 text-center">
        Press Alt+W to cycle through t-shirt colors
      </div>
    </div>
  );
};

export default TShirtPreview;