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
        <div class="chart-contain" style="margin-left: 20px">
          <div id="chartTrans" style="height: 100%"></div>
          <div class="chart-title">工段产量</div>
        </div>
      </div>
      <div class="table-contain">
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
        <span>状态：</span>
        <a-select
          ref="group-picker"
          v-model:value="status"
          mode="multiple"
          class="picker"
          dropdownClassName="dropdown-custom"
          style="width: 120px"
          :options="optionsStatus"
          @focus="focus"
        >
          <template #suffixIcon>
            <div class="selector-suffix" />
          </template>
        </a-select>
        <span>委托方：</span>
        <a-select
          show-search
          v-model:value="delegate"
          mode="multiple"
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
            mode="multiple"
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
      </div>
      <div class="top-header2">
          <span>批次：</span>
          <a-auto-complete v-model:value="shortbatch" :data-source ="batchDataSource" @change="handleBatchChange" :filter-option="filterOption2" placeholder="" style="color: #63a0bd;width: 120px;background-color: transparent;border: 1px solid #264460;"/>
          <a-input v-model:value="batch" @change="handleBatchChange2" placeholder=""  style="color: #63a0bd;width: 220px;background-color: transparent;border: 1px solid #264460;margin-left: 10px;"/>
          <span>箱号：</span>
          <a-auto-complete v-model:value="boxId" :data-source ="boxnoDataSource" :filter-option="filterOption2" placeholder=""  style="color: #63a0bd;width: 70px;background-color: transparent;border: 1px solid #264460;"/>
          <button class="search" @click="onSearch" style="width:100px">查询</button>
        </div>
        <div class="table-block">
          <a-table
            :row-selection="rowSelection"
            :columns="columnDatasource"
            :data-source="data"
            :pagination="false"
            :scroll="{ x: columnWidth, y: 405 }"
            :row-class-name="
              (_record, index) =>
                _record.is_error == '正常' ? 'cell-normal' : 'cell-abnormal'
            "
          >
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'f_short_batch'||column.dataIndex === 'is_error'||column.dataIndex === 'casenonum1'">
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
import zhCN from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { columns,columnsMapping } from "@/utils/pageConfig.js";
import { getBatchInfoList,getFactoryTimeSpan,getFactoryProduction,delBatchByRowids,updateBatchOrder,calcUnsteadyState,delQaTask,getBatchStatus,getBatchByBrandAndFactory,getBatchDelegate,getBrandByDelegate,getBoxnoDataSource } from '../api/request';

let url = ref("");
const visible = ref(false);
let modalWidth = ref("90%");
let modalHeight = ref("80%");

const dateFormat = "YYYY-MM-DD HH:mm:ss";
let echart = echarts;
let currentDate = new Date();
let fiveDaysAgo = new Date();
fiveDaysAgo.setDate(currentDate.getDate() - 5);
let dateStart = ref(dayjs(fiveDaysAgo));
let dateEnd = ref(dayjs(currentDate));
let data = ref([]);
let columnDatasource = ref([]);
let columnWidth = ref(0);
let delegate = ref("");
const optionsDelegate = ref([
  {
    value: "",
    label: "",
  }
]);
let batchDataSource = ref([])
let boxnoDataSource = ref([])
let batchInfoData = undefined;
let timeSpanData = [];
let productionData = [];

let batch = ref("");
let shortbatch = ref("");
let batchMappig = {};
let optionsStatus = ref([
  {
    value: "",
    label: "",
  }
]);
let status = ref(",1,2,3,4,5,6");
let productNumber = ref("");
const optionsProd = ref([]);
let boxId = ref("");

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
  if(title == "f_short_batch"){
    modalWidth.value = "100%";
    modalHeight.value = "1000px";
    showModal("./index.html#/tracebility?batch="+record.f_batch);
  }
  if(title == "is_error"){
    modalWidth.value = "1280px";
    modalHeight.value = "800px";
    showModal("../systems/formconfig/listeditor.jsp?xformIdx=196&rid=16&showToolbar=false&showTitle=true&queryType=report&closecswindow=false&batch=" + record.f_batch);
  }
  if(title == "casenonum1"){
    modalWidth.value = "1200px";
    modalHeight.value = "1000px";
    showModal("../systems/formconfig/listeditor.jsp?xformIdx=222&rid=16&showToolbar=false&showTitle=true&queryType=report&batch=" + record.f_batch);
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

  loadColumns();
  loadToolBarData();

  setTimeout(() => {
    initCharts();
    loadChartData();
  }, 200);

  window.onresize = () =>
    (() => {
      reloadCharts();
    })();

});

const loadColumns = () =>{
  columnDatasource.value = columns.filter(item=>{
    return !columnsMapping[selectedTitle.value].includes(item.dataIndex);
  });

  columnWidth.value = columnDatasource.value.reduce((accumulator, currentValue) => accumulator + currentValue.width, 0);
}

const loadBatchInfoData = () => {
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  getBatchInfoList(topTitlesMapping[selectedTitle.value],dateStartStr,dateEndStr,paginationConfig.current,status.value,batch.value,productNumber.value,boxId.value).then(res=>{
    data.value.length = 0;
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
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  getFactoryTimeSpan(topTitlesMapping[selectedTitle.value],dateStartStr,dateEndStr).then(res=>{
    //console.log(res.data);
    if(typeof res.data == "string"){
      timeSpanData = eval("("+res.data+")");
    }
    else{
      timeSpanData = res.data;
    }
    //console.log(data);
    for(var i=0;i<timeSpanData.length;i++){
      Timerption["xAxis"]["data"].push(timeSpanData[i].x);
      Timerption["series"][0]["data"].push(timeSpanData[i].y);
    }
    chartTimer.setOption(Timerption);
  });
}

function loadFactoryProductionData(){
  TransOption["xAxis"]["data"].length = 0;
  TransOption["series"][0]["data"].length =0;
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  getFactoryProduction(topTitlesMapping[selectedTitle.value],dateStartStr,dateEndStr).then(res=>{
    //console.log(res.data);
    if(typeof res.data == "string"){
      productionData = eval("("+res.data+")");
    }
    else{
      productionData = res.data;
    }
    //console.log(data);
    for(var i=0;i<productionData.length;i++){
      TransOption["xAxis"]["data"].push(productionData[i].x);
      TransOption["series"][0]["data"].push(productionData[i].y);
    }
    if(topTitlesMapping[selectedTitle.value] == 10 || topTitlesMapping[selectedTitle.value] == 11){
      //箱数正常是30--50之间，超过变红
      TransOption.series[0].itemStyle.color=(params)=>{
          const { dataIndex, data } = params;
          if(data >=30 && data <=50){
            return "#04112C";
          }
          else{
            return "#FF0000";
          }
        };
    }
    else{
      //二润工段的是，配方量超出±500会变红
      if(topTitlesMapping[selectedTitle.value] == 7){
          TransOption.series[0].itemStyle.color=(params)=>{
                const { dataIndex, data } = params;
                var span = productionData[dataIndex].formula - data;
                if(Math.abs(span) <= 500){
                  return "#04112C";
                }
                else{
                  return "#FF0000";
                }
              };
        }
        else{
          TransOption.series[0].itemStyle.color="#04112C";
        }
    }
    chartTrans.setOption(TransOption);
  });
}

const loadBatchStatus = () => {
  optionsStatus.value.length = 0;
  optionsStatus.value.push({value:",1,2,3,4,5,6",label:"全部"});
  status.value = optionsStatus.value[0].value;
  getBatchStatus().then(res=>{
      if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          optionsStatus.value.push({value:res.data[i].id,label:res.data[i].name});
        }
      }
  });
}

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

const reloadCharts = () => {
  const chartTimer = echart.init(document.getElementById("chartTimer"));
  const chartTrans = echart.init(document.getElementById("chartTrans"));
  chartTrans.resize();
  chartTimer.resize();
};

const onClickTitle = (title) => {
  selectedTitle.value = title;
  console.log(selectedTitle.value);
  loadColumns();
  loadChartData();
  batchInfoData = undefined;
  loadToolBarData();
};

function handlePageChange(current) {
  console.log(
    `点击了第 ${current} 页`
  );``
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
  loadToolBarData();
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadChartData();
  loadBatchDataSource(dateStartStr,dateEndStr);
};

// 选择器选项变化事件
const handleDelegateChange = (e) => {
  // console.log(e);
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadBrandDelegate(dateStartStr,dateEndStr,delegate.value);
};

const handleProductNumberChange = (e) => {
  // console.log(e);
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadBatchDataSource(dateStartStr,dateEndStr);
};

const handleBatchChange = (e) =>{
  batch.value = batchMappig[shortbatch.value];
  loadBoxnoDataSource();
};

const handleBatchChange2 = (e) =>{
  if(batch.value == undefined){
    batch.value = ""
  }
}

const loadToolBarData = () => {
  loadBatchStatus();
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadDelegate(dateStartStr,dateEndStr);
}

const loadDelegate = (dateStartStr,dateEndStr) => {
  optionsDelegate.value.length = 0;
  let all = {"value":"","label":"全部"};
  optionsDelegate.value.push(all);
  getBatchDelegate(dateStartStr,dateEndStr).then(res=>{
    if(res.data.length>0){
      for(let i=0;i<res.data.length;i++){
        all.value += ","+res.data[i].id.toString();
        optionsDelegate.value.push({value:res.data[i].id,label:res.data[i].name});
      }
      delegate.value = all.value;
      loadBrandDelegate(dateStartStr,dateEndStr,delegate.value);
    }
  });
}

const loadBrandDelegate = (dateStartStr,dateEndStr,delegateid) => {
  optionsProd.value.length = 0;
  let all = {"value":"","label":"全部"};
  optionsProd.value.push(all);
  getBrandByDelegate(dateStartStr,dateEndStr,delegateid).then(res=>{
      if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          all.value += ","+res.data[i].id.toString();
          optionsProd.value.push({value:res.data[i].id,label:res.data[i].name});
        }
        productNumber.value = all.value;
        //初次进入页面时自动加载批次数据
        if(batchInfoData == undefined){
          loadBatchInfoData();
        }
        loadBatchDataSource(dateStartStr,dateEndStr);
      }
  });
}

const loadBatchDataSource = (dateStartStr,dateEndStr) => {
  getBatchByBrandAndFactory(productNumber.value,topTitlesMapping[selectedTitle.value],dateStartStr,dateEndStr).then(res=>{
    batchDataSource.value.length = 0;
    if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          batchDataSource.value.push(res.data[i].f_short_batch);
          batchMappig[res.data[i].f_short_batch] = res.data[i].f_batch;
        }
      }
  });
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
      min: 8000,
      max: 15000,
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
          color: (params)=>{
            const { color, data } = params;
            if(data >=30 && data <=50){
              return "#04112C";
            }
            else{
              return "#FF0000";
            }
          },
          borderColor: "#71D9EB", //拐点边框颜色
          borderWidth: 1, //拐点边框大小
          opacity: 0.9
        },
      },
    ],
  };

const Timerption = JSON.parse(JSON.stringify(TransOption));
Timerption.title.text = "单位（分钟）";
Timerption.yAxis.min = 30;
Timerption.yAxis.max = 150;
Timerption.series[0].label.formatter = function(value,index){
  return minutesToTimeString(parseInt(value.data));
};
Timerption.series[0].itemStyle.color=(params)=>{
            const { color, data } = params;
            //时长小于40分钟，大于70分钟，要变红，
            if(data >=40 && data <=70){
              return "#04112C";
            }
            else{
              return "#FF0000";
            }
          };

var chartTimer = null;
var chartTrans = null;

const initCharts = () => {
  // 基于准备好的dom，初始化echarts实例
  chartTimer = echart.init(document.getElementById("chartTimer"));
  chartTrans = echart.init(document.getElementById("chartTrans"));
  chartTimer.setOption(Timerption);
  chartTrans.setOption(TransOption);
  chartTimer.on("click",function(param){
      toNextPage2(timeSpanData[param.dataIndex].f_batch,1);
  });
  chartTrans.on("click",function(param){
      toNextPage2(productionData[param.dataIndex].f_batch,2);
  });
};


const toNextPage2 = (batch,type) => {
  modalHeight.value = "800px";
  if(type == 2 && (topTitlesMapping[selectedTitle.value] == 10 || topTitlesMapping[selectedTitle.value] == 11)){
    var batchstr = batch;
    if(topTitlesMapping[selectedTitle.value] == 10){
      batchstr = batch.replace("fk","db");
    }
    showModal("../systems/formconfig/listeditor.jsp?xformIdx=222&rid=16&showToolbar=false&showTitle=true&queryType=report&batch="+batchstr);
  }
  else{
    showModal("../systems/formconfig/listeditor.jsp?xformIdx=196&rid=16&showToolbar=false&showTitle=true&queryType=report&closecswindow=false&batch="+batch);
  }
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
        for(let i=0;i<rows.length;i++){
          delQaTask(rows[i].f_batch).then(res=>{
            let data2 = {};
            if(typeof res.data == "string"){
              data2 = eval("("+res.data+")");
            }
            else{
              data2 = res.data;
            }
            if(data2.success){
              console.log("联动删除"+rows[i].f_batch+"的相关质检工单成功")
            }
            else{
              console.log(data2.msg);
            }
          });
        }
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
  flex-direction: column;
  background-color: transparent;
  height: 100vh;

  .page-bottom {
    .table-contain {
      position: relative;
      width: 100%;
      max-height: 640px;
      background-color: #072554;
      padding: 0 40px;

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
        height: 480px;
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
    display: flex;
    height: 320px;
    padding: 0 20px;
    margin: 10px 0px 0 20px;
    .chart-contain {
      width: 50%;
      height: 305px;
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

:deep(.ant-table-empty){
  .ant-table-tbody{
    height: 405px;
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

.top-header2 {
    background: center center / 100% 100% no-repeat
      url("@/assets/top-bg-qi.png");
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;

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

:deep(.ant-picker-input) {
  > input {
    color: #a1e1ff;
    font-size: 14px;
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
    font-size: 14px;
    background-color: #002d70;
    border: none;
  }
  .ant-select-arrow {
    color: #264460;
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
