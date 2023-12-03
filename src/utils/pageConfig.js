export const columns = [
  {
    title: "序号",
    dataIndex: "index",
  },
  {
    title: "工段批次",
    dataIndex: "pici",
  },
  {
    title: "班次",
    dataIndex: "banci",
  },
  {
    title: "班组",
    dataIndex: "banzu",
  },
  {
    title: "委托方",
    dataIndex: "weituofang",
  },
  {
    title: "牌号",
    dataIndex: "number",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
  },
  {
    title: "时长",
    dataIndex: "long",
  },
  {
    title: "日期",
    dataIndex: "date",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "出柜号(预混柜)",
    dataIndex: "chugui",
  },
  {
    title: "配方量",
    dataIndex: "peifangliang",
  },
  {
    title: "是否异常",
    dataIndex: "normal",
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
  data.push(dateItem);
}
