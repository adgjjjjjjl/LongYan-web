export const tableConfig = {
  机: ["非稳态时间"],
  物料: ["辅料信息", "配方出库单", "原料物理特性"],
  加工要求: ["加工工艺技术要求", "工艺参数标准", "配方单"],
  环境温湿度: ["环境温湿度趋势"],
  过程测量: ["过程质量", "质检信息", "报警信息", "装箱密度", "叶复烤过程趋势"],
};

export const workingProcess = [
  { value: "53", label: "高架库出库" },
  { value: "5", label: "翻箱喂料" },
  { value: "6", label: "一润" },
  { value: "7", label: "二润" },
  { value: "8", label: "打叶" },
  { value: "9", label: "叶加酶" },
  { value: "10", label: "叶复烤" },
  { value: "11", label: "叶打包" },
  { value: "14", label: "碎片复烤" },
  { value: "15", label: "碎片打包" },
  { value: "12", label: "烟梗复烤" },
  { value: "13", label: "烟梗打包" },
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
    dataIndex: "f_batch",
    width: "auto",
    align: "center",
  },
  {
    title: "委托方",
    dataIndex: "companyname",
    width: "auto",
    align: "center",
  },
  {
    title: "生产牌号",
    dataIndex: "brandname",
    width: "auto",
    align: "center",
  },
  {
    title: "工段",
    dataIndex: "factoryname",
    width: 100,
    align: "center",
  },
  {
    title: "评价点",
    dataIndex: "weightname",
    width: "auto",
    align: "center",
  },
  {
    title: "内容",
    dataIndex: "content",
    width: 300,
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "f_starttime",
    width: "auto",
    align: "center",
  },
  {
    title: "结束时间",
    dataIndex: "f_endtime",
    width: "auto",
    align: "center",
  },
];

export const unsteadyDataColumns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 45,
  },
  {
    title: "批次",
    dataIndex: "f_batch",
    width: "auto",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "ftype",
    width: "auto",
    align: "center",
  },
  {
    title: "实际开始时间",
    dataIndex: "fact_starttime",
    width: "auto",
    align: "center",
  },
  {
    title: "实际结束时间",
    dataIndex: "fact_endtime",
    align: "center",
  },
  {
    title: "时长",
    dataIndex: "shichang",
    width: "auto",
    align: "center",
  },
];

export const accessoryInfoColumns = [
  {
    title: "单据编号",
    dataIndex: "f_order_num",
    align: "center",
  },
  {
    title: "仓库",
    dataIndex: "f_warehouse",
    width: "auto",
    align: "center",
  },
  {
    title: "单据时间",
    dataIndex: "order_time",
    width: "auto",
    align: "center",
  },
  {
    title: "班组",
    dataIndex: "f_team",
    width: "auto",
    align: "center",
  },
  {
    title: "件数",
    dataIndex: "f_num",
    width: "auto",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "f_type",
    width: "auto",
    align: "center",
  },
]

export const outStockColumns = [
  {
    title: "生产牌号",
    dataIndex: "cpbrandname",
    align: "center",
  },
  {
    title: "委托方",
    dataIndex: "companyname",
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "f_starttime",
    align: "center",
  },
  {
    title: "结束时间",
    dataIndex: "f_endtime",
    align: "center",
  },
  {
    title: "生产牌号",
    dataIndex: "cpbrandname",
    align: "center",
  },
  {
    title: "箱数",
    dataIndex: "f_number",
    align: "center",
  },
  {
    title: "总重量",
    dataIndex: "f_total_weight",
    align: "center",
  },
  {
    title: "整批平均",
    dataIndex: "f_average",
    align: "center",
  },
  {
    title: "烟碱均值",
    dataIndex: "f_nicotine_avg",
    align: "center",
  },
  {
    title: "变异系数",
    dataIndex: "f_sd",
    align: "center",
  },
  {
    title: "物料名称",
    dataIndex: "f_material_name",
    align: "center",
  },
  {
    title: "明细重量",
    dataIndex: "detailweight",
    align: "center",
  },
  {
    title: "烟碱均值",
    dataIndex: "detailnicotineavg",
    align: "center",
  },
  {
    title: "箱号",
    dataIndex: "f_box_no",
    align: "center",
  },
]

export const processParamsColumns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 45,
  },
  {
    title: "工段",
    dataIndex: "factoryname",
    align: "center",
  },
  {
    title: "工序",
    dataIndex: "processname",
    align: "center",
  },
  {
    title: "生产控制点",
    dataIndex: "f_control_idtext",
    align: "center",
  },
  {
    title: "标准值",
    dataIndex: "stdvalue",
    align: "center",
  },
  {
    title: "标准值上限",
    dataIndex: "stdup",
    align: "center",
  },
  {
    title: "标准值下限",
    dataIndex: "stddown",
    align: "center",
  },
  {
    title: "允差上限",
    dataIndex: "f_allow_up",
    align: "center",
  },
  {
    title: "允差下限",
    dataIndex: "f_allow_down",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "f_remark",
    align: "center",
  },
]

export const processTechnologyColumns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 45,
  },
  {
    title: "工段",
    dataIndex: "f_factory_idtext",
    align: "center",
  },
  {
    title: "工序",
    dataIndex: "f_process_rel_idtext",
    align: "center",
  },
  {
    title: "生产控制点",
    dataIndex: "f_control_idtext",
    align: "center",
  },
  {
    title: "工序",
    dataIndex: "f_process_rel_idtext",
    align: "center",
  },
  {
    title: "计量单位",
    dataIndex: "f_unittext",
    align: "center",
  },
  {
    title: "标准值",
    dataIndex: "stdvalue",
    align: "center",
  },
  {
    title: "标准值下限",
    dataIndex: "stddown",
    align: "center",
  },
  {
    title: "标准值上限",
    dataIndex: "stdup",
    align: "center",
  },
  {
    title: "考核下限",
    dataIndex: "f_examine_down",
    align: "center",
  },
  {
    title: "考核上限",
    dataIndex: "f_examine_up",
    align: "center",
  },
  {
    title: "排序",
    dataIndex: "f_order",
    align: "center",
  },
]

export const formulaSheetColumns =[
  {
    title: "版本号",
    dataIndex: "f_version",
    align: "center",
  },
  {
    title: "生产牌号",
    dataIndex: "brandname",
    align: "center",
  },
  {
    title: "委托方",
    dataIndex: "companyname",
    align: "center",
  },
  {
    title: "柜数",
    dataIndex: "f_containers_num",
    align: "center",
  },
  {
    title: "生产模式",
    dataIndex: "promode",
    align: "center",
  },
  {
    title: "生效日期",
    dataIndex: "startdate",
    align: "center",
  },
  {
    title: "失效日期",
    dataIndex: "enddate",
    align: "center",
  },
  {
    title: "物料名称",
    dataIndex: "bname",
    align: "center",
  },
  {
    title: "数量(担)",
    dataIndex: "bcount",
    align: "center",
  },
  {
    title: "重量(kg)",
    dataIndex: "bweight",
    align: "center",
  },
  {
    title: "比例(%)",
    dataIndex: "bproportion",
    align: "center",
  },
]

export const processQualityColumns=[
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 45,
  },
  {
    title: "批次号",
    dataIndex: "f_batch",
    align: "center",
  },
  {
    title: "生产牌号",
    dataIndex: "f_brand_name",
    align: "center",
  },
  {
    title: "委托方",
    dataIndex: "f_company_name",
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "fact_starttime",
    align: "center",
  },
  {
    title: "结束时间",
    dataIndex: "fact_endtime",
    align: "center",
  },
  {
    title: "评价点",
    dataIndex: "f_name",
    align: "center",
  },
  {
    title: "QI得分",
    dataIndex: "f_score",
    align: "center",
  },
  {
    title: "权重",
    dataIndex: "f_weight",
    align: "center",
  },
]

export const qualityInformationColumns = [
  {
    title: "工单号",
    dataIndex: "f_id",
    align: "center",
  },
  {
    title: "生产单元",
    dataIndex: "f_factory_layout_name",
    align: "center",
  },
  {
    title: "生产牌号",
    dataIndex: "f_brand_name",
    align: "center",
  },
  {
    title: "委托方",
    dataIndex: "f_company_name",
    align: "center",
  },
  {
    title: "批次",
    dataIndex: "f_batch",
    align: "center",
  },
  {
    title: "班次",
    dataIndex: "f_squad",
    align: "center",
  },
  {
    title: "班组",
    dataIndex: "f_team",
    align: "center",
  },
  {
    title: "生产日期",
    dataIndex: "f_record_date",
    align: "center",
  },
  {
    title: "采样时间",
    dataIndex: "f_proc_time",
    align: "center",
  },
  {
    title: "项目",
    dataIndex: "f_project",
    align: "center",
  },
  {
    title: "下限值",
    dataIndex: "f_down",
    align: "center",
  },
  {
    title: "上限值",
    dataIndex: "f_up",
    align: "center",
  },
  {
    title: "检测时间",
    dataIndex: "f_datetime",
    align: "center",
  },
  {
    title: "检测值",
    dataIndex: "f_value",
    align: "center",
  },
]


export const alarmMessageColumns = [
  {
    title: "批次号",
    dataIndex: "f_batch",
    align: "center",
  },
  {
    title: "生产牌号",
    dataIndex: "brandname",
    align: "center",
  },
  {
    title: "评价点",
    dataIndex: "weightname",
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "f_starttime",
    align: "center",
  },
  {
    title: "结束时间",
    dataIndex: "f_fact_endtime",
    align: "center",
  },
  {
    title: "规则",
    dataIndex: "f_title",
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "f_content",
    align: "center",
  },
]

export const packingDensityColumns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 45,
  },
  {
    title: "生产牌号",
    dataIndex: "brandname",
    align: "center",
  },
  {
    title: "委托方",
    dataIndex: "companyname",
    align: "center",
  },
  {
    title: "检测取样时间",
    dataIndex: "f_samplingtime",
    align: "center",
  },
  {
    title: "班组",
    dataIndex: "teamname",
    align: "center",
  },
  {
    title: "班次",
    dataIndex: "squadname",
    align: "center",
  },
  {
    title: "箱号",
    dataIndex: "f_case_no",
    align: "center",
  },
  {
    title: "装箱重量",
    dataIndex: "f_weight",
    align: "center",
  },
  {
    title: "装箱密度",
    dataIndex: "f_density",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "f_createtime",
    align: "center",
  },
  {
    title: "修改时间",
    dataIndex: "f_modifytime",
    align: "center",
  },
  {
    title: "排序",
    dataIndex: "f_order",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "f_remark",
    align: "center",
  },
]

export const rawMaterialColumns =[
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    width: 45,
  },
  {
    title: "委托方",
    dataIndex: "companyname",
    align: "center",
    width: 200,
  },
  {
    title: "生产牌号",
    dataIndex: "brandname",
    align: "center",
    width: 200,
  },
  {
    title: "原始含水率",
    dataIndex: "f_moisturecontent",
    align: "center",
    width: 100,
  },
  {
    title: "原始含梗率",
    dataIndex: "f_stemratio",
    align: "center",
    width: 100,
  },
  {
    title: "单叶重量g",
    dataIndex: "f_leafweight",
    align: "center",
    width: 100,
  },
  {
    title: "单位面积重量(20片)",
    dataIndex: "f_areaweight",
    align: "center",
    width: 200,
  },
  {
    title: "密度g/cm17",
    dataIndex: "f_density",
    align: "center",
    width: 100,
  },
  {
    title: "长度cm",
    dataIndex: "f_length",
    align: "center",
    width: 100,
  },
  {
    title: "'宽度cm",
    dataIndex: "f_width",
    align: "center",
    width: 100,
  },  {
    title: "厚度1cm",
    dataIndex: "f_thickness1",
    align: "center",
    width: 100,
  },  {
    title: "厚度2cm",
    dataIndex: "f_thickness2",
    align: "center",
    width: 100,
  },  {
    title: "梗头宽度mm",
    dataIndex: "f_stemwidth_head",
    align: "center",
    width: 100,
  },  {
    title: "梗中宽度mm",
    dataIndex: "f_stemwidth_middle",
    align: "center",
    width: 100,
  },{
    title: "梗尾宽度mm",
    dataIndex: "f_stemwidth_tail",
    align: "center",
    width: 100,
  },
]
// const dataItem = {
//   pici: "2023044-202311-5-119yr",
//   banci: "白班",
//   evaluate: "二润出口烟叶含水率",
//   content: "gi得分:0.00，低于下限分:75.0",
//   weituofang: "上海烟草集团有限责任公司",
//   number: "福建三明尤溪ELC1CB1A-2023片烟",
//   gongduan: "二润",
//   startTime: "2023-10-16 16:22:11",
//   endTime: "2023-10-16 18:22:11",
// };
// export const data = [];
// for (let index = 0; index < 20; index++) {
//   const d = JSON.parse(JSON.stringify(dataItem));
//   d["index"] = index + 1;
//   data.push(d);
// }

// const status = [
//   "高架库出库",
//   "翻箱喂料",
//   "一润",
//   "二润",
//   "打叶",
//   "叶加酶",
//   "碎片复烤",
//   "叶复烤",
//   "烟梗复烤",
//   "烟梗打包",
//   "叶打包",
//   "碎片打包",
// ];
// const temp = {
//   key: "打叶",
//   status: "完成",
//   principal: "福建中烟工业有限责任公司",
//   trademark: "福建三明尤溪ELC1CB1A-2023片烟",
//   team: "丙班",
//   shift: "白班",
//   start: "2023-10-25 09:33:30",
//   end: "2023-10-25 10:33:30",
//   score: "98.12",
// };
// const step = ["停机", "未生产", "生产", "完成", "料头", "料尾"];
// export const statusData = [];
// let index = 0;
// status.forEach((element) => {
//   const t = JSON.parse(JSON.stringify(temp));
//   t["key"] = element;
//   t["status"] = step[index % 6];
//   index++;
//   statusData.push(t);
// });
