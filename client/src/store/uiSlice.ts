import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type Mode = 'auto' | 'light' | 'dark'; // auto: sáng 6h–18h, tối còn lại
const saved = (): Mode => { try { const v = localStorage.getItem('halosun-theme'); return v === 'light' || v === 'dark' ? v : 'auto'; } catch { return 'auto'; } };
const slice = createSlice({ name: 'ui', initialState: { mode: saved() }, reducers: { setMode: (s, a: PayloadAction<Mode>) => { s.mode = a.payload; } } });
export const { setMode } = slice.actions; export default slice.reducer;
