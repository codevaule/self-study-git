// Global error handler for the application

// Error types
export enum ErrorType {
  API_ERROR = "API_ERROR",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  STORAGE_ERROR = "STORAGE_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// Error interface
export interface AppError {
  type: ErrorType
  message: string
  originalError?: any
}

// Function to create a standardized error
export function createError(type: ErrorType, message: string, originalError?: any): AppError {
  return {
    type,
    message,
    originalError,
  }
}

// Function to handle API errors
export function handleApiError(error: any): AppError {
  console.error("API Error:", error)

  // Check if it's a quota exceeded error
  if (
    error?.message?.includes("quota") ||
    error?.message?.includes("exceeded") ||
    error?.message?.includes("QUOTA_EXCEEDED")
  ) {
    return createError(ErrorType.QUOTA_EXCEEDED, "API 할당량이 초과되었습니다. 샘플 데이터가 대신 사용됩니다.", error)
  }

  // Check if it's a network error
  if (error?.message?.includes("network") || error instanceof TypeError) {
    return createError(ErrorType.NETWORK_ERROR, "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.", error)
  }

  // Default API error
  return createError(ErrorType.API_ERROR, "API 요청 중 오류가 발생했습니다.", error)
}

// Function to handle storage errors
export function handleStorageError(error: any): AppError {
  console.error("Storage Error:", error)

  // Check if it's a quota exceeded error
  if (
    error?.message?.includes("quota") ||
    error?.message?.includes("exceeded") ||
    error?.name === "QuotaExceededError"
  ) {
    return createError(
      ErrorType.STORAGE_ERROR,
      "저장소 할당량이 초과되었습니다. 일부 데이터를 삭제하고 다시 시도해주세요.",
      error,
    )
  }

  // Default storage error
  return createError(ErrorType.STORAGE_ERROR, "데이터 저장 중 오류가 발생했습니다.", error)
}

// Function to log errors to a monitoring service (placeholder)
export function logError(error: AppError): void {
  // In a real application, this would send the error to a monitoring service
  console.error(`[ERROR LOG] Type: ${error.type}, Message: ${error.message}`, error.originalError)
}

// Function to get user-friendly error message
export function getUserFriendlyErrorMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.QUOTA_EXCEEDED:
      return "API 할당량이 초과되었습니다. 샘플 데이터가 대신 사용됩니다."
    case ErrorType.STORAGE_ERROR:
      return "데이터 저장 공간이 부족합니다. 일부 데이터를 삭제하고 다시 시도해주세요."
    case ErrorType.NETWORK_ERROR:
      return "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요."
    case ErrorType.VALIDATION_ERROR:
      return "입력 데이터가 올바르지 않습니다. 다시 확인해주세요."
    case ErrorType.API_ERROR:
      return "서버 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    default:
      return "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
  }
}

