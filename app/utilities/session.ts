import AuthService from "@/app/services/authService";
import Cookies from "js-cookie";

export function getUser() {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}

export function getUserId() {
  const user = getUser();
  return user ? user.id : null;
}
export function getRoleName() {
  const user = getUser();
  return user ? user.roleName : null;
}

export async function logout() {
  try {
    await AuthService.logout();
  } catch (error) {
    console.error("Error durante el logout:", error);
  } finally {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    Cookies.remove("user");
    Cookies.remove("token");
    sessionStorage.clear();
    window.location.href = "/";
  }
}
