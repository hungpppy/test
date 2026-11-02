import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; import { api } from '../utils/api';
export type Role = 'admin' | 'nhan_vien' | 'khach_hang';
export interface User { id: number; name: string; email: string; phone?: string; role: Role }
export const fetchMe = createAsyncThunk('auth/me', async () => (await api<{ user: User | null }>('/api/auth/me').catch(() => ({ user: null }))).user);
export const login = createAsyncThunk('auth/login', async (b: { email: string; password: string; scope?: 'staff' | 'customer' }) => (await api<{ user: User }>('/api/auth/login', 'POST', b)).user);
export const register = createAsyncThunk('auth/register', async (b: { name: string; email: string; phone: string; password: string }) => (await api<{ user: User }>('/api/auth/register', 'POST', b)).user);
export const logout = createAsyncThunk('auth/logout', async () => { await api('/api/auth/logout', 'POST'); });
const slice = createSlice({
  name: 'auth', initialState: { user: null as User | null, ready: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; s.ready = true; }).addCase(fetchMe.rejected, (s) => { s.ready = true; });
    b.addCase(login.fulfilled, (s, a) => { s.user = a.payload; }).addCase(register.fulfilled, (s, a) => { s.user = a.payload; });
    b.addCase(logout.fulfilled, (s) => { s.user = null; });
  },
});
export default slice.reducer;
