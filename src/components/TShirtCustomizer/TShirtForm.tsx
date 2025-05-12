import React from 'react';
import { useForm, Controller } from 'react-hook-form';

interface FormData {
  height: number;
  weight: number;
  build: string;
  text: string;
  tshirtColor: string;
}

interface TShirtFormProps {
  onFormChange: (data: Partial<FormData>) => void;
  defaultValues?: Partial<FormData>;
}

const TShirtForm: React.FC<TShirtFormProps> = ({ onFormChange, defaultValues }) => {
  const { control, register, watch } = useForm<FormData>({
    defaultValues: {
      height: 180,
      weight: 80,
      build: 'athletic',
      text: '',
      tshirtColor: 'navy',
      ...defaultValues
    }
  });

  // Watch for changes in the form and notify parent component
  React.useEffect(() => {
    const subscription = watch((value) => {
      onFormChange(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Customize Your T-Shirt</h3>
        
        {/* Textbox-like container for measurements */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center mb-3">
            <label className="w-24 text-sm font-medium">Height:</label>
            <div className="flex-1 relative">
              <Controller
                name="height"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    min="140"
                    max="220"
                  />
                )}
              />
              <span className="absolute right-3 top-2 text-gray-500">cm</span>
            </div>
          </div>
          
          <div className="flex items-center mb-3">
            <label className="w-24 text-sm font-medium">Weight:</label>
            <div className="flex-1 relative">
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    min="40"
                    max="150"
                  />
                )}
              />
              <span className="absolute right-3 top-2 text-gray-500">kg</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-24 text-sm font-medium">Build:</label>
            <select
              {...register('build')}
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="lean">Lean</option>
              <option value="regular">Regular</option>
              <option value="athletic">Athletic</option>
              <option value="big">Big</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">T-Shirt Color</label>
        <select
          {...register('tshirtColor')}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="navy">Navy</option>
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="gray">Gray</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Custom Text (max 3 lines)</label>
        <textarea
          {...register('text')}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          rows={3}
          maxLength={180}
          placeholder="Enter text to print on your t-shirt..."
        />
      </div>
    </div>
  );
};

export default TShirtForm;