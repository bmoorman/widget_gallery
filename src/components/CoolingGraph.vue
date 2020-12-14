<template>
  <div id="coolinggraph" class="widget">
    <cooling-graph-svg id="svgout"/>
  </div>
</template>

<script>
// template SVG gets loaded as component (remember to set vue-svg-loader option prefixIds!)
// using Snap svg elements get dynamically manipulated through their id
import CoolingGraphSvg from '@/assets/coolinggraph.svg';
import Snap from 'snapsvg-cjs'

const prefix = 'coolinggraph-';

export default {
  name: 'CoolingGraph',
  components: {
    CoolingGraphSvg  
  },
  props: {
    values: {
      type: Object,
      required: true,
      default: function () {
        return {
          valueDegrees: '27.5',
          valueTime: '00m10s',
          setpoint: '23.1',
          band: '+6.0',
          min: '00m03s',
          max: '00m30s',
          hysteresis: false,
        }
      }
    },
    name: {
      type: String,
      required: false,
      default: '°C'
    },
    colors: {
      type: Array,
      required: false,
      default: function () {
        return [
          '#E0F0E8',  //background
        ];
      }
    },
  },
  data() {
    return {
    }
  },
  mounted () {
    // set id attribute on path as css otherwise stops for this element
    Snap('#' + prefix + 'background').children()[0].attr({id: prefix + 'background'});
    // Snap('#' + prefix + 'thermometer').children()[0].attr({id: prefix + 'thermometer'});
    // Snap('#' + prefix + 'lining').children()[0].attr({id: prefix + 'lining'});
    // // get fill group
    // let group = Snap('#' + prefix + 'fill');
    // // get fill rectangle size
    // let rect = group.children()[0];
    // this.fillRectPx = rect.getBBox();
    // this.fillHeightPx = this.fillRectPx.height;
    // // get color
    // this.colors[2] = rect.attr().fill;

    this.update();
  },
  watch: {
    values: {
      deep: true,
      handler() {
        this.update();
      }
    },
  },
  methods: {
    update() {
      // in order to set attributes on elements we need to re-create the element (clone)
      let group = Snap('#' + prefix + 'background');
      let element = group.children()[0];
      let clone = element.clone();
      element.remove();
      // set background
      clone.attr({ fill: this.colors[0]});
      // hysteresis or default
      if (!this.values.hysteresis) {
        group = Snap('#' + prefix + 'hysteresis');
        clone = group.clone();
        group.remove();
        clone.attr({ display: 'none'});
        group = Snap('#' + prefix + 'default');
        clone = group.clone();
        group.remove();
        clone.attr({ display: 'yes'});
      }
      else {
        group = Snap('#' + prefix + 'default');
        clone = group.clone();
        group.remove();
        clone.attr({ display: 'none'});
        group = Snap('#' + prefix + 'hysteresis');
        clone = group.clone();
        group.remove();
        clone.attr({ display: 'yes'});
      }
      group = Snap('#' + prefix + 'unit');
      let text = group.children()[0];
      let str = this.name;
      text.attr({ text: str});
      // set text values (padding of whitespace is applied to center text)
      //set value x-axis
      group = Snap('#' + prefix + 'value-x');
      clone = group.clone();
      group.remove();
      clone.attr({ display: 'none'});
      text = clone.children()[0];
      str = this.values.valueDegrees.padStart(4);
      text.attr({ text: str});
      //set value y-axis
      group = Snap('#' + prefix + 'value-y');
      clone = group.clone();
      group.remove();
      clone.attr({ display: 'none'});
      text = group.children()[0];
      str = this.values.valueTime.padStart(6);
      text.attr({ text: str});
      // set min
      group = Snap('#' + prefix + 'min');
      text = group.children()[0];
      str = this.values.min.padStart(6);
      text.attr({ text: str});
      // set max
      group = Snap('#' + prefix + 'max');
      text = group.children()[0];
      str = this.values.max.padStart(6);
      text.attr({ text: str});
      // set setpoint
      group = Snap('#' + prefix + 'setpoint');
      text = group.children()[0];
      str = this.values.setpoint.padStart(4);
      text.attr({ text: str});
      // set setpoint
      group = Snap('#' + prefix + 'band');
      text = group.children()[0];
      str = this.values.band.padStart(4);
      text.attr({ text: str});
      // set setpoint group position
      // let mx = new Snap.Matrix();
      // mx.translate(0, -this.setpointPx);
      // group.transform(mx);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  text {
    white-space: pre;
  }
</style>
