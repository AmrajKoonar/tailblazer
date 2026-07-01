import { ThemeProvider } from './context/ThemeProvider';
import AppRouter from './router/AppRouter';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
