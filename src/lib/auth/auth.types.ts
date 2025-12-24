export interface SendCodeResponse {
  result: {
    message: string
    timer: number
  } | null
  status: string
}

export interface ValidateCodeResponse {
  result: {
    access_token: string
    expires_in: number
    token_type: string
    refresh_token: string
  } | null
  success: boolean
  error: any | null
  unauthorizedRequest: boolean
  __wrapped: boolean
  __traceId: string
}

export interface User {
  id?: string
  mobile: string
  firstName?: string
  lastName?: string
}

export interface AuthState {
  token: string | null
  user: User | null
}
