import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import { spawn } from "redux-saga/effects";
import {
  networkEffects,
  networkReducer,
  networkRetryMiddleware,
  NETWORK_SLICE,
} from "./core/network";
import {
  notificationEffects,
  notificationReducer,
  NOTIFICATION_SLICE,
} from "./core/notification";
import { inventoryItemEffects, inventoryItemReducer } from "./inventoryItem";
import { INVENTORY_ITEM_SLICE } from "./inventoryItem/inventoryItemReducer";

const rootReducer = combineReducers({
  [INVENTORY_ITEM_SLICE]: inventoryItemReducer,
  [NETWORK_SLICE]: networkReducer,
  [NOTIFICATION_SLICE]: notificationReducer,
});

function* rootSaga() {
  yield spawn(inventoryItemEffects);
  yield spawn(networkEffects);
  yield spawn(notificationEffects);
}

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: [networkRetryMiddleware, sagaMiddleware],
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
