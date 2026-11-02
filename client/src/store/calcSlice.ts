import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
export interface CalcInput { bill: number; dayRatio: number; roof: string; place: string }
export type CalcResult = Record<string, number> & { prices: number[] }
// Redux Thunk (createAsyncThunk)
export const calculate = createAsyncThunk('calc/run', async (input: CalcInput) => {
  const r = await fetch('/api/calc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  return (await r.json()) as CalcResult;
});
const slice = createSlice({
  name: 'calc', initialState: { result: null as CalcResult | null, loading: false },
  reducers: { reset: (s) => { s.result = null; }, setResult: (s, a: PayloadAction<CalcResult>) => { s.result = a.payload; } },
  extraReducers: (b) => b
    .addCase(calculate.pending, (s) => { s.loading = true; })
    .addCase(calculate.fulfilled, (s, a) => { s.loading = false; s.result = a.payload; })
    .addCase(calculate.rejected, (s) => { s.loading = false; }),
});
export const { reset } = slice.actions; export default slice.reducer;
