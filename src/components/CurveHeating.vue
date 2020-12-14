<template>
  <div id="curve" class="widget">
    <curve :values="curveData" :fahrenheit="false" :disabled="false" :colors="['red']" />    <!--  :icons="['fc_day.svg', 'fc_thermo_unit.svg']" -->
  </div>  
</template>

<script>
import Curve from './Curve.vue'

export default {
  name: 'App',
  components: {
    Curve
  },
  data() {
    return {
      // example curve data
      curveData: {
        today: 21,
        days: [0, 7, 28, 42, ],
        series: [
          {
            type: 'Temperature',
            values: ['33', '28.1', '21.1', '20.3', '22.9']
          },
        ]
      },
    }
  },
}
</script>

<style scoped>
#component {
  position:relative;
  width: 95%;
}
</style>
