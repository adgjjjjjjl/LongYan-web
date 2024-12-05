<template>
  <main>
    <div id="myElement" class="top-header">
      <div
        v-for="title in buttonTitles"
        :key="title"
        :class="[
          'button-box',
          selectedTitle === title
            ? 'button-box-selected'
            : 'button-box-unselected',
        ]"
        @click="onClickProcess2(title)"
        @mouseover="onOverProcess2(title)"
      >
        <div>{{ title }}</div>
        <div class="popup">
          <svg version="1.1" width="30px" height="75px">
            <line x1="0" y1="40" x2="30" y2="15" stroke="#1F4185" />
            <line x1="0" y1="40" x2="30" y2="25" stroke="#1F4185" />
          </svg>
          <div class="popup-label">
            <span>委托方：{{companyname}}</span>
            <span>生产牌号：{{brandname}}</span>
            <span>批次：{{batchStr}}</span>
            <span>开始时间：{{batchstarttime}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="top-header2">
      <span>开始日期：</span>
      <a-date-picker
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="true"
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
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="true"
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
        style="width: 250px;color: rgb(99, 160, 189);"
        :options="optionsProd"
        :filter-option="filterOption"
        @focus="focus"
        @change="handleProductNumberChange"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
    </div>
    <div class="top-header2">
      <span>批次号：</span>
      <a-auto-complete v-model:value="shortbatch" :data-source ="batchDataSource" @change="handleBatchChange" :filter-option="filterOption2" placeholder="" style="color: #63a0bd;width: 200px;background-color: transparent;border: 1px solid #264460;"/>
      <a-input v-model:value="batch" @change="handleBatchChange2" placeholder=""  style="color: #63a0bd;width: 220px;background-color: transparent;border: 1px solid #264460;margin-left: 10px;"/>
      <span>箱号：</span>
      <a-auto-complete v-model:value="boxId" @blur="handleBoxnoChange" :data-source ="boxnoDataSource" :filter-option="filterOption2" placeholder=""  style="color: #63a0bd;width: 100px;background-color: transparent;border: 1px solid #264460;"/>
      <!--<button class="search" @click="searchBatch">查批次号</button>-->
      <button class="search" @click="onSearch" style="width:100px">查询</button>
      <button class="search" @click="onRefresh" style="width:100px">刷新</button>
      <button class="search" @click="showParams" style="width:100px">查看参数情况</button>
    </div>
    <div class="part-block">
      <div class="table-contain2">
        <div class="icon-left-rects" />
        <div class="icon-right-rects" />
        <div class="table-title">批次信息</div>
        <div class="table-block">
          <a-table
            :columns="batchDataColumns"
            :data-source="batchData"
            :pagination="false"
            :scroll="{ x: 1300, y: 100 }"
            :row-class-name="'cell-normal'"
          >
            <template #bodyCell="{ column, text, record }">
              <div class="base-cell">
                {{ text }}
              </div>
            </template>
          </a-table>
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
              v-show="showChart"
              :style="{ width: chartWidth, height: '300px' }"
            ></div>
            <div
              id="humidityChart"
              v-show="showChart"
              :style="{ width: chartWidth, height: '300px' }"
            ></div>
            <div
              id="bakingTrendingChart"
              v-show="showChart2"
              style="overflow-y: scroll;"
              :style="{ width: chartWidth, height: '600px' }"
            >
              <div 
              v-for="p in paramsInfo"
              :key="p.f_tag"
              :id="p.f_tag"
              style="height: 300px;"
              >
              </div>
            </div>
            <a-table
              v-show="!showChart && !showChart2"
              :columns="columns2"
              :data-source="data2"
              :pagination="false"
              :scroll="{ x: column2Width, y: 300 }"
              :row-class-name="'cell-normal'"
            >
              <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'f_num'">
                  <a @click="handleTitle(column.dataIndex,record)" class="base-cell">{{ text }}</a>
                </template>
                <template v-else-if="column.dataIndex === 'f_value'">
                  <span :class="record.f_qualified == '0' ? 'cell-abnormal' : 'cell-normal'">{{ text }}</span>
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
    <div class="part-block">
      <div class="table-contain">
        <div class="icon-left-rects" />
        <div class="icon-right-rects" />
        <div class="table-title">异常汇总</div>
        <div class="table-block">
          <a-table
            :columns="columns"
            :data-source="exceptionSummaryData"
            :pagination="false"
            :scroll="{ x: 1550, y: 210 }"
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
import { ref, onMounted, reactive, computed, nextTick } from "vue";
import zhCN from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { useRoute } from "vue-router";

import { 
  getBatchByBoxno,
  getBatchDelegate,
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
  getBakingTrendingPoint,
  getBakingTrending,
  getBatchByBrandAndFactory,
  getTemperatureTrending,
  getBoxnoDataSource,
  getRawMaterial,
  getBoxnoDataSourceByBrandid
} from '../api/request';

import {
  tableConfig,
  columns,
  batchDataColumns,
  unsteadyDataColumns,
  accessoryInfoColumns,
  outStockColumns,
  processParamsColumns,
  processTechnologyColumns,
  formulaSheetColumns,
  processQualityColumns,
  qualityInformationColumns,
  alarmMessageColumns,
  packingDensityColumns,
  rawMaterialColumns
} from "@/utils/LotTraceability";

import * as echarts from "echarts";

const buttonTitles = ["高架库出库","翻箱喂料","一润", "二润", "打叶", "叶加酶", "叶复烤", "叶打包","碎片复烤","碎片打包","烟梗复烤","烟梗打包"];
let selectedTitle = ref("叶打包");
let url = ref("");
const visible = ref(false);
let modalWidth = ref("90%");
let modalHeight = ref("80%");

let column2Width = ref(0);
let echart = echarts;
const route = useRoute()
const dateFormat = "YYYY-MM-DD HH:mm:ss";
let currentDate = new Date();
let sevenDaysAgo = new Date();
sevenDaysAgo.setDate(currentDate.getDate() - 1);
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
let companyname = ref("");
let brandname = ref("");
let batchStr = ref("");
let batchstarttime = ref("");
let productNumber = ref("");
let shortbatch = ref("");
let batch = ref("");
let batchMappig = {};
let boxId = ref("");
let exceptionSummaryData = ref([]);
let batchData = ref([]);
let data2 = ref([]);
let columns2 = ref([]);
let statusData = ref([]);
let productdate = ref("");
let team = ref("");
let starttime = ref("");
let endtime = ref("");
let task = ref("");
let paramsInfo = ref([]);
let batchDataSource = ref([]);
let boxnoDataSource = ref([]);
const examples = [
  { color: "rgb(145, 9, 21)", text: "停机" },
  { color: "rgb(50, 86, 77)", text: "未生产" },
  { color: "rgb(61, 140, 14)", text: "生产" },
  { color: "rgb(135, 78, 15)", text: "完成" },
  { color: "rgb(21, 114, 136)", text: "料头" },
  { color: "rgb(23, 174, 169)", text: "料尾" },
];
const temperatureMapping = {
"6":"S7_1.AD11.AD11_CL2_HJTEMP",
"10":"S7_3.AD31.AD31_LYYK_HJ_WD"
};
const humidityMapping = {
"6":"S7_1.AD11.AD11_CL2_HJSD",
"10":"S7_3.AD31.AD31_LYYK_HJ_SD"
};

// 底部左侧按钮
const bottomButtons = computed(() => Object.keys(tableConfig));
//选中的按钮标题
let activateMainStatus = ref("加工要求");
// 选中的按钮标题对应的子标题
const statusButtons = computed(() => {
  return tableConfig[activateMainStatus.value];
});
const showChart = computed(
  () => (activateStatus.value == "环境温湿度趋势")
);
const showChart2 = computed(
  () => (activateStatus.value == "叶复烤过程趋势")
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
    chartWidth.value = `${
      document.getElementsByClassName("table-title-bg")[0]?.offsetWidth - 40
    }px`;
  }, 200);
  window.onresize = () =>
    (() => {
      reloadCharts();
    })();
  loadToolBarData();
  loadCurrentDbBatch();
});

const updateColumn2Width = function(columns){
  column2Width.value = columns.value.reduce((accumulator, currentValue) => accumulator + currentValue.width, 0);
}

const loadToolBarData = () => {
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadDelegate(dateStartStr,dateEndStr);
}

const loadDelegate = (dateStartStr,dateEndStr) => {
  optionsDelegate.value.length = 0;
  optionsDelegate.value.push({"value":"","label":"请选择"});
  getBatchDelegate(dateStartStr,dateEndStr).then(res=>{
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
  optionsProd.value.push({"value":"","label":"请选择"});
  getBrandByDelegate(dateStartStr,dateEndStr,delegateid).then(res=>{
      if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          optionsProd.value.push({value:res.data[i].id,label:res.data[i].name});
        }
        productNumber.value = optionsProd.value[0].value;
        loadBatchDataSource(dateStartStr,dateEndStr);
      }
  });
}

const loadBatchDataSource = (dateStartStr,dateEndStr) => {
  getBatchByBrandAndFactory(productNumber.value,working.value,dateStartStr,dateEndStr).then(res=>{
    batchDataSource.value.length = 0;
    if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          batchDataSource.value.push(res.data[i].f_short_batch);
          batchMappig[res.data[i].f_short_batch] = res.data[i].f_batch;
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

const loadBoxnoDataSource = () =>{
  getBoxnoDataSource(batch.value).then(res=>{
    boxnoDataSource.value.length = 0;
    if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          boxnoDataSource.value.push(res.data[i].boxno.toString());
        }
    }
  });
}

const loadBoxnoDataSourceByBrandid = ()=>{
  getBoxnoDataSourceByBrandid(productNumber.value).then(res=>{
    boxnoDataSource.value.length = 0;
    if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          boxnoDataSource.value.push(res.data[i].boxno.toString());
        }
    }
  });
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
    batchData.value.length = 0;
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
            selectedTitle.value = data[i].factoryname;
            productdate.value = data[i].f_product_date;
            team.value = data[i].teamname;
            starttime.value = data[i].starttime;
            endtime.value = data[i].endtime;
            working.value = data[i].f_factory_id.toString();
            task.value = data[i].f_task;
            batchData.value.push(data[i]);
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
  if(myChart){
    myChart.resize();
  }
  if(myChart2){
    myChart2.resize();
  }
  if(paramsInfo.value.length > 0){
    let paramsInfoChart;
    for(let i=0;i<paramsInfo.value.length;i++){
      paramsInfoChart = echart.init(document.getElementById(paramsInfo.value[i].f_tag));
      paramsInfoChart.resize();
    }
  }
};
// 选择器选中事件
const focus = (e) => {
  // console.log(e);
};

// 选择器选项变化事件
const handleDelegateChange = (e) => {
  // console.log(e);
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  batch.value = ""
  loadBrandDelegate(dateStartStr,dateEndStr,delegate.value);
};

const handleProductNumberChange = (e) => {
  // console.log(e);
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  batch.value = ""
  loadBatchDataSource(dateStartStr,dateEndStr);
  loadBoxnoDataSourceByBrandid();
};

const handleBatchChange = (e) =>{
  batch.value = batchMappig[shortbatch.value];
  if(batch.value == undefined || batch.value == ""){
    batch.value = ""
    loadBoxnoDataSourceByBrandid();
  }
  else{
    loadBoxnoDataSource();
  }
};

const handleBatchChange2 = (e) =>{
  if(batch.value == undefined || batch.value == ""){
    batch.value = ""
    loadBoxnoDataSourceByBrandid();
  }
  else{
    loadBoxnoDataSource();
  }
}

const handleBoxnoChange = (e) =>{
  if(boxId.value != undefined && boxId.value != ""){
    let dateStartStr = dateStart.value.format(dateFormat);
    let dateEndStr = dateEnd.value.format(dateFormat);
    getBatchByBoxno(productNumber.value,boxId.value,dateStartStr,dateEndStr).then(res=>{
        let data;
        if(typeof res.data == "string"){
          data = eval("("+res.data+")");
        }
        else{
          data = res.data;
        }
        if(data.length == 0){
          alert("根据所选条件未找到对应的批次,请修改时间范围，或选择正确的生产牌号")
        }
        else if(data.length == 1){
          shortbatch.value = "";
          batch.value = data[0].f_batch;
          onSearch(e);
        }
        else{
          alert("根据所选条件找到多个批次，请缩小时间范围，或选择正确的生产牌号")
        }
    })
  }
}

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

const onRefresh = (e) => {
  console.log(e);
  window.location.reload();
};

const showParams = (e) => {
  showModal("../systems/formconfig/listeditor.jsp?rid=63&xformIdx=104&showTitle=false&xmenuidx=172&batch="+task.value);
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
    selectedTitle.value = itemStatus.key;
    batch.value = itemStatus.batch;
    productdate.value = itemStatus.productdate;
    team.value = itemStatus.team;
    starttime.value = itemStatus.start;
    endtime.value = itemStatus.end;
    working.value = itemStatus.factoryid.toString();
  }
  
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);

  loadExceptionSummary();
  loadData2();
  loadBatchDataSource(dateStartStr,dateEndStr);
  loadBoxnoDataSource();
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
    updateColumn2Width(columns2);
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
    updateColumn2Width(columns2);
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
    updateColumn2Width(columns2);
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
    updateColumn2Width(columns2);
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
    updateColumn2Width(columns2);
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
    updateColumn2Width(columns2);
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
    updateColumn2Width(columns2);
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
    updateColumn2Width(columns2);
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
    updateColumn2Width(columns2);
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
    updateColumn2Width(columns2);
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

function loadTemperatureTrending(){
  if(temperatureMapping[working.value]){
    option["series"][0]["data"].length = 0;
    getTemperatureTrending(batch.value,temperatureMapping[working.value]).then(res=>{
      let data=[];
      if(typeof res.data == "string"){
        data = eval("("+res.data+")");
      }
      else{
        data = res.data;
      }
      let tempavg= parseFloat((
                      data.reduce((acc, obj) => acc + Number(obj.y), 0) / data.length
                    ).toFixed(2));
      option.yAxis.min = tempavg - 1;
      option.yAxis.max = tempavg + 1;
      //console.log(data);
      for(var i=0;i<data.length;i++){
        // option["xAxis"]["data"].push(data[i].x);
        // option["series"][0]["data"].push(data[i].y);
        option["series"][0]["data"].push([data[i].x,parseFloat(data[i].y)]);
      }
      initCharts();
    });
  }
  else{
    option["series"][0]["data"].length = 0;
    initCharts();
  }
  
  if(humidityMapping[working.value]){
    option2["series"][0]["data"].length = 0;
    getTemperatureTrending(batch.value,humidityMapping[working.value]).then(res=>{
      let data=[];
      if(typeof res.data == "string"){
        data = eval("("+res.data+")");
      }
      else{
        data = res.data;
      }
      let humiavg=  parseFloat((
                      data.reduce((acc, obj) => acc + Number(obj.y), 0) / data.length
                    ).toFixed(2));
      option2.yAxis.min = humiavg - 5;
      option2.yAxis.max = humiavg + 5;
      //console.log(data);
      for(var i=0;i<data.length;i++){
        // option2["xAxis"]["data"].push(data[i].x);
        // option2["series"][0]["data"].push(data[i].y);
        option2["series"][0]["data"].push([data[i].x,parseFloat(data[i].y)]);
      }
      initCharts2();
    });
  }
  else{
    option2["series"][0]["data"].length = 0;
    initCharts2();
  }
}

function loadBakingTrendingPoint(){
  paramsInfo.value.length = 0;
  if(boxId.value){
    getBakingTrendingPoint(batch.value,boxId.value).then(res=>{
        if(res.data.length>0){
          for(let i=0;i<res.data.length;i++){
            paramsInfo.value.push(res.data[i]);
            option3Mapping[res.data[i].f_tag] = JSON.parse(JSON.stringify(option3));
            option3Mapping[res.data[i].f_tag].yAxis.min = res.data[i].minvalue;
            option3Mapping[res.data[i].f_tag].yAxis.max = res.data[i].maxvalue;
          }
          //解决dom异步刷新的问题
          nextTick(()=>{
            loadBakingTrending();
          })
        }
    });
  }
  else{
    alert("请输入要查询的箱号");
  }
}

function loadBakingTrending(){
  for(let i= 0;i<paramsInfo.value.length;i++){
    let id = paramsInfo.value[i].f_tag;
    paramsInfoChart[id] = echart.init(document.getElementById(id));
    paramsInfoChart[id].showLoading({
        text: '加载中...',       // 设置加载中文本
        color: '#FFF',           // 将加载动画的颜色设置为白色
        textColor: '#FFF',       // 将文本颜色设置为白色
        maskColor: 'rgba(255, 255, 255, 0.8)',  // 设置遮罩颜色
        zlevel: 0                // 设置 z-index 层级
    });
    getBakingTrending(batch.value,boxId.value,id).then(res=>{
        let data=[];
        if(typeof res.data == "string"){
          data = eval("("+res.data+")");
        }
        else{
          data = res.data;
        }
        if(data.length > 0){
          option3Mapping[id]["series"][0]["name"] = data[0].serier;
          for(var j=0;j<data.length;j++){
            if(option3Mapping[id]["series"][0]["name"] == data[j].serier){
              option3Mapping[id]["series"][0]["data"].push([data[j].x,data[j].y]);
            }
            else{
              option3Mapping[id]["series"][1]["name"] = data[j].serier;
              option3Mapping[id]["series"][1]["data"].push([data[j].x,data[j].y]);
            }
          }
        }
        paramsInfoChart[id].hideLoading();
        initCharts3(id);
    })
  }
}

function loadRawMaterial(){
  getRawMaterial(batch.value).then(res=>{
    columns2.value = rawMaterialColumns;
    updateColumn2Width(columns2);
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

const onClickProcess = (title) => {
  activateMainStatus.value = title;
  activateStatus.value = statusButtons.value[0];
  loadData2();
};

const onClickProcess2 = (title) => {
  if(title != selectedTitle.value){
    selectedTitle.value = title;
    let itemStatus = statusData.value.find((e) => e.key === title);
    if(itemStatus == undefined){
      alert("未找到当前批次关联的"+title+"批次");
    }
    else{
      loadBatchInfoData();
      loadData(itemStatus);
    }
  }
};

const onOverProcess2 = (title) => {
  let itemStatus = statusData.value.find((e) => e.key === title);
  if(itemStatus == undefined){
    companyname.value = "";
    brandname.value = "";
    batchStr = "";
    batchstarttime.value = "";
    console.log("未找到当前批次关联的"+title+"批次");
  }
  else{
    companyname.value = itemStatus.principal;
    brandname.value = itemStatus.trademark;
    batchStr = itemStatus.batch;
    batchstarttime.value =itemStatus.start;
  }
};

const onClickTitle = (e) => {
  activateStatus.value = e;
  if(e == "环境温湿度趋势" ){
    resizeTemperatureChart();
  }
  if(e == "叶复烤过程趋势"){
    resizeBakingTrendingChart();
  }
  loadData2();
};

const resizeTemperatureChart = () => {
  const temperatureChart = echart.init(
    document.getElementById("temperatureChart")
  );
  temperatureChart.resize();
  const humidityChart = echart.init(
    document.getElementById("humidityChart")
  );
  humidityChart.resize();
};

const resizeBakingTrendingChart = () => {
  if(paramsInfo.value.length > 0){
    let paramsInfoChart;
    for(let i=0;i<paramsInfo.value.length;i++){
      paramsInfoChart = echart.init(document.getElementById(paramsInfo.value[i].f_tag));
      paramsInfoChart.resize();
    }
  }
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
  else if(activateStatus.value == "参数下发标准"){
    loadProcessParams();
  }
  else if(activateStatus.value == "工艺指标明细"){
    loadProcessTechnology();
  }
  else if(activateStatus.value == "配方单"){
    loadFormulaSheet();
  }
  else if(activateStatus.value == "环境温湿度趋势"){
    loadTemperatureTrending();
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
    loadBakingTrendingPoint();
  }
  else if(activateStatus.value == "原料物理特性"){
    loadRawMaterial();
  }
}

// 时间选择事件
const dateChange = (date, dateString) => {
  console.log(dateString);
  batch.value = ""
  loadToolBarData();
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadBatchDataSource(dateStartStr,dateEndStr);
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
      min: 'dataMin',
      max: 'dataMax',
      axisLabel: {
        formatter: "{value} ℃",
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
    legend:{
      show:true,
      top:15,
      itemWidth:15,
      itemHeight:10,
      textStyle:{
        color:"white"
      }
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
        name:"环境温度",
        type: "line",
        smooth: false,
        showSymbol: false,
        symbol: "none",
        symbolSize: 0,
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
        markLine: {
          data: [
            {
              type: 'average', 
              name: '平均值',
              lineStyle: {
                width: 1.656,
                color: '#00ff00'
              },
              label: {
                show: true,
                color: '#00ff00',
                position: 'insideEndTop',
                formatter:'{b}: {c} ℃'
              }
            }
          ]
        }
      },
    ],
  };

var myChart2 = null;
const option2 = JSON.parse(JSON.stringify(option));
option2["series"][0]["name"] = "环境湿度";
option2["yAxis"]["axisLabel"]["formatter"] = "{value} %";
option2["title"]["text"] = "单位(百分比)";
option2["series"][0]["markLine"]["data"][0]["label"]["formatter"] = '{b}: {c} %';

// 初始化折线图
const initCharts = () => {
  // 基于准备好的dom，初始化echarts实例
  myChart = echart.init(document.getElementById("temperatureChart"));
  myChart.setOption(option);
  console.log("initchart");
};

const initCharts2 = () => {
  // 基于准备好的dom，初始化echarts实例
  myChart2 = echart.init(document.getElementById("humidityChart"));
  myChart2.setOption(option2);
  console.log("initchart2");
};

var paramsInfoChart = {};
var option3Mapping = {};
const option3 = JSON.parse(JSON.stringify(option));
option3["series"][0]["name"] = "";
delete option3["series"][0].markLine;
option3["yAxis"]["axisLabel"]["formatter"] = "{value}";
option3["title"]["text"] = "";
option3["series"].push(JSON.parse(JSON.stringify(option3["series"][0])));
option3["series"][1].lineStyle.color = "#00FF00";
delete option3["series"][1].areaStyle;

const initCharts3 = (id) => {
  paramsInfoChart[id].setOption(option3Mapping[id]);
  console.log("initParamsInfoCharts");
};

const refreshCharts = ()=>{
  myChart.setOption(option);
  console.log("refreshCharts");
}

const refreshCharts2 = ()=>{
  myChart2.setOption(option2);
  console.log("refreshCharts2");
}

const refreshCharts3 = ()=>{
  for(let i=0;i<paramsInfo.value.length;i++){
      paramsInfoChart[paramsInfo.value[i].f_tag].setOption(option3Mapping[paramsInfo.value[i].f_tag]);
      paramsInfoChart[paramsInfo.value[i].f_tag].resize();
      console.log("refreshParamsInfoCharts");
  }
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
      width: 100%;
      max-height: 620px;
      padding: 10px 15px 0;
      margin-left: 15px;
      height: 295px;
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
    
    .button-box-selected {
      background-image: url("/basic-info-pending.png");
    }
    .button-box-unselected {
      background-image: url("/basic-info-deal.png");
    }
    .button-box {
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      text-align: center;
      font-size: 17px;
      color: white;
      width: 120px;
      height: 75px;
      line-height: 50px;
      cursor: pointer;
      position: relative;

      .popup {
        position: absolute;
        width: 240px;
        height: 60px;
        opacity: 0;
        top: -20px;
        left: 80px;
        pointer-events: none;
        display: grid;
        grid-template-columns: 1fr 1fr;
        // background-color: red;
      }

      .popup-label {
        background: #1f4185;
        border: 1px solid #000;
        opacity: 0.8;
        border-radius: 15px;
        white-space: nowrap;
        color: #93dcfe;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 5px 10px;

        span {
          display: block;
          line-height: 15px;
          height: 15px;
          text-align: left;
        }
      }

      &:hover .popup {
        opacity: 1;
        pointer-events: auto;
        z-index: 999;
      }
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

:deep(.ant-table-empty){
  .ant-table-tbody{
    height: 300px;
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
      font-size: 14px;
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

.top-header2 {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 60px;
    
    > span {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      color: #63a0bd;
      flex-shrink: 0;
      margin-left: 10px;
    }

    // > * {
    //   margin-right: 10px;
    // }
    .picker {
      min-width: 100px;
      height: 28px;
    }
    .search {
      background-color: #0346d9;
      font-weight: 400;
      color: #fff;
      padding: 6px 10px;
      border: none;
      margin-left: 15px;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
    }

    .calendar {
      background-color: transparent;
      padding: 2px 5px 2px 10px;
      border: 1px solid #264460;
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
