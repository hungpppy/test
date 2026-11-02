import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface Lead { name: string; phone: string; message: string }
const slice = createSlice({
  name: 'lead', initialState: { status: 'idle' as 'idle' | 'sending' | 'ok' | 'error', error: '' },
  reducers: {
    submitLead: (s, _a: PayloadAction<Lead>) => { s.status = 'sending'; s.error = ''; }, // saga lắng nghe action này
    leadOk: (s) => { s.status = 'ok'; },
    leadFail: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload; },
  },
});
export const { submitLead, leadOk, leadFail } = slice.actions; export default slice.reducer;
