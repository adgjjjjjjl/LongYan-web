<template>
  <div class="body-bottom">
    <div class="box-block">
      <div class="box-with-popup" style="top: 4%; left: 7%" @click="loadBatchData('高架库出库')">
        <div class="box button-hor" :style="shadowStyle('高架库出库')">
          高架库出库
        </div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("高架库出库", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 4%; left: 44%" @click="loadBatchData('翻箱喂料')">
        <div class="box button-hor" :style="shadowStyle('翻箱喂料')">
          翻箱喂料
        </div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("翻箱喂料", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 4%; left: 83%" @click="loadBatchData('一润')">
        <div
          class="box button-ver"
          style="height: 80px"
          :style="shadowStyle('一润')"
        >
          一润
        </div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("一润", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 33%; left: 83%" @click="loadBatchData('碎片复烤')">
        <div class="box button-ver" :style="shadowStyle('碎片复烤')">
          碎片复烤
        </div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("碎片复烤", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 68%; left: 83%" @click="loadBatchData('碎片打包')">
        <div class="box button-ver" :style="shadowStyle('碎片打包')">
          碎片打包
        </div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("碎片打包", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 37%; left: 15%" @click="loadBatchData('叶加酶')" >
        <div class="box button-ver" :style="shadowStyle('叶加酶<')">叶加酶</div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("叶加酶", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 72%; left: 15%" @click="loadBatchData('烟梗打包')">
        <div class="box button-ver" :style="shadowStyle('烟梗打包')">
          烟梗打包
        </div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("烟梗打包", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 72%; left: 42%" @click="loadBatchData('烟梗复烤')">
        <div class="box button-ver" :style="shadowStyle('烟梗复烤')">
          烟梗复烤
        </div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("烟梗复烤", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 49%; left: 61%" @click="loadBatchData('叶复烤')">
        <div class="box button-ver" :style="shadowStyle('叶复烤')">叶复烤</div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("叶复烤", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 37%; left: 42%" @click="loadBatchData('打叶')">
        <div class="box button-leaf" :style="shadowStyle('打叶')">打叶</div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("打叶", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 19%; left: 44%" @click="loadBatchData('二润')">
        <div class="box button-hor" :style="shadowStyle('二润')">二润</div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("二润", name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="box-with-popup" style="top: 85%; left: 55%" @click="loadBatchData('叶打包')">
        <div class="box button-hor" :style="shadowStyle('叶打包')">叶打包</div>
        <div class="popup">
          <svg version="1.1" width="80px" height="100%">
            <circle
              cx="5"
              cy="75"
              r="2"
              fill="#D8AA2D"
              stroke="#D8AA2D"
              stroke-width="2"
            ></circle>
            <line x1="5" y1="75" x2="50" y2="30" stroke="#D8AA2D" />
            <line x1="50" y1="30" x2="80" y2="30" stroke="#D8AA2D" />
          </svg>
          <div class="popup-label">
            <div v-for="name in attrNames" :key="name">
              {{ getDataStatus("叶打包", name) }}
            </div>
          </div>
        </div>
      </div>
      <!-- 箭头样式 -->
      <div class="arrow-base arrow-2" style="top: 5%; left: 35%" />
      <div class="arrow-base arrow-2" style="top: 5%; left: 72%" />
      <div class="arrow-base arrow-3" style="top: 20%; left: 72%" />
      <div class="arrow-base arrow-down" style="top: 30%; left: 46%" />
      <div class="arrow-base arrow-down" style="top: 77%; left: 64%" />
      <div class="arrow-base arrow-2" style="top: 50%; left: 74%" />
      <div class="arrow-yellow arrow-down" style="top: 60.5%; left: 85%" />
      <div class="arrow-base arrow-3" style="top: 42%; left: 28%; width: 10%" />
      <div class="arrow-gold arrow-3" style="top: 85%; left: 28%; width: 10%" />
      <div class="arrow-base arrow-1" style="top: 58%; left: 28%; width: 30%" />
      <div
        class="arrow-yellow arrow-1"
        style="top: 38%; left: 59%; width: 19%"
      />
      <div
        class="arrow-gold arrow-down-2"
        style="top: 56%; left: 45%; height: 14%"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";

const emit = defineEmits(["loadData"]);

let props = defineProps({
  data: {
    type: Array, //接受的数据类型
    default: () => [], //接受默认数据
  },
  data2: {
    type: Object, //接受的数据类型
    default: () => {}, //接受默认数据
  },
});
const attrNames = [
  "principal",
  "trademark",
  "team",
  "shift",
  "batch",
  "start",
  "end",
  "score",
];
let attrNamesMapping = {
  "principal":"委托方",
  "trademark":"牌号",
  "team":"班组",
  "shift":"班次",
  "batch":"批次",
  "start":"开始时间",
  "end":"结束时间",
  "score":"得分",
}
let processedData = computed(() => {
  return props.data.map((data) => {
    // 更具数据生成对样样式
    const style = shadowStyle(data.status);
    return { ...data, style };
  });
});
onMounted(() => {
  console.log(processedData.value);
});
const getDataStatus = (key, attr) => {
  const itemStatus = processedData.value.find((e) => e.key === key);
  // console.log(key, itemStatus[attr]);
  if(itemStatus){
    return attrNamesMapping[attr] + "：" + (itemStatus[attr] == null ? "":itemStatus[attr]);
  }
  else{
    return "";
  }
};

const shadowStyle = (key) => {
  let item = props.data.find((e) => e.key == key);
  if (!item) {
    return {
      backgroundColor: "rgb(50, 86, 77)",
      boxShadow: `2px 2px 2px 1px rgb(50, 86, 77)`,
    };
  }
  const status = item.status;
  let color = "red";
  if (status === "停机") {
    color = "rgb(145, 9, 21)";
  } else if (status === "未生产") {
    color = "rgb(50, 86, 77)";
  } else if (status === "生产") {
    color = "rgb(61, 140, 14)";
  } else if (status === "完成") {
    color = "rgb(135, 78, 15)";
  } else if (status === "料头") {
    color = "rgb(21, 114, 136)";
  } else if (status === "料尾") {
    color = "rgb(23, 174, 169)";
  }
  return { backgroundColor: color, boxShadow: `2px 2px 2px 1px ${color}` };
};

const loadBatchData = (key) =>{
  emit("loadData",processedData.value.find((e) => e.key === key));
}
</script>

<style lang="scss" scoped>
.body-bottom {
  height: 100%;
  width: 100%;
  background: 0 0 / 100% 100% no-repeat url("/quality-bg.png");
  .box-block {
    height: 100%;
    width: 100%;
    position: relative;
    font-size: 12px;

    .arrow-base {
      height: 20px;
      background-color: aquamarine;
      position: absolute;
    }

    .arrow-yellow {
      height: 20px;
      background-color: #f3de1b;
      position: absolute;
    }

    .arrow-gold {
      height: 20px;
      background-color: #f4a214;
      position: absolute;
    }

    .arrow-1 {
      width: 8%;
      clip-path: polygon(
        0 35%,
        80% 35%,
        80% 0,
        100% 50%,
        80% 100%,
        80% 65%,
        0 65%
      );
    }

    .arrow-2 {
      width: 7%;
      clip-path: polygon(
        0 35%,
        70% 35%,
        70% 0,
        100% 50%,
        70% 100%,
        70% 65%,
        0 65%
      );
    }

    .arrow-3 {
      width: 7%;
      clip-path: polygon(
        0 50%,
        30% 0%,
        30% 35%,
        100% 35%,
        100% 65%,
        30% 65%,
        30% 100%
      );
    }

    .arrow-down {
      width: 5%;
      height: 6%;
      clip-path: polygon(
        35% 0,
        65% 0,
        65% 50%,
        100% 50%,
        50% 100%,
        0 50%,
        35% 50%
      );
    }

    .arrow-down-2 {
      width: 5%;
      clip-path: polygon(
        35% 0,
        65% 0,
        65% 70%,
        100% 70%,
        50% 100%,
        0 70%,
        35% 70%
      );
    }
  }

  .box-with-popup {
    position: absolute;
    color: white;
    cursor: pointer;
  }

  .box {
    width: 100%;
    height: 100%;
    white-space: nowrap;
  }

  .button-hor {
    padding: 5px 5px 5px;
    width: 80px;
    font-weight: 500;
    letter-spacing: 2px;
    font-weight: 500;
    text-align: center;
    color: #fff;
    font-weight: 500;
    background-color: rgba(72, 173, 174, 1);
  }

  .button-ver {
    height: 82px;
    writing-mode: vertical-rl;
    letter-spacing: 2px;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 5px;
    font-family: OPPOSans;
    color: #fff;
    font-weight: 500;
    background-color: rgba(52, 119, 141, 1);
  }

  .button-leaf {
    padding: 10px 10px;
    height: 55px;
    writing-mode: vertical-rl;
    text-align: center;
    font-weight: 500;
    letter-spacing: 4px;
    font-weight: 500;
    background-color: rgba(52, 119, 141, 1);
  }

  .popup {
    position: absolute;
    width: 320px;
    opacity: 0;
    top: -60px;
    left: 60%;
    pointer-events: none;
    display: flex;
    // background-color: red;
  }

  .popup-label {
    background: #041430;
    border: 1px solid #d8aa2d;
    opacity: 0.88;
    border-radius: 15px;
    white-space: nowrap;
    color: white;
    font-size: 12px;
    padding: 5px 10px;
  }

  .box-with-popup:hover .popup {
    opacity: 1;
    pointer-events: auto;
    z-index: 999;
  }
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  display: flex;
  height: 45px;
  text-shadow: #fff 1px 0 10px;

  .left {
    background: center center / 100% 100% no-repeat url("/title-left.png");
    width: 10%;
    min-width: 40px;
  }

  .mid {
    background: center center / 100% 100% no-repeat url("/title-mid.png");
    padding: 0 10px;
  }

  .right {
    background: center center / 100% 100% no-repeat url("/title-right.png");
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: flex-end;
    padding-bottom: 2px;

    .button-base {
      background: linear-gradient(to right, #0346d9, #095da5);
      clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%);
      padding: 0 20px;
      font-size: 14px;
      color: #fff;
    }

    .button-one {
      margin-right: 10px;
    }

    .button-two {
      margin-left: 20px;
    }
  }
}
</style>
