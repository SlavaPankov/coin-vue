<template>
  <Bar id="my-chart" :options="chartConfigOptions" :data="chartConfigData" />
</template>

<script>
import { MONTHS_LABELS } from "@/api/config";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BaseBar",
  components: { Bar },
  props: {
    config: {
      require: true,
      default: () => {},
    },
    currentAccount: {
      require: true,
      default: "",
    },
    monthCount: {
      default: 11,
    },
  },

  data() {
    return {
      chartData: {
        labels: ["January", "February", "March"],
        datasets: [{ data: [40, 20, 12] }],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },

  computed: {
    amountForMonths() {
      const temp = [];
      const result = [];

      for (let i = 0; i <= this.monthCount; i++) {
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - i);
        temp.push(
          this.config.filter((item) => {
            const month = new Date(item.date);
            return month.getMonth() === sixMonthAgo.getMonth();
          })
        );
      }

      temp.forEach((item) => {
        result.push(
          item.reduce(
            (a, b) => (b.from !== this.currentAccount ? a + b.amount : a + 0),
            0
          )
        );
      });

      return result.reverse();
    },

    months() {
      const values = [];
      const date = new Date();
      let currentMonth = date.getMonth();
      let flag = true;

      for (let i = currentMonth; i >= currentMonth - this.monthCount; i--) {
        values.push(MONTHS_LABELS[i]);
        if (i - this.monthCount < 0 && flag && i <= 0) {
          i = 12;
          flag = false;
        }

        if (values.length > this.monthCount) {
          break;
        }
      }

      return values.reverse();
    },

    chartConfigData() {
      return {
        labels: this.months,
        datasets: [
          {
            data: this.amountForMonths,
            borderColor: "#116ACC",
            backgroundColor: "#116ACC",
          },
        ],
      };
    },

    chartConfigOptions() {
      return {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Динамика баланса",
            padding: {
              bottom: 25,
            },
            align: "start",
            font: {
              size: 20,
              lineHeight: 1.2,
              weight: 700,
            },
            color: "rgba(0,0,0,1)",
            fullSize: true,
          },
        },
        scales: {
          x: {
            grid: {
              lineWidth: 0,
            },
          },
          y: {
            position: "right",
            min: 0,
            max: Math.max(...this.amountForMonths),
            ticks: {
              stepSize: Math.max(...this.amountForMonths),
            },
            grid: {
              lineWidth: 0,
            },
          },
        },
      };
    },
  },
};
</script>

<style scoped></style>
