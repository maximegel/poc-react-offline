import { combineReducers, configureStore } from "@reduxjs/toolkit";
import localforage from "localforage";
import { persistReducer, persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import { spawn } from "redux-saga/effects";
import { networkEffects, networkRetryMiddleware } from "./core/network";
import { networkReducer, NETWORK_SLICE } from "./core/network/networkReducer";
import { inventoryItemEffects, inventoryItemReducer } from "./inventoryItem";

const rootReducer = combineReducers({
  inventoryItems: inventoryItemReducer,
  [NETWORK_SLICE]: networkReducer,
});

function* rootSaga() {
  yield spawn(networkEffects);
  yield spawn(inventoryItemEffects);
}

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistReducer(
    { key: "root", storage: localforage, whitelist: [] },
    rootReducer,
  ),
  middleware: [networkRetryMiddleware, sagaMiddleware],
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
