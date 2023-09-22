/**
 * Configures and creates a Redux store with persisted state using Redux Toolkit.
 * @returns {Object} An object containing the Redux store and persistor.
 */
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./RootReducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistedReducer = persistReducer(
  {
    key: "root",
    blacklist: ["nuggets"],
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
  ],
});

export const persistor = persistStore(store);
