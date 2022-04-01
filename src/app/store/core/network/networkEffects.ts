import { AnyAction } from "@reduxjs/toolkit";
import { eventChannel } from "redux-saga";
import { fork, put, race, select, take, takeLeading } from "redux-saga/effects";
import { offline, online, outboxRequests } from "./networkActions";
import { selectOnline } from "./networkSelectors";

export function* networkEffects() {
  yield takeLeading(online.type, watchOnline);
  yield fork(watchNetworkStatus);
  yield fork(watchRequestResults);
}

function* watchOnline() {
  // const request: AnyAction = yield select(selectNextRequest);
  // console.log("retry", request);
}

function* watchNetworkStatus() {
  while (true) {
    const isOnline: boolean = yield take(networkStatusChannel);
    if (isOnline) yield putOnline();
    else yield putOffline();
  }
}

function* watchRequestResults() {
  while (true) {
    const request: AnyAction = yield take(isRequest);
    const { outboxedRequests, failure } = yield race({
      outboxedRequests: take(isOutboxedRequestsOf(request)),
      failure: take(isFailureOf(request)),
      success: take(isSuccessOf(request)),
    });
    if (someFailedOverNetwork(outboxedRequests)) {
      console.log("someFailedOverNetwork => offline");
      yield putOffline();
    } else if (hasFailedOverNetwork(failure)) {
      console.log("hasFailedOverNetwork => offline");
      yield putOffline();
    } else {
      console.log("online");
      yield putOnline();
    }
  }
}

function* putOnline() {
  const isOnline: boolean = yield select(selectOnline);
  if (isOnline) return;
  yield put(online());
}

function* putOffline() {
  const isOnline: boolean = yield select(selectOnline);
  if (!isOnline) return;
  yield put(offline());
}

const networkStatusChannel = eventChannel((emit) => {
  emit(window.navigator.onLine);
  const handleOnline = () => emit(true);
  const handleOffline = () => emit(false);
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
});

const someFailedOverNetwork = (action: ReturnType<typeof outboxRequests>) =>
  action?.payload
    ?.filter(hasTrackedErrors)
    ?.map(lastTrackedError)
    ?.some(isNetowkError);

const hasFailedOverNetwork = (action: AnyAction) =>
  isNetowkError(action?.error);

const isNetowkError = (error: Error) =>
  error?.name === "TypeError" && error?.message === "Failed to fetch";

const hasTrackedErrors = (action: AnyAction) => action.meta?.errors?.length > 0;

const lastTrackedError = (action: AnyAction) =>
  action.meta?.errors[action.meta?.retries ?? 0];

const isRequest = (action: AnyAction) =>
  action.type.toUpperCase().endsWith("REQUEST");

const isOutboxedRequestsOf = (request: AnyAction) => (action: AnyAction) =>
  action.type === outboxRequests.type &&
  action.payload?.every(isInSameTransaction(request));

const isFailureOf = (request: AnyAction) => (action: AnyAction) =>
  isFailure(action) && isInSameTransaction(request)(action);

const isFailure = (action: AnyAction) =>
  action.type.toUpperCase().endsWith("FAILURE") || !!action.error;

const isSuccessOf = (request: AnyAction) => (action: AnyAction) =>
  isSuccess(action) && isInSameTransaction(request)(action);

const isSuccess = (action: AnyAction) =>
  action.type.toUpperCase().endsWith("SUCCESS");

const isInSameTransaction =
  (...otherActions: AnyAction[]) =>
  (action: AnyAction) =>
    otherActions.every(
      (other) => other.meta?.transactionId === action.meta?.transactionId,
    );
