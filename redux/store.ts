import { configureStore } from '@reduxjs/toolkit';
import { articleApi } from './api/articleApi';
import { autoDealershipApi } from './api/autoDealershipApi';
import { faqApi } from './api/faqApi';
import { careerApi } from './api/careerApi';
import { howItWorksApi } from './api/howItWorksApi';

export const store = configureStore({
  reducer: {
    [articleApi.reducerPath]: articleApi.reducer,
    [autoDealershipApi.reducerPath]: autoDealershipApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [careerApi.reducerPath]: careerApi.reducer,
    [howItWorksApi.reducerPath]: howItWorksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(articleApi.middleware)
  .concat(autoDealershipApi.middleware)
  .concat(faqApi.middleware)
  .concat(careerApi.middleware)
  .concat(howItWorksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;