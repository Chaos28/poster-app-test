const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

interface RequestOptions extends RequestInit {
  token?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options
    const method = fetchOptions.method || 'GET'
    const url = `${this.baseUrl}${endpoint}`
    const startTime = performance.now()

    // Логирование запроса
    console.log(`[API Request] ${method} ${url}`)
    if (fetchOptions.body) {
      console.log('[API Request Body]', fetchOptions.body)
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log('[API Request] Using authentication token')
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include', // Important for cookies
      })

      const duration = performance.now() - startTime

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'An error occurred',
        }))

        // Логирование ошибки
        console.error(
          `[API Error] ${method} ${url} - Status: ${response.status} - Duration: ${duration.toFixed(2)}ms`,
          error
        )

        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      // Логирование успешного ответа
      console.log(
        `[API Response] ${method} ${url} - Status: ${response.status} - Duration: ${duration.toFixed(2)}ms`
      )

      const data = await response.json()
      console.log('[API Response Data]', data)

      return data
    } catch (error) {
      const duration = performance.now() - startTime

      // Логирование исключений (сетевые ошибки и т.д.)
      console.error(
        `[API Exception] ${method} ${url} - Duration: ${duration.toFixed(2)}ms`,
        error
      )

      throw error
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
