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
  </main>
</template>

<script setup>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { ref, onMounted, reactive } from "vue";
const dateFormat = "YYYY-MM-DD";
let echart = echarts;
let dateStart = ref(dayjs("2015-06-06", dateFormat));
const topTitles = [
  "高架库出库",
  "翻箱喂料",
  "一润",
  "二润",
  "打叶",
  "叶加酶",
  "叶复烤",
  "叶打包",
  "碎片复考",
  "碎片打包",
  "烟梗复考",
  "烟梗打包",
];
let selectedTitle = ref("一润");
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
  const chartTimer = echart.init(document.getElementById("chartTimer"));
  const chartTrans = echart.init(document.getElementById("chartTrans"));
  chartTrans.resize();
  chartTimer.resize();
};

const onClickTitle = (title) => {
  selectedTitle.value = title;
};

const handleChange = (e) => {
  console.log(e);
};

const searchBatch = (e) => {
  console.log(e);
};

const onSearch = (e) => {
  console.log(e);
};

const dateChange = (date, dateString) => {
  console.log(dateString);
};

const initCharts = () => {
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
      axisLabel: {
        formatter: function (value) {
          // 在需要换行的地方添加\n
          return value.split("*").join("\n");
        },
        fontSize: 9,
      },
      data: [
        "2023044-*2119yr",
        "2023044-*218yr",
        "2023044-*218yr",
        "2023044-*207yr",
        "2023044-*216yr",
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
      top: 80,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
    title: {
      text: "单位（分）",
      left: "10",
      top: "46",
      textStyle: {
        fontSize: 12,
        color: "#369CCB",
      },
    },
    series: [
      {
        data: [58.5, 56.5, 56.5, 56.5, 58.1],
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
  const chartTimer = echart.init(document.getElementById("chartTimer"));
  const chartTrans = echart.init(document.getElementById("chartTrans"));
  chartTimer.setOption(JSON.parse(JSON.stringify(option)));
  chartTrans.setOption(JSON.parse(JSON.stringify(option)));
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
    padding: 10px 20px;
    margin: 0px 50px;
    .chart-contain {
      width: 350px;
      height: 300px;
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
        left: 45px;
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
</style>

<style lang="scss"></style>
