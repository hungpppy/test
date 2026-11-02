import { useEffect } from 'react'; import { useAppDispatch, useAppSelector } from '../store/hooks'; import { setMode, Mode } from '../store/uiSlice';
const LABEL: Record<Mode, string> = { auto: '🕒 Tự động', light: '☀️ Sáng', dark: '🌙 Tối' };
const NEXT: Record<Mode, Mode> = { auto: 'light', light: 'dark', dark: 'auto' };
export default function ThemeToggle() {
  const mode = useAppSelector((s) => s.ui.mode); const d = useAppDispatch();
  useEffect(() => {
    const apply = () => { const h = new Date().getHours(); const dark = mode === 'dark' || (mode === 'auto' && (h < 6 || h >= 18)); document.documentElement.dataset.theme = dark ? 'dark' : 'light'; };
    apply(); try { localStorage.setItem('halosun-theme', mode); } catch { /* bỏ qua */ }
    const t = setInterval(apply, 60000); return () => clearInterval(t);
  }, [mode]);
  return <button className="theme" onClick={() => d(setMode(NEXT[mode]))} aria-label={`Giao diện: ${LABEL[mode]}. Bấm để đổi`}>{LABEL[mode]}</button>;
}
