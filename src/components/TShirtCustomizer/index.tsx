import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import TShirtForm from "./TShirtForm";
import ImageUploader from "./ImageUploader";
import TShirtPreview from "./TShirtPreview";
import ThreeJsPreview from "./ThreeJsPreview";

interface FormData {
  height: number;
  weight: number;
  build: string;
  text: string;
  tshirtColor: string;
}

const TShirtCustomizer: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    height: 180,
    weight: 80,
    build: "athletic",
    text: "",
    tshirtColor: "navy",
  });

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.altKey && e.key === "q") {
      setIs3DMode(!is3DMode);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [is3DMode]);

  const handleFormChange = (data: Partial<FormData>) => {
    setFormData(data);
  };

  const handleImageUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  return (
    <div className={`theme-${theme} min-h-screen p-6`}>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          POD T-Shirt Customizer
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TShirtForm
              onFormChange={handleFormChange}
              defaultValues={formData}
            />

            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
          <div>
            {is3DMode ? (
              <ThreeJsPreview
                color={formData.tshirtColor || "navy"}
                text={formData.text}
                image={selectedImage || undefined}
              />
            ) : (
              <TShirtPreview
                color={formData.tshirtColor || "navy"}
                text={formData.text}
                image={selectedImage || undefined}
              />
            )
            
            }
            
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default TShirtCustomizer;
