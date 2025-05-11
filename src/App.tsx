

import TShirtCustomizer from './components/TShirtCustomizer';
import { ThemeProvider } from './components/TShirtCustomizer/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <TShirtCustomizer />
    </ThemeProvider>
  );
}
