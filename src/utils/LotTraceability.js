export const tableConfig = {
  机: ["非稳态时间"],
  物料: ["辅料信息", "配方出库单"],
  加工要求: ["工艺参数标准", "加工工艺技术要求", "配方单"],
  环境温湿度: ["环境温湿度趋势"],
  过程测量: ["过程质量", "质检信息", "报警信息", "装箱密度", "叶复烤过程趋势"],
};

export const workingProcess = [
  { value: "1", label: "高架库出库" },
  { value: "2", label: "翻箱喂料" },
  { value: "3", label: "一润" },
  { value: "4", label: "二润" },
  { value: "5", label: "打叶" },
  { value: "6", label: "叶加酶" },
  { value: "7", label: "碎片复烤" },
  { value: "8", label: "烟梗复烤" },
  { value: "9", label: "叶复烤" },
  { value: "10", label: "叶打包" },
  { value: "11", label: "碎片打包" },
  { value: "12", label: "烟梗打包" },
];

export const columns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 45,
  },
  {
    title: "批次",
    dataIndex: "pici",
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
    title: "生产牌号",
    dataIndex: "number",
    width: "auto",
    align: "center",
  },
  {
    title: "工段",
    dataIndex: "gongduan",
    width: "100",
    align: "center",
  },
  {
    title: "平价点",
    dataIndex: "evaluate",
    width: "auto",
    align: "center",
  },
  {
    title: "内容",
    dataIndex: "content",
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
];
const dataItem = {
  pici: "2023044-202311-5-119yr",
  banci: "白班",
  evaluate: "二润出口烟叶含水率",
  content: "gi得分:0.00，低于下限分:75.0",
  weituofang: "上海烟草集团有限责任公司",
  number: "福建三明尤溪ELC1CB1A-2023片烟",
  gongduan: "二润",
  startTime: "2023-10-16 16:22:11",
  endTime: "2023-10-16 18:22:11",
};
export const data = [];
for (let index = 0; index < 20; index++) {
  const d = JSON.parse(JSON.stringify(dataItem));
  d["index"] = index + 1;
  data.push(d);
}

const status = [
  "高架库出库",
  "翻箱喂料",
  "一润",
  "二润",
  "打叶",
  "叶加酶",
  "碎片复烤",
  "叶复烤",
  "烟梗复烤",
  "烟梗打包",
  "叶打包",
  "碎片打包",
];
const temp = {
  key: "打叶",
  status: "完成",
  principal: "福建中烟工业有限责任公司",
  trademark: "福建三明尤溪ELC1CB1A-2023片烟",
  team: "丙班",
  shift: "白班",
  start: "2023-10-25 09:33:30",
  end: "2023-10-25 10:33:30",
  score: "98.12",
};
const step = ["停机", "未生产", "生产", "完成", "料头", "料尾"];
export const statusData = [];
let index = 0;
status.forEach((element) => {
  const t = JSON.parse(JSON.stringify(temp));
  t["key"] = element;
  t["status"] = step[index % 6];
  index++;
  statusData.push(t);
});
