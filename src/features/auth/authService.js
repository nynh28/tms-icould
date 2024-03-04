import * as api from "../../api";

// Login user
const login = async (userData) => {
  const response = await api.login(userData);
  const token = response.headers.authorization
  const refreshToken = response.headers.refreshtoken
  const user = {...response.data, role: 'ROLE_COMPANY'}
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", JSON.stringify(token));
  localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

  return {user, token, refreshToken };
};

const authService = {
  login,
};

export default authService;
