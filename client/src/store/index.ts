import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import visits from './visits'; import calc from './calcSlice'; import auth from './authSlice'; import ui from './uiSlice'; import content from './contentSlice'; import lead from './leadSlice'; import rootSaga from './sagas';
const saga = createSagaMiddleware();
export const store = configureStore({ reducer: { calc, lead, visits, content, auth, ui }, middleware: (g) => g({ thunk: true }).concat(saga) });
saga.run(rootSaga);
export type RootState = ReturnType<typeof store.getState>; export type AppDispatch = typeof store.dispatch;
