import { customFetch } from '../../../helpers/apiHelper'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthApiResponse {
  status: string
  message: string
  data?: {
    token?: string
    user?: {
      id: string | number
      name: string
      email: string
    }
  }
}

export async function postLoginApi(payload: LoginPayload): Promise<AuthApiResponse> {
  return customFetch<AuthApiResponse>('/auth/login', {
    method: 'POST',
    requiresAuth: false,
    body: JSON.stringify(payload),
  })
}

export async function postRegisterApi(payload: RegisterPayload): Promise<AuthApiResponse> {
  return customFetch<AuthApiResponse>('/auth/register', {
    method: 'POST',
    requiresAuth: false,
    body: JSON.stringify(payload),
  })
}