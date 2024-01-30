<template>
  <main>
    <div class="top-header">
      <span>开始日期：</span>
      <a-date-picker
        v-model:value="dateStart"
        :locale="zhCN"
        dropdownClassName="dropdown-custom"
        class="calendar"
        placeholder="开始日期"
        @change="dateChange"
      >
        <template #suffixIcon>
          <div class="calendar-icon" />
        </template>
      </a-date-picker>
      <span>结束日期：</span>
      <a-date-picker
        v-model:value="dateEnd"
        :locale="zhCN"
        dropdownClassName="dropdown-custom"
        class="calendar"
        placeholder="结束日期"
        @change="dateChange"
      >
        <template #suffixIcon>
          <div class="calendar-icon" />
        </template>
      </a-date-picker>
      <span>工段：</span>
      <a-select
        v-model:value="working"
        dropdownClassName="picker"
        style="width: 110px"
        :options="workingProcess"
        @focus="focus"
        @change="handleFactoryChange"
        ><template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <span>委托方：</span>
      <a-select
        show-search
        v-model:value="delegate"
        dropdownClassName="picker"
        style="width: 220px;color: rgb(99, 160, 189);"
        :options="optionsDelegate"
        :filter-option="filterOption"
        @focus="focus"
        @change="handleDelegateChange"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <span>生产牌号：</span>
      <a-select
      show-search
        v-model:value="productNumber"
        dropdownClassName="picker"
        style="width: 220px;color: rgb(99, 160, 189);"
        :options="optionsProd"
        :filter-option="filterOption"
        @focus="focus"
        @change="handleProductNumberChange"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <span>批次号：</span>
      <a-auto-complete v-model:value="batch" :data-source ="batchDataSource" :filter-option="filterOption2" placeholder="" style="color: #63a0bd;width: 220px;background-color: transparent;border: 1px solid #264460;"/>
      <span>箱号：</span>
      <a-input v-model:value="boxId" placeholder=""  style="color: #63a0bd;width: 70px;background-color: transparent;border: 1px solid #264460;"/>
      <!--<button class="search" @click="searchBatch">查批次号</button>-->
      <button class="search" @click="onSearch">查询</button>
    </div>
    <div class="part-block">
      <div>
        <QualityTrace class="woking-steps-block" :data="statusData" @loadData="loadData"/>
        <div class="example">
          <div v-for="item in examples" :key="item" class="example-block">
            <div :style="{ 'background-color': item.color }" />
            <h3>{{ item.text }}</h3>
          </div>
        </div>
      </div>
      <div class="table-contain">
        <div class="icon-left-rects" />
        <div class="icon-right-rects" />
        <div class="table-title">异常汇总</div>
        <div class="table-block">
          <a-table
            :columns="columns"
            :data-source="exceptionSummaryData"
            :pagination="false"
            :scroll="{ x: 'max-content', y: 310 }"
            :row-class-name="'cell-normal'"
          >
            <template #bodyCell="{ column, text, record }">
              <div class="base-cell">
                {{ text }}
              </div>
            </template>
          </a-table>
          <!-- <a-pagination
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
          /> -->
        </div>
      </div>
    </div>
    <div class="part-block">
      <div class="working-infos">
        <button
          v-for="title in bottomButtons"
          :key="title"
          :class="[
            'button-box',
            activateMainStatus === title
              ? 'button-box-selected'
              : 'button-box-unselected',
          ]"
          @click="onClickProcess(title)"
        >
          {{ title }}
        </button>
      </div>
      <div style="width: calc(100% - 130px)">
        <div :class="['table-title', 'table-title-bg']">
          {{ activateMainStatus }}
        </div>
        <div class="table-contain2">
          <div class="icon-left-rects" />
          <div class="icon-right-rects" />
          <div style="margin-top: 20px; padding: 15px">
            <button
              v-for="title in statusButtons"
              :key="title"
              :class="[
                'button-base',
                activateStatus === title
                  ? 'button-selected'
                  : 'button-unselect',
              ]"
              @click="onClickTitle(title)"
            >
              {{ title }}
            </button>
          </div>
          <div class="table-block2">
            <div
              id="temperatureChart"
              v-show="showTemperatureChart"
              :style="{ width: chartWidth, height: '300px' }"
            ></div>
            <a-table
              v-show="!showTemperatureChart"
              :columns="columns2"
              :data-source="data2"
              :pagination="false"
              :scroll="{ x: 'max-content', y: 300 }"
              :row-class-name="'cell-normal'"
            >
              <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'f_num'">
                  <a @click="handleTitle(column.dataIndex,record)" class="base-cell">{{ text }}</a>
                </template>
                <div class="base-cell" v-else>
                  {{ text }}
                </div>
              </template>
            </a-table>
          </div>
        </div>
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
import QualityTrace from "../components/qualityTracebility.vue";
import dayjs from "dayjs";
import { ref, onMounted, reactive, computed } from "vue";
import zhCN from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { useRoute } from "vue-router";

import { 
  getTraceabilityDelegate,
  getBrandByDelegate,
  getCurrentDbBatch,
  getExceptionSummary,
  getUnsteadyData,
  getAccessoryInfo,
  getBatchInfo,
  getOutStockInfo,
  getProcessParams,
  getProcessTechnology,
  getFormulaSheet,
  getProcessQuality,
  getQualityInformation,
  getAlarmMessage,
  getPackingDensity,
  getBakingTrending,
  getBatchByBrandAndFactory
} from '../api/request';

import {
  workingProcess,
  tableConfig,
  columns,
  unsteadyDataColumns,
  accessoryInfoColumns,
  outStockColumns,
  processParamsColumns,
  processTechnologyColumns,
  formulaSheetColumns,
  processQualityColumns,
  qualityInformationColumns,
  alarmMessageColumns,
  packingDensityColumns
} from "@/utils/LotTraceability";

import * as echarts from "echarts";

let url = ref("");
const visible = ref(false);
let modalWidth = ref("90%");
let modalHeight = ref("80%");

let echart = echarts;
const route = useRoute()
const dateFormat = "YYYY-MM-DD";
let currentDate = new Date();
let sevenDaysAgo = new Date();
sevenDaysAgo.setDate(currentDate.getDate() - 7);
let dateStart = ref(dayjs(sevenDaysAgo));
let dateEnd = ref(dayjs(currentDate));
const optionsDelegate = ref([
  {
    value: "",
    label: "",
  }
]);
let delegate = ref("");
let working = ref("11");
const optionsProd = ref([
  {
    value: "",
    label: "",
  },
]);
let productNumber = ref("");
let batch = ref("");
let boxId = ref("");
let exceptionSummaryData = ref([]);
let data2 = ref([]);
let columns2 = ref([]);
let statusData = ref([]);
let productdate = ref("");
let team = ref("");
let starttime = ref("");
let endtime = ref("");
let batchDataSource = ref([])
const examples = [
  { color: "rgb(145, 9, 21)", text: "停机" },
  { color: "rgb(50, 86, 77)", text: "未生产" },
  { color: "rgb(61, 140, 14)", text: "生产" },
  { color: "rgb(135, 78, 15)", text: "完成" },
  { color: "rgb(21, 114, 136)", text: "料头" },
  { color: "rgb(23, 174, 169)", text: "料尾" },
];
// 底部左侧按钮
const bottomButtons = computed(() => Object.keys(tableConfig));
//选中的按钮标题
let activateMainStatus = ref("加工要求");
// 选中的按钮标题对应的子标题
const statusButtons = computed(() => {
  return tableConfig[activateMainStatus.value];
});
const showTemperatureChart = computed(
  () => (activateStatus.value == "环境温湿度趋势" || activateStatus.value == "叶复烤过程趋势")
);
// 选中的子标题
let activateStatus = ref(statusButtons.value[0]);
const paginationConfig = reactive({
  total: 200, // 总条数
  pageSize: 20, // 每页条数
  current: 1, // 当前页数
});
const locale = {
  jump_to: "前往",
  jump_to_confirm: "确定",
  page: "页",
};
let chartWidth = ref(0);
onMounted(() => {
  setTimeout(() => {
    initCharts();
    chartWidth.value = `${
      document.getElementsByClassName("table-title-bg")[0]?.offsetWidth
    }px`;
  }, 200);
  window.onresize = () =>
    (() => {
      reloadCharts();
    })();
  loadToolBarData();
  loadCurrentDbBatch();
});

const loadToolBarData = () => {
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadDelegate(dateStartStr,dateEndStr);
}

const loadDelegate = (dateStartStr,dateEndStr) => {
  optionsDelegate.value.length = 0;
  getTraceabilityDelegate(dateStartStr,dateEndStr).then(res=>{
    if(res.data.length>0){
      for(let i=0;i<res.data.length;i++){
        optionsDelegate.value.push({value:res.data[i].id,label:res.data[i].name});
      }
      delegate.value = optionsDelegate.value[0].value;
      loadBrandDelegate(dateStartStr,dateEndStr,delegate.value);
    }
  });
}

const loadBrandDelegate = (dateStartStr,dateEndStr,delegateid) => {
  optionsProd.value.length = 0;
  getBrandByDelegate(dateStartStr,dateEndStr,delegateid).then(res=>{
      if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          optionsProd.value.push({value:res.data[i].id,label:res.data[i].name});
        }
        productNumber.value = optionsProd.value[0].value;
        loadBatchDataSource();
      }
  });
}

const loadBatchDataSource = () => {
  getBatchByBrandAndFactory(productNumber.value,working.value).then(res=>{
    batchDataSource.value.length = 0;
    if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          batchDataSource.value.push(res.data[i].f_batch);
        }
      }
  });
}

const loadCurrentDbBatch = () => {
  if(route.query.batch){
    batch.value = route.query.batch;
    loadBatchInfoData();
    loadData();
  }
  else{
    getCurrentDbBatch().then(res=>{
      let data =[];
      if(typeof res.data == "string"){
        data = eval("("+res.data+")");
      }
      else{
        data = res.data;
      }
      if(data.length>0){
        batch.value = data[0].f_batch;
        loadBatchInfoData();
        loadData();
      }
    });
  }
}

function loadBatchInfoData(){
  getBatchInfo(batch.value).then(res=>{
    let data =[];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    statusData.value.length = 0;
    if(data.length>0){
      for(let i=0;i<data.length;i++){
          statusData.value.push({
            key: data[i].factoryname,
            status: data[i].status,
            principal: data[i].companyname,
            trademark: data[i].f_name,
            team: data[i].teamname,
            shift: data[i].squadname,
            start: data[i].starttime,
            end: data[i].endtime,
            score: data[i].f_score,
            productdate: data[i].f_product_date,
            batch:data[i].f_batch,
            factoryid:data[i].f_factory_id
          })
          if(data[i].f_batch == batch.value){
            productdate.value = data[i].f_product_date;
            team.value = data[i].teamname;
            starttime.value = data[i].starttime;
            endtime.value = data[i].endtime;
            working.value = data[i].f_factory_id.toString();
          }
      }
    }
  });
}

const handleTitle = (title,record)=>{
  console.log(record);
  if(title == "f_num"){
    modalWidth.value = "1280px";
    modalHeight.value = "600px";
    showModal("../report/view.jsp?rid=130&closecswindow=false&accessoriesid="+record.f_order_num);
  }
}

function handlePageChange(pageInfo) {
  // 判断是否是点击事件
  const { current, pageSize, total } = pageInfo;
  console.log(
    `点击了第 ${current} 页，每页显示 ${pageSize} 条数据, 共${total}条数据`
  );
  paginationConfig.current = current;
}

// 缩放后重新渲染折线图
const reloadCharts = () => {
  var myChart = echart.init(document.getElementById("QAChart"));
  myChart.resize();
};
// 选择器选中事件
const focus = (e) => {
  // console.log(e);
};

const handleFactoryChange = (e) => {
  loadBatchDataSource();
}

// 选择器选项变化事件
const handleDelegateChange = (e) => {
  // console.log(e);
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadBrandDelegate(dateStartStr,dateEndStr,delegate.value);
};

const handleProductNumberChange = (e) => {
  // console.log(e);
  loadBatchDataSource();
};

// 查询批次号
const searchBatch = (e) => {
  // console.log(e);
};
// 查询
const  onSearch = (e) => {
  // console.log(e);
  //为解决loadBatchInfoData异步加载未完成时，加载loadData2时参数错误，重置选项
  activateMainStatus.value = "加工要求";
  activateStatus.value = "加工工艺技术要求";
  loadBatchInfoData();
  loadExceptionSummary();
  loadData2();
};

const filterOption = (input, option) => {
  return (
        option.props.label.indexOf(input) >= 0
  );
}

const filterOption2 = (input, option) => {
  return (
        option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
  );
}

function loadData(itemStatus){
  if(itemStatus){
    batch.value = itemStatus.batch;
    productdate.value = itemStatus.productdate;
    team.value = itemStatus.team;
    starttime.value = itemStatus.starttime;
    endtime.value = itemStatus.endtime;
    working.value = itemStatus.factoryid.toString();
  }
  
  loadExceptionSummary();
  loadData2();
  loadBatchDataSource();
}

function loadExceptionSummary(){
  getExceptionSummary(batch.value).then(res=>{
    exceptionSummaryData.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data[i]["content"] = data[i]["f_content"].replaceAll("<br/>","");
      exceptionSummaryData.value.push(data[i]);
    }
  })
}

function loadUnsteadyData(){
  getUnsteadyData(batch.value).then(res=>{
    columns2.value = unsteadyDataColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data[i]["fact_starttime"] = data[i]["f_fact_starttime"] == null ? "" : dayjs(data[i]["f_fact_starttime"]).format("YYYY-MM-DD HH:mm:ss");
      data[i]["fact_endtime"] = data[i]["f_fact_endtime"] == null ? "" : dayjs(data[i]["f_fact_starttime"]).format("YYYY-MM-DD HH:mm:ss");
      data2.value.push(data[i]);
    }
  })
}

function loadAccessoryInfo(){
  getAccessoryInfo(productdate.value,team.value).then(res=>{
    columns2.value = accessoryInfoColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data[i]["order_time"] = data[i]["f_order_time"] == null ? "" : dayjs(data[i]["f_order_time"]).format("YYYY-MM-DD HH:mm:ss");
      data2.value.push(data[i]);
    }
  });
}

function loadOutStockInfo(){
  getOutStockInfo(batch.value).then(res=>{
    columns2.value = outStockColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data[i]["order_time"] = data[i]["f_order_time"] == null ? "" : dayjs(data[i]["f_order_time"]).format("YYYY-MM-DD HH:mm:ss");
      data2.value.push(data[i]);
    }
  });
}

function loadProcessParams(){
  getProcessParams(batch.value).then(res=>{
    columns2.value = processParamsColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data2.value.push(data[i]);
    }
  });
}

function loadProcessTechnology(){
  getProcessTechnology(batch.value).then(res=>{
    columns2.value = processTechnologyColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data2.value.push(data[i]);
    }
  });
}

function loadFormulaSheet(){
  getFormulaSheet(batch.value).then(res=>{
    columns2.value = formulaSheetColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data2.value.push(data[i]);
    }
  });
}

function loadProcessQuality(){
  getProcessQuality(batch.value).then(res=>{
    columns2.value = processQualityColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data2.value.push(data[i]);
    }
  })
}

function loadQualityInformation(){
  getQualityInformation(batch.value).then(res=>{
    columns2.value = qualityInformationColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data2.value.push(data[i]);
    }
  })
}

function loadAlarmMessage(){
  getAlarmMessage(batch.value).then(res=>{
    columns2.value = alarmMessageColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data2.value.push(data[i]);
    }
  })
}

function loadPackingDensity(){
  getPackingDensity(batch.value).then(res=>{
    columns2.value = packingDensityColumns;
    data2.value.length = 0;
    let data = [];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    for(var i=0;i<data.length;i++){
      data[i]["index"] = i+1;
      data[i]["f_createtime"] = data[i]["f_createtime"] == null ? "" : dayjs(data[i]["f_createtime"]).format("YYYY-MM-DD HH:mm:ss");
      data[i]["f_modifytime"] = data[i]["f_modifytime"] == null ? "" : dayjs(data[i]["f_modifytime"]).format("YYYY-MM-DD HH:mm:ss");
      data2.value.push(data[i]);
    }
  })
}

function loadBakingTrending(){
  getBakingTrending(starttime.value,endtime.value).then(res=>{
    let data=[];
    if(typeof res.data == "string"){
      data = eval("("+res.data+")");
    }
    else{
      data = res.data;
    }
    //console.log(data);
    for(var i=0;i<data.length;i++){
      option["xAxis"]["data"].push(data[i].x);
      option["series"][0]["data"].push(data[i].y);
    }
    refreshCharts();
  })
}


const onClickProcess = (title) => {
  activateMainStatus.value = title;
  activateStatus.value = statusButtons.value[0];
  loadData2();
};

const onClickTitle = (e) => {
  activateStatus.value = e;
  if(e == "环境温湿度趋势" || e == "叶复烤过程趋势"){
    resizeTemperatureChart();
  }
  loadData2();
};

const resizeTemperatureChart = () => {
  const temperatureChart = echart.init(
    document.getElementById("temperatureChart")
  );
  temperatureChart.resize();
};

const loadData2 = () => {
  if(activateStatus.value == "非稳态时间"){
    loadUnsteadyData();
  }
  else if(activateStatus.value == "辅料信息"){
    loadAccessoryInfo();
  }
  else if(activateStatus.value == "配方出库单"){
    loadOutStockInfo();
  }
  else if(activateStatus.value == "工艺参数标准"){
    loadProcessParams();
  }
  else if(activateStatus.value == "加工工艺技术要求"){
    loadProcessTechnology();
  }
  else if(activateStatus.value == "配方单"){
    loadFormulaSheet();
  }
  else if(activateStatus.value == "环境温湿度趋势"){
    loadBakingTrending();
  }
  else if(activateStatus.value == "过程质量"){
    loadProcessQuality();
  }
  else if(activateStatus.value == "质检信息"){
    loadQualityInformation();
  }
  else if(activateStatus.value == "报警信息"){
    loadAlarmMessage();
  }
  else if(activateStatus.value == "装箱密度"){
    loadPackingDensity();
  }
  else if(activateStatus.value == "叶复烤过程趋势"){
    loadBakingTrending();
  }
}

// 时间选择事件
const dateChange = (date, dateString) => {
  console.log(dateString);
  loadToolBarData();
};

var myChart = null;

const option = {
    xAxis: {
      boundaryGap: ["10%", "10%"],
      type: "time",
      axisTick: { inside: true },
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          color: "#4471A4",
        },
      },
      data: [],
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLabel: {
        formatter: "{value} ",
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
      top: 40,
      right: 20,
      bottom: 0,
      containLabel: true,
    },
    title: {
      text: "单位（摄氏度）",
      left: "10",
      top: "0",
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
          opacity: 0.9,
        },
      },
    ],
  };

// 初始化折线图
const initCharts = () => {
  // 基于准备好的dom，初始化echarts实例
  myChart = echart.init(document.getElementById("temperatureChart"));
  myChart.setOption(option);
  console.log("chart");
};

const refreshCharts = ()=>{
  myChart.setOption(option);
  console.log("refreshCharts");
}

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
  overflow-y: auto;
  background-color: transparent;
  height: 100vh;

  &::-webkit-scrollbar {
    display: none;
  }

  .part-block {
    padding: 20px;
    margin: 15px 30px;
    display: flex;
    align-items: flex-start;
    background: #04112c;
    border: 1px solid #497ba0;

    .working-infos {
      position: relative;
      width: 120px;
      flex-shrink: 0;
      padding: 0 15px;
      margin-right: 20px;
      background: transparent;
      .button-box-selected {
        background-image: url("/basic-info-pending.png");
        color: #fff3e6;
      }
      .button-box-unselected {
        background-image: url("/basic-info-deal.png");
        color: #1afcff;
      }
      .button-box {
        background-position: 0 14px;
        background-repeat: no-repeat;
        background-size: contain;
        text-align: center;
        font-size: 16px;
        width: 100px;
        font-weight: bold;
        height: 75px;
        cursor: pointer;
        background-color: transparent;
        border: none;
        margin: 0 0 10px 0;
        white-space: pre-line;
        padding: 0 30px;
        line-height: 1.3;
        &:nth-child(4) {
          padding: 0 20px;
        }
      }
    }

    .woking-steps-block {
      position: relative;
      width: 340px;
      height: 340px;
      flex-shrink: 0;
    }
    .example {
      margin-top: 10px;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      .example-block {
        > div {
          width: 40px;
          height: 15px;
        }
        > h3 {
          width: 40px;
          text-align: center;
          margin-top: 4px;
          color: white;
          font-size: 13px;
        }
      }
    }
    .table-contain2 {
      margin: 10px 0 0 0;
      width: 100%;
      background: #072554;
    }
    .table-title-bg {
      background: #072554;
      padding: 8px 20px;
    }
    .table-contain {
      position: relative;
      width: calc(100% - 330px);
      max-height: 620px;
      padding: 10px 15px 0;
      margin-left: 15px;
      height: 395px;
      background-color: #072554;
      &::-webkit-scrollbar {
        display: none;
      }

      .table-block {
        height: calc(100% - 40px);
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .table-block2 {
      overflow-y: scroll;
      width: 100%;
      padding: 0 20px 10px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .table-title {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 5px;

      &::before {
        display: inline-block;
        content: "";
        width: 6px;
        height: 16px;
        background: #01bec8;
        border-radius: 3px;
        margin-right: 10px;
        transform: translateY(3px);
      }
    }
    .button-base {
      border: none;
      text-align: center;
      line-height: 30px;
      height: 30px;
      cursor: pointer;
      flex-shrink: 0;
      font-size: 14px;
      padding: 0 25px;
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
  .chart-box {
    height: 660px;
    padding: 20px;
    margin: 20px 70px;
    border: 1px solid #497ba0;
    .chart-contain {
      height: calc(100% - 20px);
      margin-top: 20px;
      box-sizing: border-box;
      background: 0 -4px / 20px 10px no-repeat url("icon-rects.png"),
        100% 0px / 10px 10px no-repeat url("icon-rect.png");
      background-color: #5684bc10;
    }
  }

  .top-header {
    background: center center / 100% 100% no-repeat
      url("@/assets/top-bg-qi.png");
    height: 100px;
    width: 100%;
    padding: 0 60px;
    display: flex;
    align-items: center;
    justify-content: center;

    > span {
      display: inline-block;
      font-size: 13px;
      font-weight: 400;
      margin-left: 10px;
      color: #63a0bd;
      white-space: nowrap;
    }
    .picker {
      min-width: 70px;
    }
    .search {
      background-color: #0346d9;
      font-weight: 400;
      font-size: 13px;
      color: #fff;
      padding: 6px 10px;
      font-size: 15px;
      border: none;
      margin-left: 15px;
      cursor: pointer;
      white-space: nowrap;
    }

    .calendar {
      background-color: transparent;
      padding: 2px 5px 2px 5px;
      border: 1px solid #264460;
      width: 100px;
    }

    .calendar-icon {
      width: 16px;
      height: 16px;
      background: center / 100% no-repeat url("@/assets/icon-calendar.png");
    }

    .selector-suffix {
      width: 12px;
      height: 12px;
      background: center / 100% no-repeat url("@/assets/arrow-down.png");
    }
  }
}
:deep(.ant-picker) {
  .ant-picker-input {
    > input {
      color: #a1e1ff;
      font-size: 12px;
      padding: 2px;
    }
  }
}
:deep(.ant-select) {
  &:not(.ant-select-customize-input) .ant-select-selector {
    // height: 28px;
    margin-right: 20px;
    background-color: transparent;
    border: 1px solid #264460;
  }
  .ant-select-selection-item {
    color: #a1e1ff;
    font-size: 13px;
  }
  .ant-select-arrow {
    color: #264460;
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
      white-space: nowrap;
    }
  }
}
// table 行样式
//   .ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover
:deep(.ant-table-tbody) {
  > tr {
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
      white-space: pre-wrap;
      &.ant-table-cell-row-hover {
        background: #072554; // 行hover效果
      }
    }
  }
}
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

<!-- <style>
:deep(.ant-select-dropdown) {
  background-color: #264460;
  .ant-select-item-option-selected,
  .ant-select-item-option-active {
    color: #44f0e9;
    background-color: #264460;
  }
}
.dropdown-custom {
  background-color: #264460;
}
.dropdown-custom > .ant-select-item {
  color: #a1e1ff;
  font-size: 13px;
}
.dropdown-custom .ant-select-item-option-selected,
.dropdown-custom .ant-select-item-option-active {
  color: #44f0e9;
  background-color: #264460;
}
</style> -->
