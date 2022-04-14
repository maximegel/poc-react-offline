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

function* watchAdd(request: ReturnType<typeof add>) {
  try {
    yield call(service.add, request.payload);
    yield put(addSuccess({ request }));
  } catch (error) {
    yield put(addFailure({ request, error }));
  }
}

function* watchLoadMany(request: ReturnType<typeof loadMany>) {
  try {
    const response: InventoryItemEntity[] = yield call(service.list);
    yield put(loadManySuccess({ request }, response));
  } catch (error) {
    yield put(loadManyFailure({ request, error }));
  }
}

function* watchRemove(request: ReturnType<typeof remove>) {
  try {
    yield call(service.remove, request.payload);
    yield put(removeSuccess({ request }));
  } catch (error) {
    yield put(removeFailure({ request, error }));
  }
}
