import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export interface Project { id: number; name: string; type: string; location: string; capacity: string; summary: string; image: string; date: string }
export interface NewsItem { slug: string; title: string; summary: string; published_at: string; source?: string; url?: string; body?: string[] }
const get = async <T>(url: string): Promise<T> => {
  const r = await fetch(url); if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Không tải được dữ liệu'); return r.json();
};
// Redux Thunk: tải dự án và tin tức từ API (SQLite)
export const fetchProjects = createAsyncThunk('content/projects', () => get<Project[]>('/api/projects'));
export const fetchNews = createAsyncThunk('content/news', () => get<NewsItem[]>('/api/news'));
export const fetchArticle = createAsyncThunk('content/article', (slug: string) => get<NewsItem>('/api/news/' + slug));
const slice = createSlice({
  name: 'content',
  initialState: { projects: [] as Project[], news: [] as NewsItem[], article: null as NewsItem | null, loading: false, error: '' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProjects.fulfilled, (s, a) => { s.projects = a.payload; });
    b.addCase(fetchNews.fulfilled, (s, a) => { s.news = a.payload; });
    b.addCase(fetchArticle.pending, (s) => { s.loading = true; s.error = ''; s.article = null; });
    b.addCase(fetchArticle.fulfilled, (s, a) => { s.loading = false; s.article = a.payload; });
    b.addCase(fetchArticle.rejected, (s, a) => { s.loading = false; s.error = a.error.message || 'Lỗi'; });
  },
});
export default slice.reducer;
