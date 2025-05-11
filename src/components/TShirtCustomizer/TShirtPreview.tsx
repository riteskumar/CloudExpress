import React from 'react';

interface TShirtPreviewProps {
  color: string;
  text: string;
  image?: string;
}

const TShirtPreview: React.FC<TShirtPreviewProps> = ({ color, text, image }) => {
  return (
    <div className="relative w-full aspect-[3/4]">
      {/* T-shirt silhouette - black shape */}
      <div className="absolute inset-0 bg-black" style={{
        clipPath: "polygon(25% 0, 75% 0, 85% 15%, 100% 25%, 90% 100%, 10% 100%, 0 25%, 15% 15%)"
      }}>
        {/* Design area */}
        <div className="absolute inset-0 flex items-center justify-center">
          {image && (
            <img 
              src={image} 
              alt="Custom design"
              className="max-w-[60%] max-h-[80%] object-contain bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TShirtPreview;