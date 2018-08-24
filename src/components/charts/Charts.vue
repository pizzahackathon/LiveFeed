<template>
  <div class="is-fluid">
    <div class="box">
      <h3 class="price-header">BTC Price - <span class="price">{{btcCurrentPrice}}</span> <span class="price-diff gain" v-bind:class="{ lost: btcPercentChange24h < 0 }">({{btcPercentChange24h}}%)</span></h3>
      <canvas id="btc-chart"></canvas>
    </div>
    <div class="box">
      <h3 class="price-header">ETH Price - <span class="price">{{ethCurrentPrice}}</span> <span class="price-diff gain" v-bind:class="{ lost: ethPercentChange24h < 0 }">({{ethPercentChange24h}}%)</span></h3>
      <canvas id="eth-chart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import axios from 'axios'
import config from '@/config.js'
import moment from 'moment'

export default {
  name: 'ChartComponent',
  data () {
    return {
      samples: 0,
      speed: 0,
      timeout: 0,
      values: [],
      charts: [],
      value: 0,
      scale: 1,
      btcValues: [],
      ethValues: [],
      instance: null,
      btcMinPrice: config.chart.btcMin,
      btcMaxPrice: config.chart.btcMax,
      ethMinPrice: config.chart.ethMin,
      ethMaxPrice: config.chart.ethMax,
      btcCurrentPrice: 0,
      ethCurrentPrice: 0,
      btcPercentChange24h: 0,
      ethPercentChange24h: 0
    }
  },
  async mounted () {
    this.instance = axios.create({
      baseURL: config.chart.endPoint,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.samples = 2000
    this.speed = 250
    this.addEmptyValues(this.btcValues, this.samples)
    this.addEmptyValues(this.ethValues, this.samples)
    this.initialize()
    if (config.isProd) {
      this.runChartPriceProd()
    } else {
      this.runChartPriceDev()
    }
  },
  methods: {
    async runChartPriceDev () {
      for (let i = 0; i < 100; i++) {
        this.advance()
        await this.sleep(10)
      }
    },
    async runChartPriceProd () {
      for (;;) {
        this.advance()
        await this.sleep(10)
      }
    },
    initialize () {
      this.charts.push(new Chart(document.getElementById('btc-chart'), {
        type: 'line',
        data: {
          datasets: [{
            data: this.btcValues,
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          animation: {
            duration: this.speed * 1.5,
            easing: 'linear'
          },
          legend: false,
          scales: {
            xAxes: [{
              type: 'time',
              display: true
            }],
            yAxes: [{
              ticks: {
                max: this.btcMaxPrice,
                min: this.btcMinPrice,
                stepSize: 0.25
              }
            }]
          }
        }
      }), new Chart(document.getElementById('eth-chart'), {
        type: 'line',
        data: {
          datasets: [{
            data: this.ethValues,
            backgroundColor: 'rgba(0, 71, 187, 0.1)',
            borderColor: 'rgb(0, 71, 187)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          animation: {
            duration: this.speed * 1.5,
            easing: 'linear'
          },
          legend: false,
          scales: {
            xAxes: [{
              type: 'time',
              display: true
            }],
            yAxes: [{
              ticks: {
                max: this.ethMaxPrice,
                min: this.ethMinPrice,
                stepSize: 0.25
              }
            }]
          }
        }
      }))
    },
    addEmptyValues (arr, n) {
      for (var i = 0; i < n; i++) {
        arr.push({
          x: moment().subtract((n - i) * this.speed, 'milliseconds').toDate(),
          y: null
        })
      }
    },
    updateCharts () {
      this.charts.forEach(
        (chart) => {
          // chart.config.options.scales.yAxes[0].ticks.max = this.ethMaxPrice
          // console.log('chart: ', chart.canvas.id)
          if (chart.canvas.id === 'btc-chart') {
            chart.config.options.scales.yAxes[0].ticks.max = this.btcMaxPrice
            chart.config.options.scales.yAxes[0].ticks.min = this.btcMinPrice
          }else if (chart.canvas.id === 'eth-chart') {
            chart.config.options.scales.yAxes[0].ticks.max = this.ethMaxPrice
            chart.config.options.scales.yAxes[0].ticks.min = this.ethMinPrice
          }
          chart.update()
        }
      )
    },
    progressBTCPrice () {
      this.loadData('1/').then(
        (data) => {
          var price = data.quotes.USD.price
          this.btcValues.push({
            x: new Date(),
            y: price
          })
          this.btcCurrentPrice = price
          this.btcMaxPrice = price + 2.25
          this.btcMinPrice = price - 2.25
          this.btcValues.shift()

          this.btcPercentChange24h = data.quotes.USD.percent_change_24h
        }
      )
    },
    progressETHPrice () {
      this.loadData('1027/').then(
        (data) => {
          var price = data.quotes.USD.price
          this.ethValues.push({
            x: new Date(),
            y: price
          })
          this.ethCurrentPrice = price
          this.ethMaxPrice = price + 2.25
          this.ethMinPrice = price - 2.25
          this.ethValues.shift()

          this.ethPercentChange24h = data.quotes.USD.percent_change_24h
        }
      )
    },
    advance () {
      if (this.values[0] !== null && this.scale < 4) {
        // rescale();
        this.updateCharts()
      }
      
      this.progressBTCPrice()
      this.progressETHPrice()
      this.updateCharts()
    },
    sleep (time) {
      return new Promise(resolve => setTimeout(resolve, time * 1000))
    },
    async loadData (endpoint) {
      const response = await this.instance.get(endpoint)
      return response.data.data
    }
  }
}
</script>

<style>
.price-header {
  font-size: 2em;
  font-weight: bold;
}

.price {
  font-weight: bold;
}

.price-diff {
  font-weight: bold;
  margin-left: 12px;
}

.gain {
  color: green;
}

.lost {
  color: red;
}
</style>
