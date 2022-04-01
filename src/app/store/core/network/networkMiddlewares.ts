import { AnyAction, Middleware } from "@reduxjs/toolkit";
import { outboxRequests } from "./networkActions";
import { NetworkSlice } from "./networkReducer";
import { selectOnline } from "./networkSelectors";

export const networkRetryMiddleware: Middleware = (store) => {
  return getOrBeginTransaction((transaction, action) => {
    if (isFailure(action)) {
      const attempts = attemptsLeft(store.getState());
      const actionsToRetry = transaction.actions
        .map(setAttemptsLeft(attempts))
        .map(trackRetries())
        .map(trackErrors(action));
      if (noMoreAttempts(actionsToRetry)) return transaction.complete(action);
      return transaction.retry(actionsToRetry);
    }
    if (isSuccess(action)) return transaction.complete(action);
    return transaction.append(action);
  });
};

const attemptsLeft = (state: NetworkSlice) => (action: AnyAction) => {
  const count = action.meta?.attempts;
  if (isNaN(count)) return undefined;
  if (count <= 0) return 0;
  if (!selectOnline(state)) return count;
  return count - 1;
};

const noMoreAttempts = (actions: AnyAction[]) =>
  actions.some((action) => !canAttempt(action));

const canAttempt = (action: AnyAction) => !(action.meta?.attempts <= 0);

const setAttemptsLeft = (fn: (action: AnyAction) => number) =>
  setMeta((action) => ({ attempts: fn(action) }));

const trackRetries = () =>
  setMeta((action) => ({ retries: (action.meta?.retries ?? -1) + 1 }));

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

const getOrBeginTransaction =
  (fn: (operations: TransactionBehavior, action: AnyAction) => AnyAction) =>
  (next: (action: AnyAction) => AnyAction) => {
    const transactions: TransactionMap = {};
    return (action: AnyAction) => {
      const transactionId = action.meta?.transactionId;
      if (!transactionId) return next(action);
      const actions = transactions[transactionId] ?? [];
      const operations: TransactionBehavior = {
        actions,
        retry: (actionsToRetry) => {
          return operations.complete(outboxRequests(actionsToRetry));
        },
        complete: (act) => {
          delete transactions[transactionId];
          return next(act);
        },
        append: (act) => {
          transactions[transactionId] = [...actions, action];
          return next(act);
        },
      };
      return fn(operations, action);
    };
  };

interface TransactionBehavior {
  actions: AnyAction[];
  retry: (actionsToRetry: AnyAction[]) => AnyAction;
  complete: (action: AnyAction) => AnyAction;
  append: (action: AnyAction) => AnyAction;
}
type TransactionMap = Record<string, Transaction>;
type Transaction = AnyAction[];
