<template>
  <div id="rvgauge" class="widget">
    <rv-gauge-svg id="svgout"/>
  </div>
</template>

<script>
// template SVG gets loaded as component (remember to set vue-svg-loader option prefixIds!)
// using Snap svg elements get dynamically manipulated through their id
import RvGaugeSvg from '@/assets/rvgauge.svg';
import Snap from 'snapsvg-cjs'

const prefix = 'rvgauge-';

export default {
  name: 'RVGauge',
  components: {
    RvGaugeSvg  
  },
  props: {
    values: {
      type: Object,
      required: true,
      default: function () {
        return {
          value: '20',
          setpoint: '50',
          min: '15',
          max: '80'
        }
      }
    },
    colors: {
      type: Array,
      required: false,
      default: function () {
        return [
          'red'       //fill alarm
        ];
      }
    },
  },
  data() {
    return {
      fillRectPx: null,
      fillHeightPx: 0,
      setpointPx: 0,
      minPx: 0,
      maxPx: 0,
      alarm: false,
    }
  },
  mounted () {
    // set id attribute on path as css otherwise stops for this element
   // Snap('#background').children()[0].attr({id: 'background'});
    Snap('#' + prefix + 'rvgauge').children()[0].attr({id: prefix + 'rvgauge'});
    Snap('#' + prefix + 'lining').children()[0].attr({id: prefix + 'lining'});
    // get fill group
    let group = Snap('#' + prefix + 'fill');
    // get fill rectangle size
    let rect = group.children()[0];
    this.fillRectPx = rect.getBBox();
    this.fillHeightPx = this.fillRectPx.height;
    // get default color from svg if not given in props
    if (!this.colors[1])
      this.colors[1] = rect.attr().fill;

    this.update();
  },
  watch: {
    values: {
      handler() {
        this.update();
      },
      deep: true
    }
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
      let a, b, c, d, s, x, y;
      b = Number(this.values.min.replace(',', '.'));
      c = Number(this.values.max.replace(',', '.')); 
      a = 0;
      d = 100;
      // value range
      range = b-c;
      let range = d - a;
      // resolution 
      let resolution = range/this.fillRectPx.height;
      // fill height px
      this.fillHeightPx = (Number(this.values.value.replace(',', '.')) - a)/resolution;
      // min
      let min = Number(this.values.min.replace(',', '.'));
      if (min > a && min <= d)
        x = min;
      // min px (pixels from bottom for transformY)
      this.minPx = (x - a)/resolution;
      // max
      let max = Number(this.values.max.replace(',', '.'));
      if (max > a && max <= d)
        y = max;
      // max px (pixels from bottom for transformY)
      this.maxPx = (y - a)/resolution;
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
      // get fill group and remove rect
      let group = Snap('#' + prefix + 'fill');
      let rect = group.children()[0];
      rect.remove();
      // add fill rect with correct position and height
      rect = group.rect(this.fillRectPx.x, this.fillRectPx.y + (this.fillRectPx.height - this.fillHeightPx), this.fillRectPx.width, this.fillHeightPx);
      rect.attr({ id: prefix + 'fill'});
      // set alarm color or default
      if (this.alarm)
        rect.attr({ fill: this.colors[0]});
      else
        rect.attr({ fill: this.colors[1]});
      // set text values (padding of whitespace is applied to center text)
      // set value
      group = Snap('#' + prefix + 'value');
      let text = group.children()[0];
      let str = this.values.value.padStart(4) + '%';
      text.attr({ text: str});
      // set min
      group = Snap('#' + prefix + 'min');
      text = group.children()[1];
      str = this.values.min.padStart(4) + '%';
      text.attr({ text: str});
      // set min group position
      let mx = new Snap.Matrix();
      mx.translate(0, -this.minPx);
      group.transform(mx);
      // set max
      group = Snap('#' + prefix + 'max');
      text = group.children()[1];
      str = this.values.max.padStart(4) + '%';
      text.attr({ text: str});
      // set max group position
      mx = new Snap.Matrix();
      mx.translate(0, -this.maxPx);
      group.transform(mx);
      // set setpoint
      group = Snap('#' + prefix + 'setpoint');
      text = group.children()[1];
      str = this.values.setpoint.padStart(4) + '%'
      text.attr({ text: str});
      // set setpoint group position
      mx = new Snap.Matrix();
      mx.translate(0, -this.setpointPx);
      group.transform(mx);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
