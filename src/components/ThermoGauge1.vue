<template>
    <thermo-gauge :values="thermoGaugeData"  /><!--  name="°F"  :colors="['red', 'black', 'purple']"/>  -->
</template>

<script>
import ThermoGauge from './ThermoGauge.vue'

export default {
  name: 'App',
  components: {
    ThermoGauge
  },
  data() {
    return {
      thermoGaugeData: {
        value: '19,7',
        setpoint: '19.4',
        min: '16.1',
        max: '28.4'
      }
    }
  },
}
</script>

<style scoped>
#thermogauge {
  width: 40%;
}

</style>
