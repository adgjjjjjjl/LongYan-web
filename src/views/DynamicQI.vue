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
        @click="onClickProcess(title)"
        @mouseover="onOverProcess(title)"
      >
        <div>{{ title }}</div>
        <div class="popup">
          <svg version="1.1" width="30px" height="75px">
            <line x1="0" y1="40" x2="30" y2="15" stroke="#1F4185" />
            <line x1="0" y1="40" x2="30" y2="25" stroke="#1F4185" />
          </svg>
          <div class="popup-label">
            <span>委托方：{{companyname}}</span>
            <span>牌号：{{brandname}}</span>
            <span>批次：{{batchStr}}</span>
            <span>开始时间：{{starttime}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-box">
      <div class="toolbar">
        <button
          :class="[currentTab == 2 ? 'button-base' : 'button-selected']"
          @click="(e) => onChangeTab(1)"
        >
          <span>工段实时QI</span>
        </button>
        <button
          :class="[currentTab == 1 ? 'button-base' : 'button-selected']"
          @click="(e) => onChangeTab(2)"
        >
          <span>参数实时QI</span>
        </button>
      </div>
      <div class="chart-contain" style="overflow-y: auto;">
        <div id="QAChart" style="height: 100%" v-show="isQAChartVisible"></div>
        <div id="ParamChart" style="height: 100%" v-show="isParamChartVisible">
            <div 
            v-for="p in paramsInfo"
            :key="p.id"
            :id="p.id"
            style="height: 300px"
            >
            </div>
        </div>
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
import { ref, onMounted, reactive } from "vue";
import {getFactoryInfo,getFactoryQI,getParamQI,getParamsInfo} from '../api/request';

let url = ref("");
const visible = ref(false);
const maxPointCount = 30;

let echart = echarts;
const buttonTitles = ["一润", "二润", "打叶", "叶加酶", "叶复烤", "叶打包"];
const buttonTitlesMapping = {"一润":6, "二润":7, "打叶":8, "叶加酶":9, "叶复烤":10, "叶打包":11};
const taskIdMapping = {"一润":"yr", "二润":"er", "打叶":"dy", "叶加酶":"yjm", "叶复烤":"yfk", "叶打包":"ydb"};
let selectedTitle = ref("一润");
let currentTab = ref(1);
let companyname = ref("");
let brandname = ref("");
let starttime = ref("");
let batch = ref("");
let batchStr = ref("");
let paramsInfo = ref([]);
let data = null;
let option2Mapping = {};
let isQAChartVisible = true;
let isParamChartVisible = false;

onMounted(() => {
  window.onresize = () =>
    (() => {
      reloadCharts();
    })();
  loadFactoryInfo(selectedTitle.value,true);
});

const reloadCharts = () => {
  if(currentTab.value == 1){
    var myChart = echart.init(document.getElementById("QAChart"));
    myChart.resize();
  }
  else{
    let paramsInfoChart;
    for(let i=0;i<paramsInfo.value.length;i++){
      paramsInfoChart = echart.init(document.getElementById(paramsInfo.value[i].id));
      paramsInfoChart.resize();
    }
  }
};

const onChangeTab = (tab) => {
  currentTab.value = tab;
  console.log(tab, currentTab.value);
  if(tab == 1){
    isQAChartVisible = true;
    isParamChartVisible = false;
    loadFactoryQI();
  }
  else{
    isQAChartVisible = false;
    isParamChartVisible = true;
    loadParamsInfo();
  }
};

function loadParamsInfo(){
  if(paramsInfo.value.length == 0){
    getParamsInfo(batch.value,buttonTitlesMapping[selectedTitle.value]).then(res=>{
      if(res.data.length>0){
        for(let i=0;i<res.data.length;i++){
          paramsInfo.value.push(res.data[i]);
          option2Mapping[res.data[i].id] = JSON.parse(JSON.stringify(option2));
        }
        loadParamQI();
      }
    });
  }
}

function loadParamQI(){
  for(let i= 0;i<paramsInfo.value.length;i++){
    getParamQI(batch.value,paramsInfo.value[i].id).then(res=>{
      let data1 = [];
      if(typeof res.data == "string"){
        data1 = eval("("+res.data+")");
      }
      else{
        data1 = res.data;
      }
      //console.log(data);
      option2Mapping[paramsInfo.value[i].id]["series"][0]["name"] = paramsInfo.value[i].name;
      for(let j=0;j<data1.length;j++){
        if(data1.length > maxPointCount){
          if(j%Math.ceil(data1.length/maxPointCount) == 0){
            option2Mapping[paramsInfo.value[i].id]["xAxis"]["data"].push(data1[j].x);
            option2Mapping[paramsInfo.value[i].id]["series"][0]["data"].push(parseFloat(data1[j].y).toFixed(0));
          }
        }
        else{
          option2Mapping[paramsInfo.value[i].id]["xAxis"]["data"].push(data1[j].x);
          option2Mapping[paramsInfo.value[i].id]["series"][0]["data"].push(parseFloat(data1[j].y).toFixed(0));
        }
      }
      initCharts(paramsInfo.value[i].id);
      connectWebSocketByTaskId(paramsInfo.value[i].id);
    })
  }
}

const onClickProcess = (title) => {
  if(title != selectedTitle.value){
    closeWebSockets();
    paramsInfo.value.length = 0;
    option2Mapping = {};
    paramsInfoChart = {}
    data = null;
    selectedTitle.value = title;
    loadFactoryInfo(selectedTitle.value,true);
  }
};

function loadFactoryQI(){
  if(data == null){
    option["xAxis"]["data"].length = 0;
    option["series"][0]["data"].length = 0;
    getFactoryQI(batch.value).then(res=>{
      if(typeof res.data == "string"){
        data = eval("("+res.data+")");
      }
      else{
        data = res.data;
      }
      //console.log(data);
      option["series"][0]["name"] = selectedTitle.value;
      for(let i=0;i<data.length;i++){
        if(data.length > maxPointCount){
          if(i%Math.ceil(data.length/maxPointCount) == 0){
            option["xAxis"]["data"].push(data[i].x);
            option["series"][0]["data"].push(parseFloat(data[i].y).toFixed(0));
            batchMapping[data[i].x] = batch.value;
          }
        }
        else{
          option["xAxis"]["data"].push(data[i].x);
          option["series"][0]["data"].push(parseFloat(data[i].y).toFixed(0));
          batchMapping[data[i].x] = batch.value;
        }
      }
      initCharts();
      connectWebSocketByTaskId(taskIdMapping[selectedTitle.value]);
    });
  }
}

const onOverProcess = (title) => {
  loadFactoryInfo(title,false);
};

function loadFactoryInfo(title,isLoadQI){
  getFactoryInfo(buttonTitlesMapping[title]).then(res=>{
     if(res.data.length>0){
       companyname.value = res.data[0].companyname;
       brandname.value = res.data[0].brandname;
       starttime.value = res.data[0].starttime;
       batchStr.value = res.data[0].batch;
     }
     else{
       companyname.value = "";
       brandname.value = "";
       starttime.value = "";
       batchStr.value = "";
     }
     if(isLoadQI){
       if(res.data.length>0){
         batch.value = res.data[0].batch;
       }
       else{
         batch.value = "";
       }

       if(currentTab.value == 1){
         loadFactoryQI();
       }
       else{
         loadParamsInfo();
       }
     }
  });
}

// 获取鼠标相对于元素的位置
function getMousePosition(event, element) {
  var rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

const option = {
    xAxis: {
      boundaryGap: ["10%", "10%"],
      type: "category",
      axisTick: { inside: true },
      splitNumber: 12,
      axisLine: {
        lineStyle: {
          color: "#4471A4",
        },
      },
      data:[]
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
    legend:{
      show:true,
      top:15,
      itemWidth:15,
      itemHeight:10,
      textStyle:{
        color:"white"
      }
    },
    series: [
      {
        data:[],
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
var paramsInfoChart = {};
const option2 = JSON.parse(JSON.stringify(option));
const batchMapping = {};

const initCharts = (id) => {
  // 基于准备好的dom，初始化echarts实例
  if(currentTab.value == 1) {
    myChart = echart.init(document.getElementById("QAChart"));
    myChart.setOption(option);
    myChart.on("click",function(param){
      let datatime = option["xAxis"]["data"][param.dataIndex];
      toNextPage(batchMapping[datatime], datatime);
    });
    console.log("initCharts");
  }
  else{
      paramsInfoChart[id] = echart.init(document.getElementById(id));
      paramsInfoChart[id].setOption(option2Mapping[id]);
      paramsInfoChart[id].on("click",function(param){
          toNextPage2(batch.value,id,paramsInfo.value[i].name);
      });
      console.log("initParamsInfoCharts");
  }
};

const toNextPage = (batch,datatime) => {
  showModal("../systems/formconfig/listeditor.jsp?rid=257&xformIdx=276&showTitle=false&queryType=report&batch="+batch+"&closecswindow=false&datatime="+datatime);
};

const toNextPage2 = (batch,code,tagname) => {
  showModal("../systems/formconfig/chart.jsp?jid=161&batch="+batch+"&code="+code+"&name="+tagname+"&title="+batch+"&type=line&dataLabels=false&turboThreshold=3000");
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

const refreshCharts= () => {
  if(currentTab.value == 1) {
    myChart.setOption(option);
    console.log("refreshCharts");
  }
  else{
    for(let i=0;i<paramsInfo.value.length;i++){
      paramsInfoChart[paramsInfo.value[i].id].setOption(option2Mapping[paramsInfo.value[i].id]);
      console.log("refreshParamsInfoCharts");
    }
  }
}

const closeWebSockets = ()=> {
  if(websocket[taskIdMapping[selectedTitle.value]]){
    websocket[taskIdMapping[selectedTitle.value]].close();
  }
  for(let i=0;i<paramsInfo.value.length;i++){
    if(websocket[paramsInfo.value[i].id]){
      websocket[paramsInfo.value[i].id].close();
    }
  }
}

var websocket = {};

const connectWebSocketByTaskId = (taskid) => {
  //判断当前浏览器是否支持WebSocket
  if ('WebSocket'in window) {
      if(websocket[taskid]){
        websocket[taskid].close();
      }
      // var url='ws://localhost:10039/ws/webdata/'+tasktype+'/'+taskid;
      var url = 'ws://10.190.55.134:10039/ws/webdata/qitrendshow/' + taskid;
      websocket[taskid] = new WebSocket(url);

      //连接发生错误的回调方法
      websocket[taskid].onerror = function() {
          console.log('连接发生错误!');
      };

      //连接成功建立的回调方法
      websocket[taskid].onopen = function() {
          console.log('连接成功!');
      };

      //接收到消息的回调方法
      websocket[taskid].onmessage = function(event) {
          var dataobjarray = eval("(" + event.data + ")");
          for (var i in dataobjarray) {
            if(option2Mapping[dataobjarray[i].valpoint]){
              option2Mapping[dataobjarray[i].valpoint]["xAxis"]["data"].push(dataobjarray[i].datatime);
              option2Mapping[dataobjarray[i].valpoint]["series"][0]["data"].push(parseFloat(dataobjarray[i].weightqi).toFixed(0));
            }
            else{
              option["xAxis"]["data"].push(dataobjarray[i].datatime);
              option["series"][0]["data"].push(parseFloat(dataobjarray[i].weightqi).toFixed(0));
              batchMapping[dataobjarray[i].datatime] = dataobjarray[i].batch;
            }
          }
          refreshCharts();
      };

      //连接关闭的回调方法
      websocket[taskid].onclose = function() {
        console.log('连接关闭!');
      };
  } else {
      alert('当前浏览器不支持websocket');
  }
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
    .toolbar {
      display: flex;
      font-size: 14px;
      .button-base {
        color: #3383c8;
        cursor: pointer;
        border: none;
        padding: 2px 25px;
        background: center center / 100% 100% no-repeat
          url("@/assets/icon-diamond.png");
      }
      .button-selected {
        cursor: pointer;
        color: #fff;
        border: none;
        padding: 2px 25px;
        background: center center / 100% 100% no-repeat
          url("@/assets/icon-diamond-s.png");
      }
    }

    .chart-contain {
      height: calc(100% - 50px);
      margin-top: 20px;
      // border-top: 20px solid transparent;
      box-sizing: border-box;
      background: 0 -4px / 20px 10px no-repeat url("/icon-rects.png"),
        100% 0px / 10px 10px no-repeat url("/icon-rect.png");
      background-color: #5684bc10;
    }
  }

  .top-header {
    background: center center / 100% 100% no-repeat
      url("@/assets/top-bg-qi.png");
    height: 140px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    padding: 30px 260px;
    justify-items: center;
    align-items: center;

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
