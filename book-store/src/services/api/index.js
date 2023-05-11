import axios from "../../utils/axiosCustomize";

export const callRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callLogin = (username, password) => {
  return axios.post("/api/v1/auth/login", {
    username,
    password,
  });
};

export const callGetAccount = () => {
  return axios.get("/api/v1/auth/account");
};
export const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};

export const callGetUserPaginate = (query) => {
  return axios.get(`/api/v1/user?${query}`);
};
export const callCreateListUsers = (data) => {
  return axios.post(`/api/v1/user/bulk-create`, data);
};
export const callUpdateUser = (formData) => {
  return axios.put(`/api/v1/user`, formData);
};
export const callDeleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
};
export const callGetBookPaginate = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};
export const callGetBookCategory = () => {
  return axios.get(`/api/v1/database/category`);
};
export const callUploadImage = (file, type) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", file);

  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": type,
    },
  });
};
export const callCreateBook = (data) => {
  return axios.post("/api/v1/book", data);
};
export const callUpdateBook = (data, id) => {
  return axios.put(`/api/v1/book/${id}`, data);
};
export const callDeleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`);
};

export const callBookDetailById = (id) => {
  return axios.get(`/api/v1/book/${id}`);
};
export const callPlaceOrder = (data) => {
  return axios.post(`/api/v1/order`, data);
};
export const callViewHistory = () => {
  return axios.get(`/api/v1/history`);
};
export const callChangePassword = (data) => {
  return axios.post(`/api/v1/user/change-password`, data);
};
export const callOrdersPaginate = (query) => {
  return axios.get(`/api/v1/order?${query}`);
};
export const callGetDashBoard = () => {
  return axios.get("/api/v1/database/dashboard");
};
