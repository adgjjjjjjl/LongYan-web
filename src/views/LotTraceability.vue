<template>
  <main>
    <div class="top-header">
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
      <span>工段：</span>
      <a-select
        v-model:value="working"
        dropdownClassName="picker"
        style="width: 150px"
        :options="workingProcess"
        @focus="focus"
        @change="handleChange"
        ><template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <span>委托方：</span>
      <a-select
        v-model:value="delegate"
        dropdownClassName="picker"
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
        v-model:value="productNumber"
        dropdownClassName="picker"
        style="width: 100px"
        :options="optionsProd"
        @focus="focus"
        @change="handleChange"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <span>批次号：</span>
      <a-select
        v-model:value="group"
        dropdownClassName="picker"
        style="width: 80px"
        :options="optionsGroup"
        @focus="focus"
        @change="handleChange"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <span>箱号：</span>
      <a-select
        v-model:value="boxId"
        style="width: 80px"
        :options="boxNumbers"
        @focus="focus"
        @change="handleChange"
      >
        <template #suffixIcon>
          <div class="selector-suffix" />
        </template>
      </a-select>
      <button class="search" @click="searchBatch">查批次号</button>
      <button class="search" @click="onSearch">查询</button>
    </div>
    <div class="part-block">
      <div class="woking-steps-block">
        <QualityTrace :data="statusData" />
      </div>
      <div class="table-contain">
        <div class="icon-left-rects" />
        <div class="icon-right-rects" />
        <div class="table-title">异常汇总</div>
        <div class="table-block">
          <a-table
            :columns="columns"
            :data-source="data"
            :pagination="false"
            :scroll="{ x: 'max-content', y: 240 }"
            :row-class-name="
              (_record, index) =>
                index !== 2 ? 'cell-normal' : 'cell-abnormal'
            "
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
              :columns="columns"
              :data-source="data"
              :pagination="false"
              :scroll="{ x: 'max-content', y: 300 }"
              :row-class-name="
                (_record, index) =>
                  index !== 2 ? 'cell-normal' : 'cell-abnormal'
              "
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
    </div>
  </main>
</template>

<script setup>
import QualityTrace from "../components/qualityTracebility.vue";
import dayjs from "dayjs";
import { ref, onMounted, reactive, computed } from "vue";
import {
  workingProcess,
  tableConfig,
  columns,
  data,
  statusData,
} from "@/utils/LotTraceability";
import * as echarts from "echarts";
let echart = echarts;
const dateFormat = "YYYY-MM-DD";
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
let working = ref("3");
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
const boxNumbers = ref([
  {
    value: "1",
    label: "箱号1",
  },
  {
    value: "2",
    label: "箱号2",
  },
]);
let boxId = ref("1");
// 底部左侧按钮
const bottomButtons = computed(() => Object.keys(tableConfig));
//选中的按钮标题
let activateMainStatus = ref("物料");
// 选中的按钮标题对应的子标题
const statusButtons = computed(() => {
  return tableConfig[activateMainStatus.value];
});
const showTemperatureChart = computed(
  () => activateMainStatus.value == "环境温湿度"
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
});

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
// 选择器选项变化事件
const handleChange = (e) => {
  // console.log(e);
};
// 查询批次号
const searchBatch = (e) => {
  // console.log(e);
};
// 查询
const onSearch = (e) => {
  // console.log(e);
};

const onClickProcess = (title) => {
  activateMainStatus.value = title;
  activateStatus.value = statusButtons.value[0];
  const temperatureChart = echart.init(
    document.getElementById("temperatureChart")
  );
  temperatureChart.resize();
};
const onClickTitle = (e) => {
  activateStatus.value = e;
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
  var myChart = echart.init(document.getElementById("temperatureChart"));
  myChart.setOption(option);
  console.log("chart");
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
        background-image: url("basic-info-pending.png");
        color: #fff3e6;
      }
      .button-box-unselected {
        background-image: url("basic-info-deal.png");
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
      width: 320px;
      height: 320px;
      flex-shrink: 0;
      background: 0 0 / 100% 100% no-repeat url("quality-bg.png");
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
      height: 320px;
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
      width: 140px;
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
