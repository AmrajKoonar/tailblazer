import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, ThemeChoice } from '../../context/themeContext';
import './ThemeToggle.css';

const LABELS: Record<ThemeChoice, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, cycleTheme } = useTheme();
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={cycleTheme}
      aria-label={`Theme: ${LABELS[theme]} mode. Activate to change theme.`}
      title={`Theme: ${LABELS[theme]}`}
    >
      <span className="theme-toggle__icon">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -35, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 35, scale: 0.5 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ display: 'inline-flex' }}
          >
            <Icon size={showLabel ? 20 : 18} aria-hidden="true" />
          </motion.span>
        </AnimatePresence>
      </span>
      {showLabel && <span className="theme-toggle__label">{LABELS[theme]}</span>}
    </button>
  );
}

export default ThemeToggle;
