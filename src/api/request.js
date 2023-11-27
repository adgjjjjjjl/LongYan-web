import { http } from "./http";

export const userRegiste = ({ username, password, cn_name, email }) => {
  return http.post("/api/user/registe", { username, password, cn_name, email });
};
