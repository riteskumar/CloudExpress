import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import TShirtForm from './TShirtForm';
import ImageUploader from './ImageUploader';
import TShirtPreview from './TShirtPreview';
import { useForm } from 'react-hook-form';

interface FormData {
  height: number;
  weight: number;
  build: string;
  text: string;
  tshirtColor: string;
}

const TShirtCustomizer: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { watch } = useForm<FormData>({
    defaultValues: {
      height: 180,
      weight: 80,
      build: 'athletic',
      text: '',
      tshirtColor: 'white'
    }
  });

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.altKey && e.key === 'q') {
      setTheme(theme === 'minimal' ? 'retro' : 
               theme === 'retro' ? 'modern' : 'minimal');
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [theme]);

  const themeStyles = {
    minimal: 'bg-gray-50',
    retro: 'bg-gradient-to-r from-purple-100 to-pink-100',
    modern: 'bg-gray-800'
  };

  return (
    <div className={`min-h-screen ${themeStyles[theme]} p-8`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">T-Shirt Customizer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ImageUploader onImageUpload={setSelectedImage} />
            <div className="mt-8">
              <TShirtForm />
            </div>
          </div>
          
          <div className="sticky top-4">
            <TShirtPreview
              color={watch('tshirtColor')}
              text={watch('text')}
              image={selectedImage ? URL.createObjectURL(selectedImage) : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const WrappedTShirtCustomizer: React.FC = () => (
  <ThemeProvider>
    <TShirtCustomizer />
  </ThemeProvider>
);

export default WrappedTShirtCustomizer;