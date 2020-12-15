<template>
  <div id="app">
    <div class="row">
      <div class="column">
        <h2>thermogauge</h2>
        <thermo-gauge-1  />
      </div>
      <div class="column">
        <h2>curve</h2>
        <curve-heating/>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <h2>rvgauge</h2>
        <rv-gauge-1/>
      </div>
      <div class="column">
        <h2>coolinggraph</h2>
        <cooling-graph-1/>
      </div>
    </div>
  </div>
</template>

<script>
import CurveHeating from './components/CurveHeating.vue'
import ThermoGauge1 from './components/ThermoGauge1.vue'
import CoolingGraph1 from './components/CoolingGraph1.vue'
import RvGauge1 from './components/RVGauge1.vue'

export default {
  name: 'App',
  components: {
    CurveHeating,
    ThermoGauge1,
    CoolingGraph1,
    RvGauge1
  },
  data() {
    return {
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.widget {
  margin: auto;
  border:1px solid black;
}

.row {
  margin-bottom: 25px;
}

.column {
  float: left;
  width: 50%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Responsive layout - when the screen is less than 600px wide, make the three columns stack on top of each other instead of next to each other */
@media screen and (max-width: 600px) {
  .column {
    width: 100%;
  }

}
</style>
