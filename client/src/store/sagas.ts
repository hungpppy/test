import { call, put, takeLatest } from 'redux-saga/effects';
import { submitLead, leadOk, leadFail, Lead } from './leadSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
function* sendLead(action: PayloadAction<Lead>): Generator<any, void, any> {
  try {
    const res: Response = yield call(fetch, '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action.payload) });
    if (!res.ok) { const d = yield call([res, res.json]); throw new Error(d.error); }
    yield put(leadOk());
  } catch (e: any) { yield put(leadFail(e.message)); }
}
export default function* rootSaga() { yield takeLatest(submitLead.type, sendLead); }
