export const columns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 65,
  },
  {
    title: "工段批次",
    dataIndex: "pici",
    width: "auto",
    align: "center",
  },
  {
    title: "班次",
    dataIndex: "banci",
    width: "auto",
    align: "center",
  },
  {
    title: "班组",
    dataIndex: "banzu",
    width: "auto",
    align: "center",
  },
  {
    title: "委托方",
    dataIndex: "weituofang",
    width: "auto",
    align: "center",
  },
  {
    title: "牌号",
    dataIndex: "number",
    width: "auto",
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    width: "auto",
    align: "center",
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    width: "auto",
    align: "center",
  },
  {
    title: "时长",
    dataIndex: "long",
    width: "auto",
  },
  {
    title: "日期",
    dataIndex: "date",
    width: "auto",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    width: "auto",
    align: "center",
  },
  {
    title: "出柜号(预混柜)",
    dataIndex: "chugui",
    width: "auto",
    align: "center",
  },
  {
    title: "配方量",
    dataIndex: "peifangliang",
    width: "auto",
    align: "center",
  },
  {
    title: "是否异常",
    dataIndex: "normal",
    width: "auto",
    align: "center",
  },
];
const dateItem = {
  pici: "2023044-202311-5-119yr",
  banci: "白班",
  banzu: "乙组",
  weituofang: "上海烟草集团有限责任公司",
  number: "福建PC3",
  startTime: "2023-10-16 16:22:11",
  endTime: "2023-10-16 18:22:11",
  long: "01:10:00",
  date: "2023-11-21",
  status: "完成",
  chugui: "1#",
  peifangliang: "12024.2",
  normal: true,
};
export const data = [];
for (let index = 0; index < 50; index++) {
  const d = JSON.parse(JSON.stringify(dateItem));
  d["index"] = index + 1;
  data.push(d);
}
