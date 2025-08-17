import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/auth/login";
//     }
//     return Promise.reject(error);
//   }
// );

// Auth API functions
export const authAPI = {
  register: (userData: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => api.post("/auth/register-user", userData),

  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login-user", credentials),

  logout: () => api.post("/auth/logout"),
};

// Content API functions
export const contentAPI = {
  // Tech Stack
  getTechStack: () => api.get("/techstack/get-all-tech"),
  createTech: (data: FormData) =>
    api.post("/techstack", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateTech: (id: string, data: FormData) =>
    api.patch(`/techstack/update-tech/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteTech: (id: string) => api.delete(`/techstack/delete-tech/${id}`),

  // Skills
  getSkills: () => api.get("/skills/get-all-skills"),
  createSkill: (data: FormData) =>
    api.post("/skills", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateSkill: (id: string, data: FormData) =>
    api.patch(`/skills/update-skill/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteSkill: (id: string) => api.delete(`/skills/delete-skill/${id}`),

  // Projects
  getProjects: () => api.get("/projects/get-all-projects"),
  getProject: (id: string) => api.get(`/projects/get-project/${id}`),
  createProject: (data: any) => api.post("/projects", data),
  updateProject: (id: string, data: any) =>
    api.patch(`/projects/update-project/${id}`, data),
  deleteProject: (id: string) => api.delete(`/projects/delete-project/${id}`),



  // Experience
  getExperiences: () => api.get("/experience/get-all-experiences"),
  getExperienceById: (id: string) =>
    api.get(`/experience/get-experience-by-id/${id}`),
  createExperience: (data: FormData) =>
    api.post("/experience", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateExperience: (id: string, data: FormData) =>
    api.patch(`/experience/update-experience/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteExperience: (id: string) =>
    api.delete(`/experience/delete-experience/${id}`),

  // Contact Queries
  createContactQuery: (data: {
    name: string;
    phone_number: string;
    message: string;
  }) => api.post("/contact-queries", data),
  getContactQueries: () => api.get("/contact-queries/get-all-contact-queries"),
  getRecentContactQueries: () =>
    api.get("/contact-queries/get-recent-contact-queries"),
  updateContactQuery: (id: string, data: any) =>
    api.patch(`/contact-queries/update-contact-query/${id}`, data),
  deleteContactQuery: (id: string) =>
    api.delete(`/contact-queries/delete-contact-query/${id}`),
};

export const profileAPI = {
  getProfile: () => api.get("/profile/get-profile"),
  getProfileById: (id: string) => api.get(`/profile/get-profile-by-id/${id}`),
  createProfile: (data: any) =>
    api.post("/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateProfile: (id: string, data: any) =>
    api.patch(`/profile/update-profile/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProfile: (id: string) => api.delete(`/profile/delete-profile/${id}`),
};
