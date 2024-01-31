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

export const getParamsInfo = (batch,factoryid) => {
  return http.get("/report/json?jid=129&factoryid="+factoryid+"&supportNullSelect=true&batch="+batch);
}

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

export const getFactoryTimeSpan = (factoryid) => {
  return http.get("/report/json?jid=290&factoryid="+factoryid);
}

export const getFactoryProduction = (factoryid) => {
  return http.get("/report/json?jid=291&factoryid="+factoryid);
}

export const getTraceabilityDelegate = (datestart,dateend) => {
  return http.get("/report/json?jid=296&datestart="+datestart+"&dateend="+dateend);
}

export const getCurrentDbBatch = () => {
  return http.get("/report/json?jid=200");
}

export const getExceptionSummary = (batch) => {
  return http.get("/report/json?jid=295&batch="+batch);
}

export const getUnsteadyData = (batch) => {
  return http.get("/report/json?jid=297&batch="+batch);
}

export const getAccessoryInfo = (datetime,team) => {
  return http.get("/report/json?jid=301&datetime="+datetime+"&team="+team);
}

export const getBatchInfo = (batch) => {
  return http.get("/report/json?jid=302&batch="+batch);
}

export const getOutStockInfo = (batch) => {
  return http.get("/report/json?jid=303&batch="+batch);
}

export const getProcessParams = (batch) => {
  return http.get("/report/json?jid=304&batch="+batch);
}

export const getProcessTechnology = (batch) => {
  return http.get("/report/json?jid=305&batch="+batch);
}

export const getFormulaSheet = (batch) => {
  return http.get("/report/json?jid=306&batch="+batch);
}

export const getProcessQuality = (batch) => {
  return http.get("/report/json?jid=307&batch="+batch);
}

export const getQualityInformation = (batch) => {
  return http.get("/report/json?jid=308&batch="+batch);
}

export const getAlarmMessage = (batch) => {
  return http.get("/report/json?jid=309&batch="+batch);
}

export const getPackingDensity = (batch) => {
  return http.get("/report/json?jid=310&batch="+batch);
}

export const getBakingTrendingPoint = (batch,boxno) => {
  return http.get("/report/json?jid=221&batch="+batch+"&boxno="+boxno);
}

export const getBakingTrending = (batch,boxno,tag) => {
  return http.get("/report/json?jid=220&batch="+batch+"&boxno="+boxno+"&tag="+tag);
}

export const getTemperatureTrending = (batch,code) => {
  return http.get("/report/json?jid=161&batch="+batch+"&code="+code);
}

export const getBatchByBrandAndFactory = (brandid,factoryid) => {
  return http.get("/report/json?jid=313&brandid="+brandid+"&factoryid="+factoryid);
}

export const delBatchByRowids = (rowids) => {
  return http.post("/systems/formconfig/fcupdate?id=321&ids="+rowids);
}

export const updateBatchOrder = (batch) => {
  return http.post("/systems/formconfig/fcupdate?id=197&batch="+batch);
}

export const calcUnsteadyState = (batch) => {
  return http.post("/systems/formconfig/fcupdate?id=195&batch="+batch);
}