/**
 * Configures and creates a Redux store with persisted state using Redux Toolkit.
 * @returns {Object} An object containing the Redux store and persistor.
 */
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./RootReducer";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    thunk,
  ],
});

export const persistor = persistStore(store);
