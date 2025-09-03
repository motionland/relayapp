export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: any;
}
