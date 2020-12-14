<template>
    <rv-gauge :values="rvGaugeData"  :colors="['black']"/> <!-- :colors="['black']" -->
</template>

<script>
import RvGauge from './RVGauge.vue'

export default {
  name: 'App',
  components: {
    RvGauge
  },
  data() {
    return {
      rvGaugeData: {
        value: '51',
        setpoint: '49',
        min: '30',
        max: '89'
      }
    }
  }
}
</script>

<style scoped>
#rvgauge {
  width: 45%;
}
</style>
