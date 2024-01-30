export const columns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 50,
  },
  {
    title: "工段批次",
    dataIndex: "f_batch",
    width: 200,
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
    width: 160,
    align: "center",
  },
  {
    title: "牌号",
    dataIndex: "brandname",
    width: 130,
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "fact_starttime",
    width: 150,
    align: "center",
  },
  {
    title: "结束时间",
    dataIndex: "fact_endtime",
    width: 150,
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
    dataIndex: "statusname",
    width: 60,
    align: "center",
  },
  {
    title: "出柜号(预混柜)",
    dataIndex: "outno",
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
