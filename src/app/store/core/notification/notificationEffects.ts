import { AnyAction } from "@reduxjs/toolkit";
import { put, take } from "redux-saga/effects";
import { show, ShowPayload } from "./notificationActions";

export function* notificationEffects() {
  yield watchNotificationActions();
}

function* watchNotificationActions() {
  while (true) {
    const action: AnyAction = yield take(isNotificationAction);
    const notification: ShowPayload = action.meta.notification;
    yield put(show(notification));
  }
}

const isNotificationAction = (action: AnyAction) => !!action.meta?.notification;
