<template>
  <main>
    <div id="myElement" class="top-header">
      <span>开始日期：</span>
      <a-date-picker
        v-model:value="dateStart"
        :locale="locale"
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
        :locale="locale"
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
        ref="delegate-picker"
        v-model:value="delegate"
        class="picker"
        dropdownClassName="dropdown-custom"
        style="width: 220px"
        :options="optionsDelegate"
        @focus="focus"
        @change="handleDelegateChange"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <span>生产牌号：</span>
      <a-select
        ref="productNumber-picker"
        v-model:value="productNumber"
        class="picker"
        dropdownClassName="dropdown-custom"
        style="width: 220px"
        :options="optionsProd"
        @focus="focus"
        @change="handleBrandChange"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <span>班组：</span>
      <a-select
        ref="group-picker"
        v-model:value="group"
        class="picker"
        dropdownClassName="dropdown-custom"
        style="width: 120px"
        :options="optionsGroup"
        @focus="focus"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <!--<button class="search" @click="searchBatch">查询批次号</button>-->
      <button class="search" @click="onSearch">查询</button>
    </div>
    <div class="chart-box">
      <div class="chart-contain">
        <div id="analyzeChart" style="height: 100%"></div>
      </div>
    </div>
    <a-modal
      v-model:visible="visible"
      title=""
      width="90%"
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
        style="width: 100%; height: 75vh"
      />
    </a-modal>
  </main>
</template>

<script setup>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { ref, onMounted, reactive,defineComponent } from "vue";
import {getAnalyzeRendering,getDelegate,getAnalyzeRenderingBrandByDelegate,getBrandTeam} from '../api/request';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

let url = ref("");
const visible = ref(false);

const dateFormat = 'YYYY-MM-DD';
let echart = echarts;
let currentDate = new Date();
let sevenDaysAgo = new Date();
let endDate = new Date();
sevenDaysAgo.setDate(currentDate.getDate() - 7);
endDate.setDate(currentDate.getDate() - 1);
let dateStart = ref(dayjs(sevenDaysAgo));
let dateEnd = ref(dayjs(endDate));
let optionsDelegate = ref([
  {
    value: "",
    label: "",
  },
]);
let delegate = ref("");
let optionsProd = ref([
  {
    value: "",
    label: "",
  }
]);
let productNumber = ref("");
let optionsGroup = ref([
  {
    value: "",
    label: "",
  }
]);
let group = ref("");
let data = []

onMounted(() => {
  setTimeout(() => {
    initCharts();
    search();
  }, 200);
  window.onresize = () =>
    (() => {
      reloadCharts();
    })();
    loadToolBarData();
});

const loadToolBarData = () => {
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadDelegate(dateStartStr,dateEndStr);
}

const loadDelegate = (dateStartStr,dateEndStr) => {
  optionsDelegate.value.length = 0;
  getDelegate(dateStartStr,dateEndStr).then(res=>{
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
  getAnalyzeRenderingBrandByDelegate(dateStartStr,dateEndStr,delegateid).then(res=>{
      if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          optionsProd.value.push({value:res.data[i].id,label:res.data[i].name});
        }
        productNumber.value = optionsProd.value[0].value;
        loadBrandTeam(dateStartStr,dateEndStr,delegateid,productNumber.value);
      }
      else{
        productNumber.value="";
        optionsGroup.value.length = 0;
        group.value = "";
      }
  });
}

const loadBrandTeam = (dateStartStr,dateEndStr,delegateid,brandid) => {
  optionsGroup.value.length = 0;
  optionsGroup.value.push({value:"",label:"全部"});
  group.value = optionsGroup.value[0].value;
  getBrandTeam(dateStartStr,dateEndStr,delegateid,brandid).then(res=>{
      if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          optionsGroup.value.push({value:res.data[i].id,label:res.data[i].name});
        }
      }
  });
}

// 缩放后重新渲染折线图
const reloadCharts = () => {
  var myChart = echart.init(document.getElementById("analyzeChart"));
  myChart.resize();
};
// 选择器选中事件
const focus = (e) => {
  console.log(e);
};
// 选择器选项变化事件
const handleDelegateChange = (e) => {
  console.log(e);
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadBrandDelegate(dateStartStr,dateEndStr,delegate.value);
};

const handleBrandChange = (e) => {
  console.log(e);
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  loadBrandTeam(dateStartStr,dateEndStr,delegate.value,productNumber.value);
};

const toNextPage = (brandname,teamname,startdate,enddate) => {
  showModal("../systems/formconfig/listeditor.jsp?rid=63&xformIdx=104&showTitle=false&xmenuidx=172&brandname="+brandname+"&teamname="+teamname+"&startdate="+startdate+"&enddate="+enddate);
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

// 查询数据
const search = () => {
  onSearch();
};

// 查询
const onSearch = (e) => {
  option["xAxis"]["data"].length = 0;
  option["series"][0]["data"].length =0;
  let dateStartStr = dateStart.value.format(dateFormat);
  let dateEndStr = dateEnd.value.format(dateFormat);
  getAnalyzeRendering(productNumber.value,group.value,dateStartStr,dateEndStr).then(res=>{
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
  });
};
// 时间选择事件
const dateChange = (date, dateString) => {
  console.log(dateString);
  loadToolBarData();
};

const option = {
    xAxis: {
      boundaryGap: ["10%", "10%"],
      type: "category",
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
      top: 60,
      right: 20,
      bottom: 0,
      containLabel: true,
    },
    title: {
      text: "单位（分）",
      left: "10",
      top: "20",
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

var myChart = null;

// 初始化折线图
const initCharts = () => {
  // 基于准备好的dom，初始化echarts实例
  myChart = echart.init(document.getElementById("analyzeChart"));
  myChart.setOption(option);
  myChart.on("click",function(param){
      toNextPage(data[param.dataIndex].brandname, data[param.dataIndex].teamname,data[param.dataIndex].product_date,data[param.dataIndex].product_date);
  });
  console.log("initCharts");
};

const refreshCharts = ()=>{
  myChart.setOption(option);
  console.log("refreshCharts");
}
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  height: 100vh;

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
    padding: 0 100px;
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
  }
  .ant-select-arrow {
    color: #264460;
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

<!-- <style lang="scss">
.dropdown-custom {
  background-color: #264460;
  .ant-select-item {
    color: #a1e1ff;
    font-size: 13px;
  }

  .ant-select-item-option-selected,
  .ant-select-item-option-active {
    color: #44f0e9;
    background-color: #264460;
  }
}
:deep(.ant-picker-panel-container) {
  background: #264460;
}
:deep(.ant-picker-dropdown) {
  .ant-picker-panel-container {
    background: #264460;
    .ant-picker-header {
    }
    .ant-picker-body {
      .ant-picker-content {
        .ant-picker-cell {
          color: red;
        }
        > thead {
          > tr {
            > th {
              color: red;
            }
          }
        }
      }
    }
    .ant-picker-footer {
    }
  }
}
</style> -->
