export function logout(navigate) {
  localStorage.removeItem("token");
  navigate("/admin/login");
}
