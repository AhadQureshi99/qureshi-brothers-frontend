import axios from "axios";

export const API_URL = "http://213.199.41.219:3001/api/users";

// Configure axios interceptors
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Request config:", {
      url: config.url,
      token,
      method: config.method,
      headers: config.headers,
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    console.log("Response received:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log("Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};

export const registerUser = async (username, email, password) => {
  return await axios.post(`${API_URL}/register`, { username, email, password });
};

export const verifyOTP = async (otp) => {
  const email = localStorage.getItem("registerEmail");
  return await axios.post(`${API_URL}/verify-otp`, { email, otp });
};

export const resendOTP = async () => {
  const email = localStorage.getItem("registerEmail");
  return await axios.post(`${API_URL}/resend-otp`, { email });
};

export const forgotPassword = async (email) => {
  return await axios.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = async (email, otp, newPassword) => {
  return await axios.post(`${API_URL}/reset-password`, {
    email,
    otp,
    newPassword,
  });
};

export const getAuthUser = async () => {
  return await axios.get(`${API_URL}/me`);
};

export const uploadProfilePicture = async (file) => {
  console.log("Preparing upload with file:", file);
  if (!file) {
    console.log("No file provided for upload");
    throw new Error("No file provided");
  }
  const formData = new FormData();
  formData.append("profilePicture", file);
  console.log("FormData contents before send:");
  for (let pair of formData.entries()) {
    console.log("Entry:", pair[0], pair[1]);
  }
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  const response = await axios.post(
    `${API_URL}/upload-profile-picture`,
    formData,
    config
  );
  console.log("Upload response:", response.data);
  return response;
};

// Create admin (superadmin only)
export const createAdmin = async (username, email, password) => {
  return await axios.post(`${API_URL}/create-admin`, {
    username,
    email,
    password,
  });
};

// Update user permissions (superadmin only)
export const updateUserPermissions = async (id, permittedPages) => {
  return await axios.put(`${API_URL}/users/${id}/permissions`, {
    permittedPages,
  });
};

// Get all users (superadmin only)
export const getAllUsers = async () => {
  return await axios.get(`${API_URL}/`);
};
