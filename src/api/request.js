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

export const getAnalyzeRendering = (brandid,teamid) => {
  return http.get("/report/json?jid=282&brandid="+brandid+"&teamid="+teamid);
}

export const getDelegate = (datestart,dateend) => {
  return http.get("/report/json?jid=283&datestart="+datestart+"&dateend="+dateend);
}

export const getBrandByDelegate = (datestart,dateend,delegateid) => {
  return http.get("/report/json?jid=284&datestart="+datestart+"&dateend="+dateend+"&delegateid="+delegateid);
}

export const getBrandTeam = (datestart,dateend,delegateid,brandid) => {
  return http.get("/report/json?jid=285&datestart="+datestart+"&dateend="+dateend+"&delegateid="+delegateid+"&brandid="+brandid);
}

export const getBatchInfoList = (factoryid,startdate,enddate,p) => {
  return http.get("/report/output?rid=68&export=flexigridjson&factoryid="+factoryid+"&startdate="+startdate+"&enddate="+enddate+"&status=,1,2,3,4,5,6&batch=&brandname=&boxno=&paging=pagecount&s=20&p="+p);
}

export const getFactoryTimeSpan = (factoryid) =>{
  return http.get("/report/json?jid=290&factoryid="+factoryid);
}

export const getFactoryProduction = (factoryid) =>{
  return http.get("/report/json?jid=291&factoryid="+factoryid);
}