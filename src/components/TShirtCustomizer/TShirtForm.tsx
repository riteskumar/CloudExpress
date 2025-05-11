import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from './ThemeContext';

interface FormInputs {
  height: number;
  weight: number;
  build: string;
  text: string;
  color: string;
}

const TShirtForm: React.FC = () => {
  const { theme } = useTheme();
  const { register, watch, setValue, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      height: 180,
      weight: 80,
      build: 'athletic',
      text: '',
      color: 'white'
    }
  });

  const customText = watch('text');
  const lineCount = customText?.split('\n').length || 0;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'q') {
        // Theme switching logic will be handled in the parent component
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const themeStyles = {
    minimal: 'bg-white text-gray-800',
    modern: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    retro: 'bg-gray-900 text-white'
  };

  return (
    <div className={`p-4 rounded-lg ${themeStyles[theme]}`}>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block mb-2">Height (cm)</label>
          <input
            type="number"
            {...register('height')}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Weight (kg)</label>
          <input
            type="number"
            {...register('weight')}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Build</label>
          <select
            {...register('build')}
            className="w-full p-2 border rounded"
          >
            <option value="lean">Lean</option>
            <option value="regular">Regular</option>
            <option value="athletic">Athletic</option>
            <option value="big">Big</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Custom Text (max 3 lines) - {lineCount}/3 lines
          </label>
          <textarea
            {...register('text', {
              validate: {
                maxLines: (value) =>
                  value.split('\n').length <= 3 || 'Maximum 3 lines allowed'
              }
            })}
            maxLength={200}
            rows={3}
            className={`w-full p-2 border rounded ${
              errors.text ? 'border-red-500' : ''
            }`}
            placeholder="Enter your custom text here..."
            onChange={(e) => {
              const lines = e.target.value.split('\n');
              if (lines.length > 3) {
                setValue('text', lines.slice(0, 3).join('\n'));
              }
            }}
          />
          {errors.text && (
            <span className="text-red-500 text-sm mt-1">
              {errors.text.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TShirtForm;