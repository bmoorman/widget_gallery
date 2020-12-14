<script>
  import { Scatter } from 'vue-chartjs'
  import chartjsPluginAnnotation from 'chartjs-plugin-annotation'
  //import Snap from 'snapsvg-cjs'

  export default {
    mixins: [Scatter],
    name: "Curve",
    props: {
      values: {
        type: Object,
        required: true,
        // default values to describe data structure
        default: function () {
          return {
            today: 17,
            days: [0, 7, 28, 42],
            series: [
              {
                type: 'Temperature',
                unit: 'graadC',
                values: ['33.3', '28.1', '21.1', '20.5'/* , '18.5' */]
              },
              {
                type: 'Ventilation',
                unit: '%',
                values: ['25', '27', '45', '85'/* , '80' */]
              },
              {
                type: 'Ventilation',
                unit: '%',
                values: ['22', '25', '40', '75'/* , '78' */]
              },
            ]
          }
        }
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      fahrenheit: {
        type: Boolean,
        required: false,
        default: false
      },
      colors: {
        type: Array,
        required: false,
        default: function () {
          return [
            'black',  //line color first series
          ];
        }
      },
      icons: {
        type: Array,
        required: false,
        default: function () {
          return [
            'fc_day.svg',
            'fc_day_disabled.svg',
            'fc_thermo_celsius.svg',
            'fc_thermo_celsius_disabled.svg',
            'fc_thermo_fahrenheit.svg',
            'fc_thermo_fahrenheit_disabled.svg',
          ];
        }
      }
    },
    data() {
      return {
        updated: false,
        chartInstance: null,
        chartAreaBackgroundColor: '#E0F0E8',
        defaultChartAreaBackgroundColor: '#E0F0E8',
        fontSize: 16,
        defaultFontSize: 16,
        fontFamily: 'Helvetica',
        fontColor: 'black',
        defaultFontColor: 'black',
        comma: false,
        scaling: 1,
        series: [],
        htmlLegend: null,
        chartOptions: {
          title: {
            display: false,
            text: 'Curve'
          },
          scales: {
            yAxes: null, // populated during initialize
            xAxes: [{
              offset: true,
              id: 'x',
              ticks: {
                display: true,
                autoSkip: false,
                stepSize: 1,
                maxTicksLimit: 50,
                beginAtZero: false,
                maxRotation: 0,
                fontColor: this.fontColor,
                fontSize: this.fontSize,
                fontFamily: this.fontFamily,
                callback: (value) => {
                  // show only label for days that are added as points, and today if defined
                  if (this.values.days.includes(value) || (this.values.today !== 'undefined' && value == this.values.today))
                    return value;
                  else
                    return null;
                },
              },
              beforeTickToLabelConversion: (axis) => {
                axis.options.ticks.fontSize = this.fontSize;
                axis.options.ticks.fontFamily = this.fontFamily;
                axis.options.ticks.fontColor = this.fontColor;
              },
              gridLines: {
                display: true
              }
            }]
          },
          legend: {
            display: false
          },
          // legendCallback: () => {
          //   var text = []; 
          //   text.push('<div>hello</div>'); 
          //   return text.join('');
          // },
          tooltips: { enabled: false },
          hover: {mode: null},
          //   mode: 'index',
          //   position: 'nearest',
          //   custom: (tooltip) => {
          //     // tooltip element
          //     var tooltipEl = document.getElementById('chartjs-tooltip');

          //     if (!tooltipEl) {
          //       tooltipEl = document.createElement('div');
          //       tooltipEl.id = 'chartjs-tooltip';
          //       tooltipEl.innerHTML = "<table></table>"
          //       document.body.appendChild(tooltipEl);
          //     }

          //     // hide if no tooltip
          //     if (tooltip.opacity === 0) {
          //       tooltipEl.style.opacity = 0;
          //       return;
          //     }

          //     // set caret position
          //     tooltipEl.classList.remove('above', 'below', 'no-transform');
          //     if (tooltip.yAlign) {
          //       tooltipEl.classList.add(tooltip.yAlign);
          //     } else {
          //       tooltipEl.classList.add('no-transform');
          //     }

          //     // set text
          //     if (tooltip.body) {
          //       var titleLines = tooltip.title || [];

          //       var innerHtml = '<thead>';

          //       titleLines.forEach(function(title) {
          //         innerHtml += '<tr><th>' + title + '</th></tr>';
          //       });
          //       innerHtml += '</thead><tbody>';
                
          //       let index = tooltip.dataPoints[0].index;
          //       this.series.forEach(function(serie, i) {
          //         if (serie.values[i] !== 'undefined') {
          //           var colors = tooltip.labelColors[i];
          //           var style = 'background:' + colors.backgroundColor;
          //           style += '; border-color:' + colors.borderColor;
          //           style += '; border-width: 2px'; 
          //           var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                    
          //           innerHtml += '<tr><td>' + span + serie.type + ' ' + serie.values[index].y + '</td></tr>';
          //         }
          //       });
          //       innerHtml += '</tbody>';

          //       var tableRoot = tooltipEl.querySelector('table');
          //       tableRoot.innerHTML = innerHtml;
          //     }

          //     var position = this.$refs.canvas.getBoundingClientRect();

          //     // display, position, and set styles for font
          //     tooltipEl.style.opacity = 1;
          //     tooltipEl.style.left = position.left + tooltip.caretX + 'px';
          //     tooltipEl.style.top = position.top + tooltip.caretY + 'px';
          //     tooltipEl.style.fontFamily = tooltip._fontFamily;
          //     tooltipEl.style.fontSize = tooltip.fontSize;
          //     tooltipEl.style.fontStyle = tooltip._fontStyle;
          //     tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
          //   }          
         // },   
          layout: {
            padding: {
              top: 50,
              left: 35,
              bottom: 20,
              right: 35
            }
          },          
          responsive: true,
          maintainAspectRatio: false,
          annotation: {
            annotations: [
              {
                type: "line",
                mode: "vertical",
                scaleID: "x",
                borderColor: 'gray',
                value: this.values.today,
                borderWidth: 2,
                label: {
                  content: 12,
                  enabled: false,
                  position: "top",
                  xAdjust: 15,
                  backgroundColor: '#4ecca3',
                  fontSize: 10,
                }
              }
            ],
          },
          // hover: {
          //   onHover: function(e) {
          //     // indicate that a datapoint is draggable by showing the 'grab' cursor when hovered
          //     const point = this.getElementAtEvent(e)
          //     if (point.length) e.target.style.cursor = 'grab'
          //     else e.target.style.cursor = 'default'
          //   }
          // },
          animation: {
            duration: 1,
            onComplete: chartInstance => {
              console.log("onCompleteAnimation");
              var ctx = chartInstance.chart.ctx;
              //ctx.globalAlpha = 1;
              this.fontSize = this.defaultFontSize + this.fontSize*(this.scaling/2);
              let fontSpec = Math.round(this.fontSize) + 'px ' + this.fontFamily;
              ctx.font = fontSpec;
              let fontSizeIncrease = this.fontSize - this.defaultFontSize;
              let fontColor = this.fontColor;
              let defaultFontSize = this.defaultFontSize;

              var yAxis = chartInstance.chart.scales['y0'];
              // get y position of ticks and reposition if nescessary
              var yPos = [];
              yAxis.ticks.forEach(function(value, index) {
                yPos[index] = yAxis.getPixelForTick(index);
                // reposition
                if (index > 0) {
                  let diff;
                  if ((diff = yPos[index] - yPos[index - 1]) < (defaultFontSize-2)) { // too close
                    yPos[index - 1] -= (3 + 3/diff);
                    yPos[index] += (3 + 3/diff);
                  }
                }
              });              
              yAxis.ticks.forEach(function(value, index) {
                let x = yAxis.left - 3 - Math.round(fontSizeIncrease);
                let y = yPos[index];
                ctx.fillStyle = fontColor;
                //ctx.textAlign = 'left';
                ctx.fillText(value, x, y+4);
              });
              // because of icons on the axes we have to update chart in an async way to display the icons on first render
              if (!this.updated)
                this.updateChart();
            }
          }          
        }
      }
    },
    watch: {
      disabled: {
        handler(val) {
          this.disableCurve(val);
        }
      },
      fahrenheit: {
        handler() {
          this.updateChart();
        }
      }
    },
    mounted () {
      this.init();
      this.disableCurve(this.disabled);
      // add plugins
      this.addPlugin({
        id: 'chartAreaBackgroundColor',
        beforeDraw: chartInstance => {
          console.log("beforeDraw");
          var ctx = chartInstance.chart.ctx;
          this.chartInstance = chartInstance;
          ctx.fillStyle = this.chartAreaBackgroundColor;
          var chartArea = chartInstance.chartArea;
          ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        }
      });
      // check if axes icons are specified
      if (Array.isArray(this.icons) && this.icons.length) {
        // plugin for adding icons to axes
        this.addPlugin({
          id: 'axisIcon',
          afterDraw: chartInstance => {
            console.log("afterDraw");
            let ctx = chartInstance.chart.ctx;
            // calculate scaling dependent on screen size and chart canvas size
            let screenWidth = window.screen.width * window.devicePixelRatio;
            let screenHeight = window.screen.height * window.devicePixelRatio;
            this.scaling = (1-Math.max((screenWidth - ctx.canvas.width)/screenWidth, (screenHeight - ctx.canvas.height)/screenHeight)*window.devicePixelRatio);

            let xAxis = chartInstance.scales['x'];
            let yAxis0 = chartInstance.scales['y0'];
            var x, y, icon, iconIndex, iconOffset;
            iconOffset = 0;
            if (this.disabled) {
              iconOffset = 1;
            }
            // icon on x axis
            iconIndex = 0 + iconOffset;
            x = xAxis.getPixelForTick(xAxis.ticks.length - 1);
            icon = new Image();            
            if ((icon.src = this.getIconPath(this.icons[iconIndex])) !== '') {
//              var rectangle1 = new Path2D();
              ctx.beginPath();
              x = x - 5;
              y = yAxis0.bottom - 3;
              let scaledIconWidth, scaledIconHeight;
              scaledIconWidth = icon.width + icon.width*this.scaling;
              scaledIconHeight = icon.height + icon.height*this.scaling;
              ctx.drawImage(icon, x , y, scaledIconWidth, scaledIconHeight);
              // rectangle1.rect(x , y , 50, 50);
              // this.$refs.canvas.addEventListener("mousedown", (e) => {
              //   if (ctx.isPointInPath(rectangle1, e.offsetX, e.offsetY)) {
              //     console.log("rectangle1 is hit");
              //   }
              // });
            }
            // icon on y0 axis
            if (!this.fahrenheit)
              iconIndex = 2 + iconOffset;
            else
              iconIndex = 4 + iconOffset;
            y = yAxis0.getPixelForTick(-1);      
            icon = new Image();
            if ((icon.src = this.getIconPath(this.icons[iconIndex])) !== '') {
  //            var rectangle2 = new Path2D();
              ctx.beginPath();
              x = xAxis.left - 40;
              y = y + 8;
              let scaledIconWidth, scaledIconHeight;
              scaledIconWidth = icon.width + icon.width*this.scaling;
              scaledIconHeight = icon.height + icon.height*this.scaling;
              ctx.drawImage(icon, x , y, scaledIconWidth, scaledIconHeight);
              // rectangle2.rect(x , y , 50, 50);
              // this.$refs.canvas.addEventListener("mousedown", (e) => {
              //   if (ctx.isPointInPath(rectangle2, e.offsetX, e.offsetY)) {
              //     console.log("rectangle2 is hit");
              //   }
              // });
            }
            if (typeof chartInstance.scales['y1'] !== 'undefined') {
              // icon on y1 axis
              iconIndex = 4 + iconOffset;
              let yAxis1 = chartInstance.scales['y1'];
              y = yAxis1.getPixelForTick(-1);      
              icon = new Image();
              if ((icon.src = this.getIconPath(this.icons[iconIndex])) !== '') {
                var rectangle3 = new Path2D();
                ctx.beginPath();
                x = xAxis.right - 9;
                y = y + 8;
                let scaledIconWidth, scaledIconHeight;
                scaledIconWidth = icon.width + icon.width*this.scaling;
                scaledIconHeight = icon.height + icon.height*this.scaling;
                ctx.drawImage(icon, x , y, scaledIconWidth, scaledIconHeight);
                rectangle3.rect(x , y , 50, 50);
                this.$refs.canvas.addEventListener("mousedown", (e) => {
                  if (ctx.isPointInPath(rectangle3, e.offsetX, e.offsetY)) {
                    console.log("rectangle3 is hit");
                  }
                });
              }
            }
          },
        });
      }
      this.renderChart(this.datacollection, this.chartOptions);
      this.addPlugin([chartjsPluginAnnotation]);
      this.htmlLegend = this.generateLegend();
    },
    beforeUpdate() {
      console.log("beforeUpdate");
     // this.init();
     // this.update();
    },
    methods: {
      asyncTrigger() {
        return new Promise(f => {
          setTimeout(() => {
            f();
          }, 100);
        });
      },
      async updateChart() {
        await this.asyncTrigger();
        if (this.chartInstance != null) {
      //    this.chartInstance.destroy();
          //this.chartInstance.reset();
          this.chartInstance.chart.update();
          this.updated = true;
        }
      },
      disableCurve(disable) {
            console.log(disable);
          if (disable) {
            this.fontColor = 'lightgray';
            this.chartAreaBackgroundColor = '#f0eded';
            for (let i=0; i<this.datacollection.datasets.length; i++) {
              this.datacollection.datasets[i].pointBackgroundColor = 'lightgray';
              this.datacollection.datasets[i].hoverBackgroundColor = 'lightgray';
              this.datacollection.datasets[i].pointBorderColor = 'lightgray';
              this.datacollection.datasets[i].borderColor = 'lightgray';
              this.datacollection.datasets[i].backgroundColor = 'lightgray';
            }
            this.chartOptions.annotation.annotations[0].borderColor = 'lightgray';
            // this.chartOptions.annotation.elements = [];
            // this.chartOptions.annotation.annotations = [{
            //   drawTime: "afterDatasetsDraw",
            //   type: "line",
            //     mode: "vertical",
            //     scaleID: "x",
            //     borderColor: 'lightgray',
            //     value: 15,
            //     borderWidth: 2,
            //   }];
          }
          else {
            this.fontColor = this.defaultFontColor;
            this.chartAreaBackgroundColor = this.defaultChartAreaBackgroundColor;
            for (let i=0; i<this.datacollection.datasets.length; i++) {
              this.datacollection.datasets[i].pointBackgroundColor = this.colors[0];
              this.datacollection.datasets[i].hoverBackgroundColor = this.colors[0];
              this.datacollection.datasets[i].pointBorderColor = this.colors[0];
              this.datacollection.datasets[i].borderColor = this.colors[0];
              this.datacollection.datasets[i].backgroundColor = this.colors[0];
            }
            this.chartOptions.annotation.annotations[0].borderColor = 'gray';
          }
          this.updateChart();
      },
      getIconPath (iconName) {
        return iconName ? require(`../assets/${iconName}`) : ''
      },
      init () {
        // copy values in series x,y points
        this.series = this.values.series;
        for (let i=0; i<this.series.length; i++) {
          // for the minimum defined points
          let points = Math.min(this.series[i].values.length, this.values.days.length);
          for (let j=0; j<points; j++) {
            if (this.comma == false) // use comma notation if there is a comma detected in supplied values
              this.comma = this.values.series[i].values[j].indexOf(',') != -1;
            this.series[i].values[j] = { x: this.values.days[j], y: Number(this.values.series[i].values[j].replace(',', '.'))} 
          }
          if (this.series[i].values.length > points)
            this.series[i].values.pop();
          // add start and end point to series values (to get flat part of graph)
          let pre = { x:0, y: 0 };
          let post = { x:0, y: 0 };
          pre.x = this.values.days[0] - 1;
          pre.y = this.values.series[i].values[0].y;
          post.x = this.values.days[points - 1] + 1;
          post.y = this.values.series[i].values[points - 1].y;
          this.series[i].values.unshift(pre);
          this.series[i].values.push(post);
        }

        let dataSets = [];
        let yAxes = [];
        for (let i=0; i<this.series.length; i++) {
          dataSets[i] = {
            label: this.values.series[i].type,
            yAxisID: 'y' + i,
            backgroundColor: this.colors[i],
            hoverBackgroundColor: this.colors[i],
            pointBackgroundColor: this.colors[i],
            borderWidth: 2,
            pointBorderColor: this.colors[i],
            borderColor: this.colors[i],
            fill: false,
            lineTension: 0,
            data: this.series[i].values,
            showLine: true,
            pointRadius: Array(this.series[i].values.length).fill(3),
            
          };
          dataSets[i].pointRadius[0] = 0;
          dataSets[i].pointRadius[this.series[i].values.length - 1] = 0;
          // define no more than 2 y-axis
          if (i>1)
            dataSets[i].yAxisID = 'y1'
          // left y axis
          if (i==0) {
            yAxes[i] = {              
              offset: true,
              id: 'y0',
              position: 'left',
              ticks: {
                //display: false, // do not hide as margin gets removed
                precision: 1,
                fontColor: 'rgba(0, 0, 0, 0)', // display as transparent
                autoSkip: true,
                maxTicksLimit: 10,
                beginAtZero: false
              },
              afterBuildTicks: (axis, ticks) => {
                console.log("afterBuildTicks");
                ticks = [];
                let len = this.series[0].values.length - 2; // start/end points removed
                for (let i=1; i<len + 1; i++) {
                   ticks.push(Number(this.series[0].values[i].y));
                }
                ticks.splice(0, ticks.length, ...(new Set(ticks))) // remove duplicate values
                return ticks;
              },
              afterTickToLabelConversion: (axis) => {
                // add .0 if there are no decimals
                axis.ticks.forEach(function(value, index) {
                  if (axis.ticks[index].indexOf('.') == -1) {
                    axis.ticks[index] = axis.ticks[index] + '.0';

                  }
                });
                // replace '.' with ','
                if (this.comma == true) {
                  axis.ticks.forEach(function(value, index) {
                    axis.ticks[index] = axis.ticks[index].replace('.', ',');
                  });
                }                
              },
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: false,
            //    labelString: '                                                                                             ' + this.series[0].unit,
                padding: {
                  top: 0,
                  bottom: 0
                }
              }
            };
          }
          // right y axis
          if (i==1) {
            yAxes[i] = {
              offset: true,
              id: 'y1',
              position: 'right',
              ticks: {
                maxTicksLimit: 10,
              },
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: false,
           //     labelString: this.series[1].unit + '                                                                                                ' ,
                padding: {
                  top: 0,
                  bottom: 0
                }
              }
            };
          }
          // set colors if defined
          if (Array.isArray(this.colors) && this.colors.length) {
            if (typeof this.colors[i] !== 'undefined') {
              dataSets[i].borderColor = this.colors[i];
            }
          }
        }

        this.datacollection =  {
          datasets: dataSets
        };

        this.chartOptions.scales.yAxes = yAxes
      },
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
/*   #chartjs-tooltip {
    opacity: 1;
    position: absolute;
    background: rgba(40, 104, 72, 0.616);
    color: rgb(54, 52, 52);
    border-radius: 3px;
    -webkit-transition: all .1s ease;
    transition: all .1s ease;
    pointer-events: none;
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
  }

  .chartjs-tooltip-key {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
  }
 */
</style>
