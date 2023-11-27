<template>
  <main>
    <div id="myElement" class="top-header">
      <div v-for="title in buttonTitles" :key="title" class="button-box">
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
      <div id="QAChart" style="height: 100%"></div>
    </div>
  </main>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, reactive } from "vue";
let echart = echarts;
const buttonTitles = ["一润", "二润", "打叶", "叶加酶", "叶复烤", "叶打包"];
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

// 获取鼠标相对于元素的位置
function getMousePosition(event, element) {
  var rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

const initCharts = () => {
  // // 示例用法
  // var element = document.getElementById("myElement");
  // element.addEventListener("mousemove", function (event) {
  //   var position = getMousePosition(event, element);
  //   console.log("鼠标相对于元素的位置：", position);
  // });
  const option = {
    xAxis: {
      boundaryGap: ["150%", "10%"],
      type: "category",
      axisTick: { inside: true },
      data: [
        "0:00",
        "3:00",
        "6:00",
        "9:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
      ],
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLabel: {
        formatter: "{value} ",
        color: "#999",
        fontSize: 11,
      },
      // minInterval: 1,
      axisTick: {
        // 刻度设置
        show: false, // 是否显示刻度
        alignWithLabel: true,
      },
      axisLine: {
        // 轴线设置
        show: false, // 是否显示坐标轴轴线
      },
      splitLine: { lineStyle: { color: "#8eeeff18" } },
    },
    grid: {
      // 整体表格布局
      left: 10,
      top: 20,
      right: 20,
      bottom: 0,
      containLabel: true,
    },
    series: [
      {
        data: [85, 88, 89, 90, 82, 96, 96, 98, 79],
        type: "line",
        smooth: false,
        showSymbol: true,
        symbol: "circle",
        label: {
          position: "top",
          show: true,
          color: "#00f6ff",
          fontSize: 12,
        },
        lineStyle: {
          width: 1,
          color: "#00F6FF",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#0176826a" },
            { offset: 1, color: "#01768200" },
          ]),
        },
        itemStyle: {
          color: "#ffffff00",
          borderColor: "#71df6f", //拐点边框颜色
          borderWidth: 1, //拐点边框大小
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
    flex: 1;
  }

  .top-header {
    background: center center / 100% 100% no-repeat url("top-header-wave.png");
    height: 140px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    padding: 30px 260px;
    justify-items: center;
    align-items: center;

    .button-box {
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      text-align: center;
      font-size: 17px;
      color: white;
      background-image: url("basic-info-deal.png");
      width: 130px;
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
