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
        <div class="chart-contain">
          <div id="chartTrans" style="height: 100%"></div>
          <div class="chart-title">工段产量</div>
        </div>
      </div>
      <div class="table-contain">
        <div class="table-title">一润批次列表</div>
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
        <div class="table-block">
          <a-table
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :columns="columns"
            :data-source="data"
            :pagination="false"
            :scroll="{ x: 'max-content' }"
            :row-class-name="
              (_record, index) =>
                index % 2 === 1 ? 'cell-normal' : 'cell-abnormal'
            "
          >
            <template #bodyCell="{ column, text, record }">
              <div class="base-cell">
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
  </main>
</template>

<script setup>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { ref, onMounted, reactive, computed } from "vue";

import { columns, data } from "@/utils/pageConfig.js";
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
const operations = [
  "新增",
  "编辑",
  "删除",
  "结束批次",
  "修改时间(联动)",
  "批次排序",
  "计算非稳定",
  "查看历史QI趋势",
];
let operate = ref("删除");

const state = reactive({
  selectedRowKeys: [],
  // Check here to configure the default column
  loading: false,
});
const hasSelected = computed(() => state.selectedRowKeys.length > 0);
const onSelectChange = (selectedRowKeys) => {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};
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
  console.log(selectedTitle.value);
};

function handlePageChange(pageInfo) {
  // 判断是否是点击事件
  const { current, pageSize, total } = pageInfo;
  console.log(
    `点击了第 ${current} 页，每页显示 ${pageSize} 条数据, 共${total}条数据`
  );
  paginationConfig.current = current;
}

const handleChange = (e) => {
  console.log(e);
};

const onClickOperate = (e) => {
  operate.value = e;
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

  .page-bottom {
    display: flex;

    .table-contain {
      position: relative;
      overflow: scroll;
      max-height: 620px;
      background-color: #072554;
      margin: 20px 20px 0 0;
      padding: 0 20px;
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
        height: 470px;
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
    height: 660px;
    padding: 0 20px;
    margin: 10px 0px 0 50px;
    .chart-contain {
      width: 360px;
      height: 305px;
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
