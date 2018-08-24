<template>
  <div id="app">
    <div class="header-bar">
      <img src="https://p-u.popcdn.net/attachments/images/000/010/730/large/Pizza_Hackathon_Logo.png?1532094493" class="logo-img">
      <span class="hashtag">#PIZZAHACKATHON</span>
    </div>
    <div class="container is-fluid">
      <div class="columns is-mobile is-desktop is-widescreen is-fullhd">
        <div class="column in-one-half" v-bind:class="{ hidden: priceHidden }">
            <ChartComponent/>
        </div>
        <div class="column in-one-quarter" v-bind:class="{ hidden: !priceHidden }">
        </div>
        <div class="column in-one-half">
          <TwitterComponent/>
        </div>
        <div class="column in-one-quarter" v-bind:class="{ hidden: !priceHidden }">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartComponent from './components/charts/Charts.vue'
import TwitterComponent from './components/twitter/Twitter'

export default {
  name: 'app',
  components: {
    ChartComponent,
    TwitterComponent
  },
  data () {
    return {
      priceHidden: true
    }
  },
  methods: {
    showPrice () {
      this.priceHidden = false;
    },
    hidePrice () {
      this.priceHidden = true;
    }
  },
  mounted () {
    var vm = this;
    window.addEventListener('keyup', function(event) {
      if (event.keyCode == 49) { 
        vm.showPrice();
      } else if (event.keyCode == 50) { 
        vm.hidePrice();
      }
    });
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header-bar {
  width: 100%;
  background-color: #ffdd57;
  height: 68px;
  margin-bottom: 16px;
  box-shadow: 0 0 10px #333!important
}

.logo-img {
  width: 56px;
  margin-top: 4px;
  margin-right: 12px;
  vertical-align: middle;
}

.hashtag {
  font-size: 2em;
  font-weight: bold;
  vertical-align: -webkit-baseline-middle;
}

.hidden {
  display: none !important;
}
</style>
