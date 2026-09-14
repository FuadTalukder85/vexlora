/**
 * Standard backend response envelope format matching the multi-vendor backend
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode?: number;
  errorSources?: Array<{
    path: string | number;
    message: string;
  }>;
  stack?: string;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: Array<{ path: string | number; message: string }>;

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: Array<{ path: string | number; message: string }>
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
