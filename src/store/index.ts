import { configureStore } from '@reduxjs/toolkit';
import cycleReducer from './slices/cycleSlice';
import userReducer from './slices/userSlice';
import recommendationsReducer from './slices/recommendationsSlice';
import symptomsReducer from './slices/symptomsSlice';

export const store = configureStore({
  reducer: {
    cycle: cycleReducer,
    user: userReducer,
    recommendations: recommendationsReducer,
    symptoms: symptomsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
