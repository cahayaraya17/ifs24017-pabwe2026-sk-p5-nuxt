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

export interface UpdatePasswordPayload {
  current_password: string
  password: string
}

export async function getUsersApi(): Promise<UserResponse<UserItem[]>> {
  return customFetch<UserResponse<UserItem[]>>('/users')
}

export async function getProfileApi(): Promise<UserResponse<UserItem>> {
  return customFetch<UserResponse<UserItem>>('/users/me')
}

export async function updateProfileApi(payload: { name: string; bio?: string }): Promise<UserResponse<UserItem>> {
  const body: { name: string; bio?: string } = {
    name: payload.name.trim(),
  }
  if (typeof payload.bio === 'string') {
    body.bio = payload.bio.trim()
  }

  return customFetch<UserResponse<UserItem>>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function uploadPhotoApi(formData: FormData): Promise<UserResponse<{ photo: string }>> {
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
  return customFetch<UserResponse>('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({
      current_password: payload.current_password,
      password: payload.password,
    }),
  })
}