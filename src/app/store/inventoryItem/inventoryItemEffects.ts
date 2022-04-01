import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  add,
  addFailure,
  addSuccess,
  loadMany,
  loadManyFailure,
  loadManySuccess,
  remove,
  removeFailure,
  removeSuccess,
} from "./inventoryItemActions";
import { InventoryItemEntity } from "./inventoryItemEntity";
import * as service from "./inventoryItemService";

export function* inventoryItemEffects() {
  yield takeEvery(add.type, watchAdd);
  yield takeLatest(loadMany.type, watchLoadMany);
  yield takeEvery(remove.type, watchRemove);
}

function* watchAdd(action: ReturnType<typeof add>) {
  try {
    yield call(service.add, action.payload);
    yield put(addSuccess(action));
  } catch (error) {
    yield put(addFailure({ action, error }));
  }
}

function* watchLoadMany(_: ReturnType<typeof loadMany>) {
  try {
    const response: InventoryItemEntity[] = yield call(service.list);
    yield put(loadManySuccess(response));
  } catch (error) {
    yield put(loadManyFailure());
  }
}

function* watchRemove({ payload }: ReturnType<typeof remove>) {
  try {
    yield call(service.remove, payload);
    yield put(removeSuccess());
  } catch (error) {
    yield put(removeFailure(payload));
  }
}
