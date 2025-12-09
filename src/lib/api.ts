const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (e) {
          // Response is not JSON
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  // Candidates
  async getCandidates() {
    return this.request('/candidates');
  }

  async getCandidate(id: string) {
    return this.request(`/candidates/${id}`);
  }

  async createCandidate(data: any) {
    return this.request('/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCandidate(id: string, data: any) {
    return this.request(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCandidate(id: string) {
    return this.request(`/candidates/${id}`, { method: 'DELETE' });
  }

  // Interviews
  async getInterviews() {
    return this.request('/interviews');
  }

  async getInterview(id: string) {
    return this.request(`/interviews/${id}`);
  }

  async createInterview(data: any) {
    return this.request('/interviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInterview(id: string, data: any) {
    return this.request(`/interviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInterview(id: string) {
    return this.request(`/interviews/${id}`, { method: 'DELETE' });
  }

  // Employees
  async getEmployees() {
    return this.request('/employees');
  }

  async getEmployee(id: string) {
    return this.request(`/employees/${id}`);
  }

  async createEmployee(data: any) {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: any) {
    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string) {
    return this.request(`/employees/${id}`, { method: 'DELETE' });
  }

  // Onboarding
  async getOnboardingTasks(employeeId?: string) {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return this.request(`/onboarding${query}`);
  }

  async createOnboardingTask(data: any) {
    return this.request('/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOnboardingTask(id: string, data: any) {
    return this.request(`/onboarding/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOnboardingTask(id: string) {
    return this.request(`/onboarding/${id}`, { method: 'DELETE' });
  }

  // Offboarding
  async getOffboardingTasks(employeeId?: string) {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return this.request(`/offboarding${query}`);
  }

  async createOffboardingTask(data: any) {
    return this.request('/offboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOffboardingTask(id: string, data: any) {
    return this.request(`/offboarding/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOffboardingTask(id: string) {
    return this.request(`/offboarding/${id}`, { method: 'DELETE' });
  }

  // Documents
  async getDocuments() {
    return this.request('/documents');
  }

  async createDocument(data: any) {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteDocument(id: string) {
    return this.request(`/documents/${id}`, { method: 'DELETE' });
  }

  async uploadDocument(file: File, type: string, name?: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (name) {
      formData.append('name', name);
    }

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (e) {
          // Response is not JSON
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  async downloadDocument(id: string) {
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}/documents/${id}/download`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      return response.blob();
    } catch (error) {
      console.error('Download Error:', error);
      throw error;
    }
  }

  // Analytics
  async getAnalytics() {
    return this.request('/analytics');
  }
}

export const api = new ApiClient();
