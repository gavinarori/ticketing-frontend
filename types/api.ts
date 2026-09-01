// types/api.ts

/** Every failed API call normalizes to this shape, regardless of transport. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(params: { status: number; code: string; message: string; details?: unknown }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  /** True for anything worth showing "seat no longer available, pick another" style copy for. */
  get isConflict() {
    return this.status === 409;
  }
}

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
};
