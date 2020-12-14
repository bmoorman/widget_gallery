<template>
  <div id="thermogauge" class="widget">
    <thermo-gauge-svg id="svgout"/>
  </div>
</template>

<script>
// template SVG gets loaded as component (remember to set vue-svg-loader option prefixIds!)
// using Snap svg elements get dynamically manipulated through their id
import ThermoGaugeSvg from '@/assets/thermogauge.svg'
import Snap from 'snapsvg-cjs'

const prefix = 'thermogauge-';

export default {
  name: 'Gauge',
  components: {
    ThermoGaugeSvg  
  },
  props: {
    values: {
      type: Object,
      required: true,
      default: function () {
        return {
          value: '20.1',
          setpoint: '21.5',
          min: '15.0',
          max: '30.0'
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
          '#FFFFFF',  //background
          'red'       //fill alarm
        ];
      }
    }
  },
  data() {
    return {
      fillRectPx: null,
      fillHeightPx: 0,
      setpointPx: 0,
      alarm: false,
    }
  },
  watch: {
    values: {
      deep: true,
      handler() {
        this.update();
      }
    },
    name: {
      handler() {
        this.setName();
      }
    }
  },
  mounted () {
    
    // set id attribute on path as css otherwise stops for this element
    Snap('#' + prefix + 'background').children()[0].attr({id: prefix + 'background'});
    Snap('#' + prefix + 'thermometer').children()[0].attr({id: prefix + 'thermometer'});
    Snap('#' + prefix + 'lining').children()[0].attr({id: prefix + 'lining'});
    // get fill group
    let group = Snap('#' + prefix + 'fill');
    // get fill rectangle size
    let rect = group.children()[0];
    this.fillRectPx = rect.getBBox();
    this.fillHeightPx = this.fillRectPx.height;
    // get default color from svg if not given in colors
    if (!this.colors[2])
      this.colors[2] = rect.attr().fill;

    this.update();
    this.setName();
  },
  methods: {
    calc() {
      // calibrate gauge
      /*
  100%  +----------+    d
        |          |
   y% +---------------+ c
        |          |
        |          |
        |          |
        |          |
        |          |
 s +--->+          |
        |          |
        +----------+
        ||        ||
        ||        ||
        ||        ||
        ||        ||
        || fill   ||
        ||        ||
        ||        ||
        ||        ||
   x% +---------------+ b
        ||        ||
        ||        ||
        ||        ||
        ||        ||
        ||        ||
   0%   +----------+    a
      */
      const x = 0.32;// (32%, empirical determined)
      const y = 0.91;// (91%, empirical determined)
      let a, b, c, d, s;
      b = Number(this.values.min.replace(',', '.'));
      c = Number(this.values.max.replace(',', '.')); 
      // mathematically determined for given x,y
      a = (y*b - c*x)/(y-x);
      d = (c*(1-x) + b*(y-1))/(y-x);
      // value range
      let range = d - a;
      // resolution 
      let resolution = range/this.fillRectPx.height;
      // fill height px
      this.fillHeightPx = (Number(this.values.value.replace(',', '.')) - a)/resolution;
      // setpoint
      s = a;
      let setpoint = Number(this.values.setpoint.replace(',', '.'));
      if (setpoint > a && setpoint <= d)
        s = setpoint;
      // setpoint px (pixels from bottom for transformY)
      this.setpointPx = (s - a)/resolution;
      // set alarm
      if (Number(this.values.value.replace(',', '.')) > c)
        this.alarm = true;
      else
        this.alarm = false;
    },
    update() {
      this.calc();
      // in order to set attributes on elements we need to re-create the element (clone)
      let group = Snap('#' + prefix + 'background');
      let path = group.children()[0];
      let clone = path.clone();
      path.remove();
      // set background
      clone.attr({ fill: this.colors[0]});
      // get fill group and remove rect
      group = Snap('#' + prefix + 'fill');
      let rect = group.children()[0];
      rect.remove();
      // add new fill rect with correct position and height
      rect = group.rect(this.fillRectPx.x, this.fillRectPx.y + (this.fillRectPx.height - this.fillHeightPx), this.fillRectPx.width, this.fillHeightPx);
      rect.attr({ id: prefix + 'fill'});
      // set alarm color
      if (this.alarm)
        rect.attr({ fill: this.colors[1]});
      else
        rect.attr({ fill: this.colors[2]});
      // set text values (padding of whitespace is applied to center text)
      // set value
      group = Snap('#' + prefix + 'value');
      let text = group.children()[0];
      let str = this.values.value.padStart(4);
      text.attr({ text: str});
      // set min
      group = Snap('#' + prefix + 'min');
      text = group.children()[1];
      str = this.values.min.padStart(4);
      text.attr({ text: str});
      // set max
      group = Snap('#' + prefix + 'max');
      text = group.children()[1];
      str = this.values.max.padStart(4);
      text.attr({ text: str});
      // set setpoint
      group = Snap('#' + prefix + 'setpoint');
      text = group.children()[1];
      str = this.values.setpoint.padStart(4);
      text.attr({ text: str});
      // set setpoint group position
      let mx = new Snap.Matrix();
      mx.translate(0, -this.setpointPx);
      group.transform(mx);
    },
    setName() {
      // get name group
      let group = Snap('#' + prefix + 'name');
      // set text
      let text = group.children()[0];
      text.attr({ text: this.name});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  text {
    white-space: pre;
  }
</style>
