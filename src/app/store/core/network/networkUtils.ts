/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyAction, createAction, PayloadAction } from "@reduxjs/toolkit";
import { serializeError } from "serialize-error";
import { v4 as uuid } from "uuid";

export function asRequest<PA extends PrepareInitialAction>(prepareAction: PA) {
  return (...args: Parameters<PA>): PreparedBodyActionWithRequestId<PA> => {
    const prepared = prepareAction(...args);
    return {
      ...prepared,
      meta: { ...prepared.meta, requestId: uuid() },
    };
  };
}

export function asSuccessOf<
  C extends ActionCreator,
  PA extends PrepareFinalAction<C>,
>(initialAction: C, prepareAction: PA) {
  return (
    ...[{ request: action }, ...args]: Parameters<PA>
  ): PreparedBodyActionWithRequestId<PA> => {
    const prepared = prepareAction({ request: action }, ...args);
    if (!isRequestAction(action)) throw notARequestError(action);
    return {
      ...prepared,
      meta: { ...prepared.meta, requestId: action.meta.requestId },
    };
  };
}

export function asFailureOf<
  C extends ActionCreator,
  PA extends PrepareFinalAction<C>,
>(initialAction: C, prepareAction: PA) {
  return (
    ...[{ request: action, error }, ...args]: Parameters<PA>
  ): PreparedBodyActionWithRequestId<PA> => {
    const prepared = prepareAction({ request: action, error }, ...args);
    if (!isRequestAction(action)) throw notARequestError(action);
    return {
      ...prepared,
      meta: { ...prepared.meta, requestId: action.meta.requestId },
      error: serializeError(error),
    };
  };
}

export function withPayloadOf<A extends PayloadAction<unknown>>(
  action: A,
): { payload: A["payload"] } {
  return withPayload(action.payload);
}

export function withoutPayload() {
  return { payload: undefined };
}

export function withPayload<P>(payload: P) {
  return { payload };
}

export function withMeta<M extends ActionMeta>(meta: M) {
  return { meta };
}

export function withoutRetries() {
  return withRetries(0);
}

export function withRetries(count = 3) {
  return { retries: count };
}

const isRequestAction = (action: AnyAction): action is RequestAction =>
  "meta" in action && "requestId" in action.meta;

const notARequestError = (action: AnyAction) =>
  new Error(`Action '${action.type}' must be a request action`);

type PrepareInitialAction<
  P = unknown,
  M extends ActionMeta = ActionMeta,
  E extends ActionError = ActionError,
> = PrepareBodyAction<P, M, E>;

type PrepareFinalAction<
  C extends ActionCreator,
  A extends unknown[] = any[],
  P = unknown,
  M extends ActionMeta = ActionMeta,
  E extends ActionError = ActionError,
> = PrepareBodyAction<
  P,
  M,
  E,
  [{ request: ReturnType<C>; error?: ActionError }, ...A]
>;

type PreparedBodyActionWithRequestId<PA extends PrepareBodyAction<unknown>> =
  PreparedBodyAction<PA, { requestId: string }>;

type PreparedBodyAction<
  PA extends PrepareBodyAction<unknown>,
  M extends ActionMeta = ActionMeta,
> = BodyAction<
  ReturnType<PA>["payload"],
  ReturnType<PA>["meta"] & M,
  ReturnType<PA>["error"]
>;

type PrepareBodyAction<
  P,
  M extends ActionMeta = ActionMeta,
  E extends ActionError = ActionError,
  A extends any[] = any[],
> = (...args: A) => BodyAction<P, M, E>;

interface BodyAction<
  P,
  M extends ActionMeta = ActionMeta,
  E extends ActionError = ActionError,
> {
  payload: P;
  meta?: M;
  error?: E;
}

interface RequestAction extends AnyAction {
  meta: {
    requestId: string;
  };
}

type ActionMeta = Record<string, unknown>;
type ActionError = Error | unknown;

type ActionCreator = ReturnType<typeof createAction>;
