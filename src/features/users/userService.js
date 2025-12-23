import axios from "axios";

// API base URL is now hardcoded in each function below

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
  return await axios.post(`https://api.cloudandroots.com/api/users/login`, {
    email,
    password,
  });
};

export const registerUser = async (username, email, password) => {
  return await axios.post(`https://api.cloudandroots.com/api/users/register`, {
    username,
    email,
    password,
  });
};

export const verifyOTP = async (otp) => {
  const email = localStorage.getItem("registerEmail");
  return await axios.post(
    `https://api.cloudandroots.com/api/users/verify-otp`,
    { email, otp }
  );
};

export const resendOTP = async () => {
  const email = localStorage.getItem("registerEmail");
  return await axios.post(
    `https://api.cloudandroots.com/api/users/resend-otp`,
    { email }
  );
};

export const forgotPassword = async (email) => {
  return await axios.post(
    `https://api.cloudandroots.com/api/users/forgot-password`,
    { email }
  );
};

export const resetPassword = async (email, otp, newPassword) => {
  return await axios.post(
    `https://api.cloudandroots.com/api/users/reset-password`,
    {
      email,
      otp,
      newPassword,
    }
  );
};

export const getAuthUser = async () => {
  return await axios.get(`https://api.cloudandroots.com/api/users/me`);
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
    `https://api.cloudandroots.com/api/users/upload-profile-picture`,
    formData,
    config
  );
  console.log("Upload response:", response.data);
  return response;
};

// Create admin (superadmin only)
export const createAdmin = async (username, email, password) => {
  return await axios.post(
    `https://api.cloudandroots.com/api/users/create-admin`,
    {
      username,
      email,
      password,
    }
  );
};

// Update user permissions (superadmin only)
export const updateUserPermissions = async (id, permittedPages) => {
  return await axios.put(
    `https://api.cloudandroots.com/api/users/users/${id}/permissions`,
    {
      permittedPages,
    }
  );
};

// Get all users (superadmin only)
export const getAllUsers = async () => {
  return await axios.get(`https://api.cloudandroots.com/api/users/`);
};
