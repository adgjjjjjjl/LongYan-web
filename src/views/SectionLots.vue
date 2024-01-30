<template>
  <main>
    <div class="top-header">
      <div>
        <button
          v-for="title in topTitles"
          :key="title"
          :class="[
            'button-base',
            selectedTitle === title ? 'button-selected' : 'button-unselect',
          ]"
          @click="onClickTitle(title)"
        >
          {{ title }}
        </button>
      </div>
    </div>
    <div class="page-bottom">
      <div class="chart-box">
        <div class="chart-contain">
          <div id="chartTimer" style="height: 100%"></div>
          <div class="chart-title">工段时长</div>
        </div>
        <div class="chart-contain">
          <div id="chartTrans" style="height: 100%"></div>
          <div class="chart-title">工段产量</div>
        </div>
      </div>
      <div class="table-contain">
        <div class="table-title">{{selectedTitle}}批次列表</div>
        <div>
          <button
            v-for="title in operations"
            :key="title"
            :class="[
              'operate-base',
              operate === title ? 'operate-selected' : 'operate-unselect',
            ]"
            @click="onClickOperate(title)"
          >
            {{ title }}
          </button>
        </div>
        <div class="table-block">
          <a-table
            :row-selection="rowSelection"
            :columns="columns"
            :data-source="data"
            :pagination="false"
            :scroll="{ x: 1560, y: 435 }"
            :row-class-name="
              (_record, index) =>
                _record.is_error == '正常' ? 'cell-normal' : 'cell-abnormal'
            "
          >
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'f_batch'||column.dataIndex === 'is_error'">
                <a @click="handleTitle(column.dataIndex,record)" style="text-decoration: underline;" :class="record.is_error == '正常' ? 'cell-normal' : 'cell-abnormal'">{{ text }}</a>
              </template>
              <div class="base-cell" v-else>
                {{ text }}
              </div>
            </template>
          </a-table>
        </div>
        <a-pagination
          v-model:current="paginationConfig.current"
          v-model:page-size="paginationConfig.pageSize"
          :total="paginationConfig.total"
          showQuickJumper
          size="small"
          :locale="locale"
          class="pagination"
          :showSizeChanger="false"
          :show-total="(total) => `共 ${paginationConfig.total} 条`"
          @change="handlePageChange"
        />
      </div>
    </div>
    <a-modal
      v-model:visible="visible"
      title=""
      :width="modalWidth"
      :height="modalHeight"
      @ok="handleOk"
      wrapClassName="full-modal"
      ok-text="确认"
      cancel-text="取消"
    >
      <iframe
        v-if="visible"
        id="modalframe"
        :src="url"
        scrolling="auto"
        frameborder="no"
        width="100%"
        :height="modalHeight"
      />
    </a-modal>
  </main>
</template>

<script setup>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { ref, onMounted, reactive, computed } from "vue";
import { columns } from "@/utils/pageConfig.js";
import { getBatchInfoList,getFactoryTimeSpan,getFactoryProduction,delBatchByRowids,updateBatchOrder,calcUnsteadyState } from '../api/request';

let url = ref("");
const visible = ref(false);
let modalWidth = ref("90%");
let modalHeight = ref("80%");

const dateFormat = "YYYYMMDD";
let echart = echarts;
let currentDate = new Date();
let sevenDaysAgo = new Date();
sevenDaysAgo.setDate(currentDate.getDate() - 3);
let dateStart = ref(dayjs(sevenDaysAgo));
let dateEnd = ref(dayjs(currentDate));
let data = ref([]);

const topTitles = [
  "高架库出库",
  "翻箱喂料",
  "一润",
  "二润",
  "打叶",
  "叶加酶",
  "叶复烤",
  "叶打包",
  "碎片复烤",
  "碎片打包",
  "烟梗复烤",
  "烟梗打包"
];
const topTitlesMapping = { 
  "高架库出库":53,
  "翻箱喂料":5,
  "一润":6, 
  "二润":7, 
  "打叶":8, 
  "叶加酶":9, 
  "叶复烤":10, 
  "叶打包":11,
  "碎片复烤":14,
  "碎片打包":15,
  "烟梗复烤":12,
  "烟梗打包":13
};
let selectedTitle = ref("一润");
const operations = [
  "新增",
  "编辑",
  "删除",
  "结束批次",
  "修改时间(联动)",
  "批次排序",
  "计算非稳态",
  "查看历史QI趋势",
];
let operate = ref("删除");
let rowids = [];
let rows = [];

const state = reactive({
  selectedRowKeys: [],
  // Check here to configure the default column
  loading: false,
});
const hasSelected = computed(() => state.selectedRowKeys.length > 0);
const onSelectChange = (selectedRowKeys) => {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
};

const handleTitle = (title,record)=>{
  console.log(record);
  if(title == "f_batch"){
    modalWidth.value = "100%";
    modalHeight.value = "1000px";
    showModal("./index.html#/tracebility?batch="+record.f_batch);
  }
  if(title == "is_error"){
    modalWidth.value = "1280px";
    modalHeight.value = "800px";
    showModal("../systems/formconfig/listeditor.jsp?xformIdx=196&rid=16&showToolbar=false&showTitle=true&queryType=report&closecswindow=false&batch="+record.f_batch);
  }
}

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
    rowids = selectedRowKeys;
    rows = selectedRows;
  },
  // getCheckboxProps: (record) => ({
  //   disabled: record.name === "Disabled User",
  //   // Column configuration not to be checked
  //   name: record.name,
  // }),
};
const paginationConfig = reactive({
  total: 80, // 总条数
  pageSize: 20, // 每页条数
  current: 1, // 当前页数
});
const locale = {
  jump_to: "前往",
  jump_to_confirm: "确定",
  page: "页",
};

onMounted(() => {
  setTimeout(() => {
    initCharts();
    loadChartData();
    loadBatchInfoData();
  }, 200);
  window.onresize = () =>
    (() => {
      reloadCharts();
    })();
});

const loadBatchInfoData = () => {
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  getBatchInfoList(topTitlesMapping[selectedTitle.value],dateStartStr,dateEndStr,paginationConfig.current).then(res=>{
    data.value.length = 0;
    let batchInfoData = [];
    if(typeof res.data == "string"){
      batchInfoData = eval("("+res.data+")");
    }
    else{
      batchInfoData = res.data;
    }
    paginationConfig.total = batchInfoData.total;
    paginationConfig.current = batchInfoData.page;
    for(var i=0;i<batchInfoData.rows.length;i++){
      batchInfoData.rows[i].cell["index"] = i+1;
      batchInfoData.rows[i].cell["key"] = batchInfoData.rows[i].f_id;
      batchInfoData.rows[i].cell["fact_starttime"] = batchInfoData.rows[i].cell["f_fact_starttime"] == null ? "" : dayjs(batchInfoData.rows[i].cell["f_fact_starttime"]).format("YYYY-MM-DD HH:mm:ss");
      batchInfoData.rows[i].cell["fact_endtime"] = batchInfoData.rows[i].cell["f_fact_endtime"] == null ? "" : dayjs(batchInfoData.rows[i].cell["f_fact_endtime"]).format("YYYY-MM-DD HH:mm:ss");
      batchInfoData.rows[i].cell["is_error"] = batchInfoData.rows[i].cell["f_is_error"] == '1' ? "异常" : "正常";
      data.value.push(batchInfoData.rows[i].cell);
    }
  });
}

const loadChartData = () => {
  loadFactoryTimeSpanData();
  loadFactoryProductionData();
}

function loadFactoryTimeSpanData() {
  Timerption["xAxis"]["data"].length = 0;
  Timerption["series"][0]["data"].length =0;
  getFactoryTimeSpan(topTitlesMapping[selectedTitle.value]).then(res=>{
    //console.log(res.data);
    let data =[];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    //console.log(data);
    for(var i=0;i<data.length;i++){
      Timerption["xAxis"]["data"].push(data[i].x);
      Timerption["series"][0]["data"].push(data[i].y);
    }
    chartTimer.setOption(Timerption);
  });
}

function loadFactoryProductionData(){
  TransOption["xAxis"]["data"].length = 0;
  TransOption["series"][0]["data"].length =0;
  getFactoryProduction(topTitlesMapping[selectedTitle.value]).then(res=>{
    //console.log(res.data);
    let data =[];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    //console.log(data);
    for(var i=0;i<data.length;i++){
      TransOption["xAxis"]["data"].push(data[i].x);
      TransOption["series"][0]["data"].push(data[i].y);
    }
    chartTrans.setOption(TransOption);
  });
}

const reloadCharts = () => {
  const chartTimer = echart.init(document.getElementById("chartTimer"));
  const chartTrans = echart.init(document.getElementById("chartTrans"));
  chartTrans.resize();
  chartTimer.resize();
};

const onClickTitle = (title) => {
  selectedTitle.value = title;
  console.log(selectedTitle.value);
  loadChartData();
  loadBatchInfoData();
};

function handlePageChange(current) {
  console.log(
    `点击了第 ${current} 页`
  );
  paginationConfig.current = current;
  loadBatchInfoData();
}

const handleChange = (e) => {
  console.log(e);
};

const onClickOperate = (e) => {
  operate.value = e;
  console.log(e);
  toNextPage(e,topTitlesMapping[selectedTitle.value],rowids,rows);
};

const onSearch = (e) => {
  console.log(e);
  loadChartData();
  loadBatchInfoData();
};

const dateChange = (date, dateString) => {
  console.log(dateString);
};

const TransOption = {
    // dataZoom: [
    //   {
    //     type: "inside", // 类型为滑动条
    //     xAxisIndex: 0, // 表示这个 dataZoom 组件控制 x 轴
    //     start: 0, // 起始位置为0（最左侧）
    //     end: 160, // 结束位置为60（最右侧）
    //   },
    // ],
    xAxis: {
      // boundaryGap: false,
      boundaryGap: ["5%", "5%"],
      type: "category",
      axisTick: { inside: true },
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          color: "#4471A4",
        },
      },
      axisLabel: {
        formatter: function (value) {
          // 在需要换行的地方添加\n
          return value.split("*").join("\n");
        },
        fontSize: 9,
      },
      data: [],
    },
    yAxis: {
      type: "value",
      splitNumber: 10,
      axisLabel: {
        formatter: "{value}",
        color: "#93DCFE",
        fontSize: 11,
      },
      // 刻度设置
      axisTick: {
        show: false, // 是否显示刻度
        alignWithLabel: true,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#4471A4",
        },
      },
      splitLine: { lineStyle: { color: "#8EEEFF10" } },
    },
    grid: {
      // 整体表格布局
      left: 10,
      top: 80,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
    title: {
      text: "单位（kg或箱）",
      left: "10",
      top: "46",
      textStyle: {
        fontSize: 12,
        color: "#369CCB",
      },
    },
    series: [
      {
        data: [],
        type: "line",
        smooth: false,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 8,
        label: {
          position: "top",
          show: true,
          color: "#93DCFE",
          fontSize: 12,
        },
        lineStyle: {
          width: 1,
          color: "#93DCFE",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#0176826a" },
            { offset: 1, color: "#01768200" },
          ]),
        },
        itemStyle: {
          color: "#04112C",
          borderColor: "#71D9EB", //拐点边框颜色
          borderWidth: 1, //拐点边框大小
          opacity: 0.9
        },
      },
    ],
  };

const Timerption = JSON.parse(JSON.stringify(TransOption));
Timerption.title.text = "单位（分钟）";
Timerption.yAxis.min = 0;
Timerption.yAxis.max = 100;
Timerption.series[0].label.formatter = function(value,index){
  return minutesToTimeString(parseInt(value.data));
};

var chartTimer = null;
var chartTrans = null;

const initCharts = () => {
  // 基于准备好的dom，初始化echarts实例
  chartTimer = echart.init(document.getElementById("chartTimer"));
  chartTrans = echart.init(document.getElementById("chartTrans"));
  chartTimer.setOption(Timerption);
  chartTrans.setOption(TransOption);
};

function minutesToTimeString(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

const toNextPage = (operate,factoryid,rowids,rows) => {
  if(operate == "新增"){
    modalWidth.value = "400px";
    modalHeight.value = "380px";
    showModal("../systems/formconfig/formeditor.jsp?xwidthx=400&xheightx=380&xtitlex=%E6%89%B9%E6%AC%A1&showLoading=true&reportname=%E5%8F%B6%E6%89%93%E5%8C%85%E6%89%B9%E6%AC%A1%E5%88%97%E8%A1%A8&factoryid="+factoryid+"&xformIdx=107&rid=68&showToolbar=true&supportSelect=true&dialog=true&hidecolumn=cntrno%2Coutno%2Cf_cntr_no_cyg%2Cf_out_no_cyg%2Cf_out_no%2Cf_mode%2Ccaseno_sp1%2Ccasenonum_sp1%2Ccaseno_sp2%2Ccasenonum_sp2%2Ccaseno_cg%2Ccasenonum_cg%2Cf_formula2%2Cf_weight%2Cyujishichang%2Cyujitime%2Cyujisum%2Csumvalue&datereadyonly=true&showTitle=false&closecswindow=false");
  }
  else if(operate == "编辑"){
    if(rowids.length == 0){
      alert("请勾选要编辑的记录");
      return;
    }
    if(rowids.length > 1){
      alert("不能同时编辑多条记录，请只勾选当前要编辑的那条记录");
      return;
    }
    modalWidth.value = "400px";
    modalHeight.value = "380px";
    showModal("../systems/formconfig/formeditor.jsp?xwidthx=400&xheightx=380&xtitlex=%E6%89%B9%E6%AC%A1&showLoading=true&reportname=%E4%BA%8C%E6%B6%A6%E6%89%B9%E6%AC%A1%E5%88%97%E8%A1%A8&factoryid="+factoryid+"&xformIdx=107&rid=68&showToolbar=true&supportSelect=true&dialog=true&hidecolumn=outno%2Ccntrno%2Cf_out_no_cyg%2Cf_out_no%2Cf_mode%2Ccaseno%2Ccasenonum%2Ccaseno_sp1%2Ccasenonum_sp1%2Ccaseno_sp2%2Ccasenonum_sp2%2Ccaseno_cg%2Ccasenonum_cg%2Cyujishichang%2Cyujitime&_=1706528740192&datereadyonly=true&boxno=&showTitle=false&id="+rowids+"&closecswindow=false")
  }
  else if(operate == "删除"){
    if(rowids.length == 0){
      alert("请勾选要删除的记录");
      return;
    }
    delBatchByRowids(rowids).then(res=>{
      let data1 = {};
      if(typeof res.data == "string"){
        data1 = eval("("+res.data+")");
      }
      else{
        data1 = res.data;
      }

      if(data1.success){
        onSearch(data1.msg);
      }
      alert(data1.msg);
    });
  }else if(operate == "结束批次"){
    if(rowids.length == 0){
      alert("请勾选要结束的记录");
      return;
    }
    if(rowids.length > 1){
      alert("不能同时结束多条记录，请只勾选当前要结束的那条记录");
      return;
    }
    if(rows[0].f_status != 1){
      alert("只能对生产的数据进行操作");
      return;
    }
    modalWidth.value = "400px";
    modalHeight.value = "380px";
    showModal("../systems/formconfig/formeditor.jsp?xformIdx=190&id="+rowids);
  }
  else if(operate == "修改时间(联动)"){
    if(rowids.length == 0){
      alert("请勾选要修改的记录");
      return;
    }
    if(rowids.length > 1){
      alert("不能同时修改多条记录，请只勾选当前要修改的那条记录");
      return;
    }
    modalWidth.value = "400px";
    modalHeight.value = "380px";
    showModal("../systems/formconfig/formeditor.jsp?xformIdx=194&id="+rowids);
  }
  else if(operate == "批次排序"){
    if(rowids.length == 0){
      alert("请勾选要排序的记录");
      return;
    }
    if(rowids.length > 1){
      alert("不能同时排序多条记录，请只勾选当前要排序的那条记录");
      return;
    }
    updateBatchOrder(rows[0].f_batch).then(res=>{
      let data1 = {};
      if(typeof res.data == "string"){
        data1 = eval("("+res.data+")");
      }
      else{
        data1 = res.data;
      }

      if(data1.success){
        alert("批次排序成功");
        onSearch(data1.msg);
      }
      else{
        alert(data.msg);
      }
    });
  }
  else if(operate == "计算非稳态"){
    if(rowids.length == 0){
      alert("请勾选要计算的记录");
      return;
    }
    if(rowids.length > 1){
      alert("不能同时计算多条记录，请只勾选当前要计算的那条记录");
      return;
    }
    calcUnsteadyState(rows[0].f_batch).then(res=>{
      let data1 = {};
      if(typeof res.data == "string"){
        data1 = eval("("+res.data+")");
      }
      else{
        data1 = res.data;
      }

      if(data1.success){
        alert("计算非稳态成功");
        onSearch(data1.msg);
      }
      else{
        alert(data.msg);
      }
    });
  }
  else if(operate == "查看历史QI趋势"){
    if(rowids.length == 0){
      alert("请勾选要查看的记录");
      return;
    }
    if(rowids.length > 1){
      alert("不能同时查看多条记录，请只勾选当前要查看的那条记录");
      return;
    }
    modalWidth.value = "1280px";
    modalHeight.value = "1000px";
    showModal("../systems/formconfig/listeditor.jsp?xformIdx=210&rid=16&showToolbar=false&showTitle=true&queryType=report&batch="+rows[0].f_batch+"&factoryid="+factoryid);
  }
};

const showModal = (type) => {
  console.log(type);
  url.value = type;
  visible.value = true;
};

const handleOk = (e) => {
  console.log(e);
  visible.value = false;
};

</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  height: 100vh;

  .page-bottom {
    display: flex;

    .table-contain {
      position: relative;
      width: calc(100% - 440px);
      max-height: 620px;
      background-color: #072554;
      margin: 20px 20px 0 0;
      padding: 0 20px;

      &::-webkit-scrollbar {
        display: none;
      }
      .table-title {
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        padding: 0 30px;
        margin-top: 15px;
        background: 0 45% / 20px 10px no-repeat url("icon-rects.png");
      }
      .operate-base {
        padding: 2px 15px;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        border: none;
        margin: 10px 15px 15px 0;
        cursor: pointer;
      }
      .operate-selected {
        background-color: #b96b1f;
      }
      .operate-unselect {
        background-color: #0346d9;
      }
      .table-block {
        height: 470px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .pagination {
        position: absolute;
        bottom: 15px;
        right: 20px;
      }
    }
  }
  .chart-box {
    height: 660px;
    padding: 0 20px;
    margin: 10px 0px 0 20px;
    .chart-contain {
      width: 360px;
      height: 305px;
      margin-top: 10px;
      background: 0 0 / 100% 100% no-repeat url("@/assets/chart-bg.png");
      background-color: #5684bc10;
      position: relative;

      .chart-title {
        font-size: 14px;
        font-weight: bold;
        color: #ffffff;
        position: absolute;
        top: 4px;
        left: 50px;
      }
    }
  }

  .top-header {
    background: center center / 100% 100% no-repeat
      url("@/assets/top-bg-qi.png");
    height: 100px;
    width: 100%;
    padding: 0 70px;
    display: flex;
    align-items: center;
    overflow: hidden;
    > div {
      overflow-x: auto;
      display: flex;
      align-items: center;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .button-base {
      border: none;
      width: 120px;
      text-align: center;
      line-height: 30px;
      height: 30px;
      cursor: pointer;
      flex-shrink: 0;
      font-size: 15px;
    }
    .button-unselect {
      color: #3383c8;
      background: center center / 100% 100% no-repeat
        url("@/assets/icon-diamond.png");
    }
    .button-selected {
      color: #fff;

      background: center center / 100% 100% no-repeat
        url("@/assets/icon-diamond-s.png");
    }
  }
}

//table表头样式
:deep(.ant-table-thead) {
  > tr {
    > th {
      padding: 5px 10px;
      background: #014090;
      border-bottom: 3px solid #072554;
      color: #d0e4fe;
    }
  }
}
// table 行样式
//   .ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover
:deep(.ant-table-tbody) {
  > tr {
    &.ant-table-row-selected {
      > td {
        background: #072554; // 选中行效果
      }
    }
    &.ant-table-row:hover {
      > td {
        background: #072554; // 行hover效果
      }
    }
    > td {
      border-bottom: 3px solid #072554;
      border-top: 3px solid #072554;
      transition: background 0.3s;
      padding: 5px 10px;
      font-size: 11px;
      &.ant-table-cell-row-hover {
        background: #072554; // 行hover效果
      }
    }
  }
}
// table翻页器选中样式
:deep(.ant-pagination) {
  .ant-pagination-total-text {
    font-size: 12px;
    color: #417aa8;
  }
  .ant-pagination-options-quick-jumper {
    font-size: 12px;
    color: #417aa8;
    > input {
      background-color: transparent;
      border: 1px solid #417aa8;
      color: #417aa8;
      width: 38px !important;
    }
  }
  .ant-pagination-item {
    background: transparent;
    background-color: transparent;
    border: 1px solid #417aa8;
    > a {
      color: #417aa8;
    }
  }
  .ant-pagination-item-active {
    background: #b96b1f !important;
    border: none !important;
    > a {
      color: #fff !important;
    }
  }
  // 下一页 上一页 选中样式
  .ant-pagination-jump-next,
  .ant-pagination-prev,
  .ant-pagination-next {
    .ant-pagination-item-link {
      border: 1px solid #417aa8;
      background-color: transparent;
      color: #417aa8;
    }
  }
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>

<style lang="scss">
.cell-normal {
  background-color: #002d70;
  margin: 3px 0;
  color: white;
}

.cell-abnormal {
  background-color: #002d70;
  margin: 3px 0;
  color: red;
  padding: 5px 0;
}
</style>
