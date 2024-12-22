import apiClient from '@/utils/instanceAxios';

interface RegisterUserRequest {
  firtsName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  gender?: string;
  country: string;
}

interface loginUserRequest {
  email: string;
  password: string;
}

interface updateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  gender: string;
  country?: string;
}

const authApi = {
  registerUser: async (data: RegisterUserRequest) => {
    const res = await apiClient.post('/user/register', data);
    return res.data;
  },

  loginUser: async (data: loginUserRequest) => {
    const res = await apiClient.post('/users/login', data);
    return res.data;
  },
  logoutUser: async () => {
    const res = await apiClient.post("/users/logout")
    return res.data
  },
  getUserProfile: async () => {
    const res = await apiClient.get("/users/profile")
    return res.data
  },
  updateUserProfile: async (data: updateProfileRequest) => {
    const res = await apiClient.put("/users/profile")
    return res.data
  },
  deleteAccountUser: async () => {
    const res = await apiClient.delete("/users")
  }
  //////////////////admin/////////////////////
  deleteUserById: async (userId: string) => {
    const res = await apiClient.delete(`users/${userId}`)
    return res.data
  },
  getUserById: async (userId: string) => {
    const res = await apiClient.get(`/users/${userId}`)
    return res.data
  },
  verifyEmail: async (userId: string) => {
    const res = await apiClient.post(`/users/`)
  }
};
