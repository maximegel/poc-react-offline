import { AnyAction, Middleware } from "@reduxjs/toolkit";
import { outboxRequests } from "./networkActions";
import { NetworkSlice } from "./networkReducer";
import { selectOnline } from "./networkSelectors";

export const networkRetryMiddleware: Middleware = (store) => {
  return getOrTrackRequest((request, action) => {
    if (isFailure(action)) {
      const retries = retriesLeft(store.getState());
      const actionsToRetry = request.actions
        .map(setRetriesLeft(retries))
        .map(trackAttempts())
        .map(trackErrors(action));
      if (noMoreRetries(actionsToRetry)) return request.complete(action);
      return request.retry(actionsToRetry);
    }
    if (isSuccess(action)) return request.complete(action);
    return request.append(action);
  });
};

const retriesLeft = (state: NetworkSlice) => (action: AnyAction) => {
  const count = action.meta?.retries;
  if (isNaN(count)) return undefined;
  if (count <= 0) return 0;
  if (!selectOnline(state)) return count;
  return count - 1;
};

const noMoreRetries = (actions: AnyAction[]) =>
  actions.some((action) => !canRetry(action));

const canRetry = (action: AnyAction) => !(action.meta?.retries <= 0);

const setRetriesLeft = (fn: (action: AnyAction) => number) =>
  setMeta((action) => ({ retries: fn(action) }));

const trackAttempts = () =>
  setMeta((action) => ({ attempts: (action.meta?.attempts ?? 0) + 1 }));

const trackErrors = (failure: AnyAction) =>
  setMeta((action) => ({
    errors: [...(action.meta?.errors ?? []), failure.error],
  }));

const setMeta =
  (fn: (action: AnyAction) => Record<string, unknown>) =>
  (action: AnyAction) => ({
    ...action,
    meta: { ...(action.meta ?? {}), ...fn(action) },
  });

const isFailure = (action: AnyAction) =>
  action.type.toUpperCase().endsWith("FAILURE") || !!action.error;

const isSuccess = (action: AnyAction) =>
  action.type.toUpperCase().endsWith("SUCCESS");

const getOrTrackRequest =
  (fn: (operations: RequestBehavior, action: AnyAction) => AnyAction) =>
  (next: (action: AnyAction) => AnyAction) => {
    const requests: RequestMap = {};
    return (action: AnyAction) => {
      const requestId = action.meta?.requestId;
      if (!requestId) return next(action);
      const actions = requests[requestId] ?? [];
      const operations: RequestBehavior = {
        actions,
        retry: (actionsToRetry) => {
          return operations.complete(outboxRequests(actionsToRetry));
        },
        complete: (act) => {
          delete requests[requestId];
          return next(act);
        },
        append: (act) => {
          requests[requestId] = [...actions, action];
          return next(act);
        },
      };
      return fn(operations, action);
    };
  };

interface RequestBehavior {
  actions: AnyAction[];
  retry: (actionsToRetry: AnyAction[]) => AnyAction;
  complete: (action: AnyAction) => AnyAction;
  append: (action: AnyAction) => AnyAction;
}
type RequestMap = Record<string, Request>;
type Request = AnyAction[];
