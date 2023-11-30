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
      >
        <div>{{ title }}</div>
        <div class="popup">
          <svg version="1.1" width="30px" height="75px">
            <line x1="0" y1="40" x2="30" y2="15" stroke="#1F4185" />
            <line x1="0" y1="40" x2="30" y2="25" stroke="#1F4185" />
          </svg>
          <div class="popup-label">
            <span>委托方：福建中烟工业有限责任公司</span>
            <span>牌号：福建三明尤溪ELC1CB1A-2023片烟</span>
            <span>开始时间：2023-10-25 09:33:30</span>
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
          <span>生产批次QI</span>
        </button>
      </div>
      <div class="chart-contain">
        <div id="QAChart" style="height: 100%"></div>
      </div>
    </div>
  </main>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, reactive } from "vue";
let echart = echarts;
const buttonTitles = ["一润", "二润", "打叶", "叶加酶", "叶复烤", "叶打包"];
let selectedTitle = ref("一润");
let currentTab = ref(1);
onMounted(() => {
  setTimeout(() => {
    initCharts();
  }, 200);
  window.onresize = () =>
    (() => {
      reloadCharts();
    })();
});
const reloadCharts = () => {
  var myChart = echart.init(document.getElementById("QAChart"));
  myChart.resize();
};

const onChangeTab = (tab) => {
  currentTab.value = tab;
  console.log(tab, currentTab.value);
};

const onClickProcess = (title) => {
  selectedTitle.value = title;
};
// 获取鼠标相对于元素的位置
function getMousePosition(event, element) {
  var rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

const initCharts = () => {
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
      data: [
        " 00:00",
        " 02:00",
        " 04:00",
        " 06:00",
        " 08:00",
        " 10:00",
        " 12:00",
        " 14:00",
        " 16:00",
        " 18:00",
        " 20:00",
        " 22:00",
      ],
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
        data: [85.33, 88, 89, 90, 82, 96, 96.01, 98.12, 79, 96.65, 98, 79],
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
  // 基于准备好的dom，初始化echarts实例
  var myChart = echart.init(document.getElementById("QAChart"));
  myChart.setOption(option);
  console.log("chart");
};
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
      background: 0 -4px / 20px 10px no-repeat url("icon-rects.png"),
        100% 0px / 10px 10px no-repeat url("icon-rect.png");
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
      background-image: url("basic-info-pending.png");
    }
    .button-box-unselected {
      background-image: url("basic-info-deal.png");
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
</style>
