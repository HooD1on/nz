export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
  
  // API 错误类型
  export interface ApiError {
    message: string;
    code?: string;
    details?: any;
  }
  
  // 通用请求状态
  export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';