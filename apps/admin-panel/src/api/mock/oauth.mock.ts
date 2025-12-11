/**
 * Mock OAuth Service
 * CHỈ dùng cho external OAuth providers (Google, GitHub, Microsoft, etc.)
 * KHÔNG dùng cho internal authentication - internal auth phải lấy từ backend API
 */

export interface OAuthUserInfo {
  id: string
  email: string
  name: string
  picture?: string
  provider: 'google' | 'github' | 'microsoft'
}

export interface OAuthTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
}

// Mock Google OAuth
export const mockGoogleOAuth = async (code: string): Promise<OAuthTokenResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simulate token response
  return {
    access_token: `mock_google_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: `mock_google_refresh_${Date.now()}`,
    scope: 'openid email profile',
  }
}

export const mockGoogleUserInfo = async (accessToken: string): Promise<OAuthUserInfo> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    id: `google_${Math.random().toString(36).substr(2, 9)}`,
    email: `user${Math.random().toString(36).substr(2, 5)}@gmail.com`,
    name: `Google User ${Math.random().toString(36).substr(2, 5)}`,
    picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    provider: 'google',
  }
}

// Mock GitHub OAuth
export const mockGitHubOAuth = async (code: string): Promise<OAuthTokenResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    access_token: `mock_github_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: 'user:email',
  }
}

export const mockGitHubUserInfo = async (accessToken: string): Promise<OAuthUserInfo> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    id: `github_${Math.random().toString(36).substr(2, 9)}`,
    email: `user${Math.random().toString(36).substr(2, 5)}@github.com`,
    name: `GitHub User ${Math.random().toString(36).substr(2, 5)}`,
    picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    provider: 'github',
  }
}

// Mock Microsoft OAuth
export const mockMicrosoftOAuth = async (code: string): Promise<OAuthTokenResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    access_token: `mock_microsoft_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: `mock_microsoft_refresh_${Date.now()}`,
    scope: 'openid email profile',
  }
}

export const mockMicrosoftUserInfo = async (accessToken: string): Promise<OAuthUserInfo> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    id: `microsoft_${Math.random().toString(36).substr(2, 9)}`,
    email: `user${Math.random().toString(36).substr(2, 5)}@outlook.com`,
    name: `Microsoft User ${Math.random().toString(36).substr(2, 5)}`,
    picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    provider: 'microsoft',
  }
}

// Main OAuth functions
export const getOAuthToken = async (provider: 'google' | 'github' | 'microsoft', code: string): Promise<OAuthTokenResponse> => {
  switch (provider) {
    case 'google':
      return mockGoogleOAuth(code)
    case 'github':
      return mockGitHubOAuth(code)
    case 'microsoft':
      return mockMicrosoftOAuth(code)
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`)
  }
}

export const getOAuthUserInfo = async (provider: 'google' | 'github' | 'microsoft', accessToken: string): Promise<OAuthUserInfo> => {
  switch (provider) {
    case 'google':
      return mockGoogleUserInfo(accessToken)
    case 'github':
      return mockGitHubUserInfo(accessToken)
    case 'microsoft':
      return mockMicrosoftUserInfo(accessToken)
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`)
  }
}

