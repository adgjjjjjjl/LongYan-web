<template>
  <main>
    <div id="myElement" class="top-header">
      <span>开始日期：</span>
      <a-date-picker
        v-model:value="dateStart"
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
        @change="handleChange"
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
        style="width: 120px"
        :options="optionsProd"
        @focus="focus"
        @change="handleChange"
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
        @change="handleChange"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <button class="search" @click="searchBatch">查询批次号</button>
      <button class="search" @click="onSearch">查询</button>
    </div>
    <div class="chart-box">
      <div class="chart-contain">
        <div id="QAChart" style="height: 100%"></div>
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
let dateEnd = ref(dayjs("2015-06-06", dateFormat));
const optionsDelegate = ref([
  {
    value: "1",
    label: "福建中烟工业有限责任公司1",
  },
  {
    value: "2",
    label: "福建中烟工业有限责任公司2",
  },
]);
let delegate = ref("1");
const optionsProd = ref([
  {
    value: "1",
    label: "福建PC3",
  },
  {
    value: "2",
    label: "福建PC4",
  },
]);
let productNumber = ref("1");
const optionsGroup = ref([
  {
    value: "1",
    label: "全部",
  },
  {
    value: "2",
    label: "福建1",
  },
]);
let group = ref("1");

onMounted(() => {
  setTimeout(() => {
    initCharts();
  }, 200);
  window.onresize = () =>
    (() => {
      reloadCharts();
    })();
});
// 缩放后重新渲染折线图
const reloadCharts = () => {
  var myChart = echart.init(document.getElementById("QAChart"));
  myChart.resize();
};
// 选择器选中事件
const focus = (e) => {
  console.log(e);
};
// 选择器选项变化事件
const handleChange = (e) => {
  console.log(e);
};
// 查询批次号
const searchBatch = (e) => {
  console.log(e);
};
// 查询
const onSearch = (e) => {
  console.log(e);
};
// 时间选择事件
const dateChange = (date, dateString) => {
  console.log(dateString);
};
// 初始化折线图
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
    }

    // > * {
    //   margin-right: 10px;
    // }
    .picker {
      margin-right: 10px;
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
      font-size: 15px;
      cursor: pointer;
      white-space: nowrap;
    }

    .calendar {
      margin-right: 20px;
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
