<template>
    <cooling-graph :values="coolingGraphData" /> <!-- name="°F" :colors="['white']" -->
</template>

<script>
import CoolingGraph from './CoolingGraph.vue'

export default {
  name: 'App',
  components: {
    CoolingGraph
  },
  data() {
    return {
      coolingGraphData: {
        valueDegrees: '88.5',
        valueTime: '00m00s',
        setpoint: '90.5',
        band: '+7.0',
        min: '00m03s',
        max: '01m00s',
        hysteresis: true
      },
    }
  }
}
</script>

<style>
#coolinggraph {
  width: 95%;
}
</style>
