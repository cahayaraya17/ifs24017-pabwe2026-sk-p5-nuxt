import { customFetch, getBaseUrl, getAccessToken } from '../../../helpers/apiHelper'

export interface UserItem {
  id: string | number
  name: string
  email: string
  username?: string
  bio?: string
  photo?: string
  created_at?: string
}

export interface UserResponse<T = any> {
  status: string
  message: string
  data?: T
}

export interface UpdateProfilePayload {
  name: string
  email: string
  bio?: string
}

export interface UpdatePasswordPayload {
  current_password?: string
  old_password?: string
  password: string
  confirm_password?: string
  new_password?: string
  new_password_confirmation?: string
}

export async function getUsersApi(): Promise<UserResponse<any>> {
  return customFetch<UserResponse<any>>('/users')
}

export async function getProfileApi(): Promise<UserResponse<any>> {
  return customFetch<UserResponse<any>>('/users/me')
}

export async function updateProfileApi(payload: UpdateProfilePayload): Promise<UserResponse<any>> {
  const body: Record<string, string> = {
    name: payload.name.trim(),
    email: payload.email.trim(),
  }
  if (payload.bio !== undefined) {
    body.bio = payload.bio.trim()
  }

  return customFetch<UserResponse<any>>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function uploadPhotoApi(formData: FormData): Promise<UserResponse<any>> {
  const token = getAccessToken()
  const baseUrl = getBaseUrl()
  
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = 'Bearer ' + token
  }

  const res = await fetch(baseUrl + '/users/me/photo', {
    method: 'POST',
    headers,
    body: formData,
  })
  return res.json()
}

export async function updatePasswordApi(payload: UpdatePasswordPayload): Promise<UserResponse> {
  const currentPwd = payload.current_password ? payload.current_password : (payload.old_password || '')
  const newPwd = payload.new_password ? payload.new_password : payload.password
  const confirmPwd = payload.new_password_confirmation ? payload.new_password_confirmation : (payload.confirm_password ? payload.confirm_password : newPwd)

  return customFetch<UserResponse>('/users/password', {
    method: 'PUT',
    body: JSON.stringify({
      password: currentPwd,
      new_password: newPwd,
      new_password_confirmation: confirmPwd,
    }),
  })
}