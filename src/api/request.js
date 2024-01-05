import { http } from "./http";

export const userRegiste = ({ username, password, cn_name, email }) => {
  return http.post("/api/user/registe", { username, password, cn_name, email });
};

export const getFactoryInfo = (factoryid) => {
  return http.get("/report/json?jid=246&factoryid="+factoryid);
};

export const getFactoryQI = (batch) => {
  return http.get("/report/json?jid=247&batch="+batch);
};

export const getParamQI = (batch,pointtag) => {
  return http.get("/report/json?jid=281&batch="+batch+"&pointtag="+pointtag);
};
