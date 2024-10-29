export const columns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 50,
  },
  {
    title: "工段批次",
    dataIndex: "f_short_batch",
    width: 100,
    align: "center",
  },
  {
    title: "班次",
    dataIndex: "squadname",
    width: 80,
    align: "center",
  },
  {
    title: "班组",
    dataIndex: "teamname",
    width: 80,
    align: "center",
  },
  {
    title: "委托方",
    dataIndex: "companyname",
    width: 210,
    align: "center",
  },
  {
    title: "生产牌号",
    dataIndex: "brandname",
    width: 230,
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "fact_starttime",
    width: 180,
    align: "center",
  },
  {
    title: "结束时间",
    dataIndex: "fact_endtime",
    width: 180,
    align: "center",
  },
  {
    title: "时长",
    dataIndex: "shichang",
    width: 80,
  },
  {
    title: "日期",
    dataIndex: "f_product_date",
    width: 100,
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status3",
    width: 60,
    align: "center",
  },
  {
    title: "进柜号(预混柜)",
    dataIndex: "cntrno",
    width: 120,
    align: "center",
  },
  {
    title: "出柜号(预混柜)",
    dataIndex: "outno",
    width: 120,
    align: "center",
  },
  {
    title: "出柜号(贮叶柜)",
    dataIndex: "f_out_no_cyg",
    width: 120,
    align: "center",
  },
  {
    title: "进柜号(贮叶柜)",
    dataIndex: "f_cntr_no_cyg",
    width: 120,
    align: "center",
  },
  {
    title: "配方量",
    dataIndex: "f_formula2",
    width: 100,
    align: "center",
  },
  {
    title: "实际配方量",
    dataIndex: "f_weight",
    width: 100,
    align: "center",
  },
  {
    title: "预计换柜累计量",
    dataIndex: "newyisumvalue",
    width: 140,
    align: "center",
  },
  {
    title: "实际换柜累计量",
    dataIndex: "sumvalue",
    width: 140,
    align: "center",
  },
  {
    title: "箱号",
    dataIndex: "caseno",
    width: 140,
    align: "center",
  },
  {
    title: "箱数",
    dataIndex: "casenonum1",
    width: 100,
    align: "center",
  },
  {
    title: "碎片(1-3mm)箱号",
    dataIndex: "caseno_sp1",
    width: 140,
    align: "center",
  },
  {
    title: "碎片(1-3mm)箱数",
    dataIndex: "casenonum_sp1",
    width: 140,
    align: "center",
  },
  {
    title: "碎片(3-6mm)箱号",
    dataIndex: "caseno_sp2",
    width: 140,
    align: "center",
  },
  {
    title: "碎片(3-6mm)箱数",
    dataIndex: "casenonum_sp2",
    width: 140,
    align: "center",
  },
  {
    title: "长梗箱号",
    dataIndex: "caseno_cg",
    width: 100,
    align: "center",
  },
  {
    title: "长梗箱数",
    dataIndex: "casenonum_cg",
    width: 100,
    align: "center",
  },
  {
    title: "模式",
    dataIndex: "f_mode",
    width: 100,
    align: "center",
  },
  {
    title: "是否异常",
    dataIndex: "is_error",
    width: 100,
    align: "center",
  },
];
// const dateItem = {
//   pici: "2023044-202311-5-119yr",
//   banci: "白班",
//   banzu: "乙组",
//   weituofang: "上海烟草集团有限责任公司",
//   number: "福建PC3",
//   startTime: "2023-10-16 16:22:11",
//   endTime: "2023-10-16 18:22:11",
//   long: "01:10:00",
//   date: "2023-11-21",
//   status: "完成",
//   chugui: "1#",
//   peifangliang: "12024.2",
//   normal: "正常",
// };
// for (let index = 0; index < 50; index++) {
//   const d = JSON.parse(JSON.stringify(dateItem));
//   d["index"] = index + 1;
//   d["key"] = index + 1;
//   data.push(d);
// }

export const columnsMapping = {
  "高架库出库":["cntrno","outno","f_cntr_no_cyg","f_out_no_cyg","f_out_no","f_mode","caseno","casenonum1","f_formula2","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","f_weight","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "翻箱喂料":["outno","f_out_no_cyg","f_out_no","f_mode","f_cntr_no_cyg","f_formula2","caseno","casenonum1","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","f_weight","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "一润":["cntrno","f_out_no_cyg","f_cntr_no_cyg","caseno","f_mode","casenonum1","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","f_weight","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "二润":["outno","cntrno","f_out_no_cyg","f_out_no","f_mode","caseno","casenonum1","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","yujishichang","yujitime"],
  "打叶":["cntrno","outno","f_out_no_cyg","f_out_no","f_formula2","caseno","casenonum1","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","f_weight","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "叶加酶":["cntrno","outno","f_out_no_cyg","f_out_no","f_formula2","caseno","casenonum1","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","f_weight","f_cntr_no_cyg","f_mode","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "叶复烤":["cntrno","outno","f_cntr_no_cyg","f_formula2","caseno","casenonum1","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","f_mode","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "叶打包":["cntrno","outno","f_cntr_no_cyg","f_out_no_cyg","f_out_no","f_mode","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","f_formula2","f_weight","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "碎片复烤":["cntrno","outno","f_cntr_no_cyg","f_out_no_cyg","f_out_no","f_mode","f_formula2","caseno","casenonum1","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","f_weight","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "碎片打包":["cntrno","outno","f_cntr_no_cyg","f_out_no_cyg","f_out_no","f_mode","f_formula2","caseno","casenonum1","caseno_cg","casenonum_cg","f_weight","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "烟梗复烤":["cntrno","outno","f_cntr_no_cyg","f_out_no_cyg","f_out_no","f_mode","f_formula2","caseno","casenonum1","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","caseno_cg","casenonum_cg","f_weight","yujishichang","yujitime","newyisumvalue","sumvalue"],
  "烟梗打包":["cntrno","outno","f_cntr_no_cyg","f_out_no_cyg","f_out_no","f_mode","f_formula2","caseno","casenonum1","caseno_sp1","casenonum_sp1","caseno_sp2","casenonum_sp2","f_weight","yujishichang","yujitime","newyisumvalue","sumvalue"],
}