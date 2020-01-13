export default function define(runtime, observer) {
    const main = runtime.module();

    main.variable(observer("d3")).define("d3", ["require"], function(require) {
        return(require('d3-scale','d3-array','d3-fetch','d3-selection','d3-timer','d3-color','d3-format','d3-ease','d3-interpolate','d3-axis', 'd3-geo', 'd3-selection-multi'))
    });

    main.variable(observer("dataset")).define("dataset", ["d3"], function(d3) {
        return(d3.csv('dataset.csv'))
    });

    main.variable(observer("chart")).define("chart", ["d3", "DOM", "dataset"], function(d3, DOM, dataset) {

        const width = 1536;
        const height = 864;
        const top_n = 20;
        const tickDuration = 750;

        let month = 201101;
        // let month = 201905;
        let start = 0;
        let endCount = 0;    // 最后一年匹配的数量
        let finalFive = 0;

        const svg = d3.select(DOM.svg(width, height)).attr('background', '#bbbbbb');

        let title = svg.append('text')
            .attrs({
                class: 'title',
                x: 583,
                y: 30,
                width: width
            })
            .html('中国大陆城市历年房价前十名');

        const margin = {
            top: 40,
            right: 0,
            bottom: 5,
            left: 0
        };
        let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);

        // 处理数据
        dataset.forEach(d => {
            d.value = +d.value,
            d.lastValue = +d.lastValue,
            d.value = isNaN(d.value) ? 0 : d.value,
            d.month = +d.month,
            d.colour = "#C8BDFF"
        });

        let monthSlice = dataset.filter(d => d.month == month && !isNaN(d.value))
            .sort((a,b) => b.value - a.value)
            .slice(0,top_n);
        monthSlice.forEach((d,i) => d.rank = i);


        let x = d3.scaleLinear()
            .domain([0, d3.max(monthSlice, d => d.value)])
            .range([margin.left, width-margin.right-65]);

        let y = d3.scaleLinear()
            .domain([top_n-5, 0])
            .range([height-margin.bottom, margin.top]);

        let colourScale = d3.scaleOrdinal()
            .range(["#adb0ff", "#ffb3ff", "#90d595", "#e48381", "#aafbff", "#f7bb5f", "#eafb50"])
            .domain(["Huanan","Huazhong","Huadong","Xibei","Huabei","Xinan","Dongbei"]);


        // 绘制 bar
        svg.selectAll('rect.bar')
            .data(monthSlice, d => d.name)
            .enter()
            .append('rect')
            .attrs({
                class: 'bar',
                x: x(0)+1,
                width: d => x(d.value)-x(0)-1,
                y: d => y(d.rank)+5,
                height: y(1)-y(0)-barPadding
            })
            .styles({
                fill: d => colourScale(d.area)
            });

        // 显示 bar 上的数据
        svg.selectAll('text.label')
            .data(monthSlice, d => d.name)
            .enter()
            .append('text')
            .attrs({
              class: 'label',
              transform: d => `translate(${x(d.value)-5}, ${y(d.rank)+5+((y(1)-y(0))/2)-8})`,
              'text-anchor': 'end'
            })
            .selectAll('tspan')
            .data(d => [{text: d.name_zh, opacity: 1, weight:600}, {text: d.area_zh, opacity: 1, weight:400}])
            .enter()
            .append('tspan')
            .attrs({
              x: 0,
              dy: (d,i) => i*16
            })
            .styles({
              // opacity: d => d.opacity,
              fill: d => d.weight == 400 ? '#444444':'',
              'font-weight': d => d.weight,
              'font-size': d => d.weight == 400 ? '12px':''
            })
            .html(d => d.text);
          
        svg.selectAll('text.valueLabel')
            .data(monthSlice, d => d.name)
            .enter()
            .append('text')
            .attrs({
              class: 'valueLabel',
              x: d => x(d.value)+5,
              y: d => y(d.rank)+5+((y(1)-y(0))/2)+1,
            })
            .text(d => d3.format(',')(d.lastValue));

        let monthText = svg.append('text')
            .attrs({
              class: 'monthText',
              x: width-300,
              y: height-35
            })
            // .styles({
            //   'text-anchor': 'end'
            // })
            .html(~~month);


        // 循环查询数据
        d3.timeout(_ => {

            let ticker = d3.interval(e => {

                console.log('ticker timeout')

                monthSlice = dataset.filter(d => d.month == month && !isNaN(d.value))
                    .sort((a,b) => b.value - a.value)
                    .slice(start + finalFive, start + top_n);
                monthSlice.forEach((d,i) => d.rank = i);

                x.domain([0, d3.max(monthSlice, d => d.value)]);

                let bars = svg.selectAll('.bar').data(monthSlice, d => d.name);

                bars
                    .enter()
                    .append('rect')
                    .attrs({
                      class: d => `bar ${d.name.replace(/\s/g,'_')}`,
                      x: x(0)+1,
                      width: d => x(d.value)-x(0)-1,
                      y: d => y(top_n+1)+5,
                      height: y(1)-y(0)-barPadding
                    })
                    .styles({
                        fill: d => colourScale(d.area)
                    })
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        y: d => y(d.rank)+5
                    })
                    .styles({
                        opacity: 1
                    });

                bars
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        width: d => x(d.value)-x(0)-1,
                        y: d => y(d.rank)+5
                    })
                    .styles({
                        opacity: 1
                    });

                bars
                    .exit()
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        width: d => x(d.value)-x(0)-1,
                        y: d => y(top_n+1)+5
                    })
                    .styles({
                        opacity: 0
                    })
                    .remove();
                

                let labels = svg.selectAll('.label').data(monthSlice, d => d.name);

                labels
                    .enter()
                    .append('text')
                    .attrs({
                        class: 'label',
                        transform: d => `translate(${x(d.value)-5}, ${y(top_n+1)+5+((y(1)-y(0))/2)-8})`,
                        'text-anchor': 'end'
                    })
                    .html('')
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        transform: d => `translate(${x(d.value)-5}, ${y(d.rank)+5+((y(1)-y(0))/2)-8})`
                    })
                    .styles({
                        opacity: 1
                    });

                let tspans = labels.selectAll('tspan')
                    .data(d => [{text: d.name_zh, opacity: 1, weight:600}, {text: d.area_zh, opacity: 1, weight:400}]);

                tspans.enter()
                    .append('tspan')
                    .html(d => d.text)
                    .attrs({
                        x: 0,
                        dy: (d,i) => i*16
                    })
                    .styles({
                        fill: d => d.weight == 400 ? '#444444':'',
                        'font-weight': d => d.weight,
                        'font-size': d => d.weight == 400 ? '12px':''
                    });

                tspans
                    .html(d => d.text)
                    .attrs({
                        x: 0,
                        dy: (d,i) => i*16
                    })
                    .styles({
                        fill: d => d.weight == 400 ? '#444444':'',
                        'font-weight': d => d.weight,
                        'font-size': d => d.weight == 400 ? '12px':''
                    });

                tspans.exit().remove();

                labels
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        transform: d => `translate(${x(d.value)-5}, ${y(d.rank)+5+((y(1)-y(0))/2)-8})`
                    })
                    .styles({
                        opacity: 1
                    });

                labels
                    .exit()
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        transform: d => `translate(${x(d.value)-8}, ${y(top_n+1)+5})`
                    })
                    .styles({
                        opacity: 0
                    })
                    .remove();

                let valueLabels = svg.selectAll('.valueLabel').data(monthSlice, d => d.name);

                valueLabels
                    .enter()
                    .append('text')
                    .attrs({
                        class: 'valueLabel',
                        x: d => x(d.value)+5,
                        y: d => y(top_n+1)+5,
                    })
                    .text(d => d3.format(',.0f')(d.lastValue))
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        y: d => y(d.rank)+5+((y(1)-y(0))/2)+1
                    })
                    .styles({
                        opacity: 1
                    });

                valueLabels
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        x: d => x(d.value)+5,
                        y: d => y(d.rank)+5+((y(1)-y(0))/2)+1
                    })
                    .tween("text", function(d) {
                        let i = d3.interpolateRound(d.lastValue, d.value);
                        return function(t) {
                            this.textContent = d3.format(',')(i(t));
                        };
                    })
                    .styles({
                        opacity: 1
                    });

                valueLabels
                    .exit()
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        x: d => x(d.value)+5,
                        y: d => y(top_n+1)+5
                    })
                    .styles({
                        opacity: 0
                    })
                    .remove();


                

                if (month == 201912) {
                    // 隐藏 月份
                    svg.selectAll('.monthText')
                        .transition()
                        .duration(1000)
                        .ease(d3.easeLinear)
                        .styles({
                            opacity: 0
                        });
                    // 修改标题
                    title.html('2019年12月中国大陆320个地市房价排名');

                    if (endCount == 0) {
                        var data = dataset.filter(d => d.month == month && !isNaN(d.value));
                        endCount = data.length;
                    }
                    if (start + top_n > endCount) {
                        finalFive = finalFive + 1;
                        if (finalFive > 5) {
                            ticker.stop();
                        }
                    } else {
                        start = start + 1;
                    }
                } else {
                    monthText.html(~~month);

                    var year = parseInt(month / 100);
                    var mon = month % 100;
                    if (mon == 12) {
                        year = year + 1;
                        month = year * 100 + 1;
                    } else {
                        month = month + 1;
                    }
                }

            }, tickDuration);
        }, 2000);

        return svg.node();
    });

    main.variable(observer()).define(["html"], function(html) {
        return(
            html`<style>
            text{
              font-size: 16px;
              font-family: Open Sans, sans-serif;
            }
            text.title{
              font-size: 28px;
              font-weight: 600;
            }
            text.subTitle{
              font-weight: 500;
              fill: #777777;
            }
            text.label{
              font-size: 18px;
            }
            .map-legend text{
              font-size: 14px;
              fill: #777777;
            }
            text.caption{
              font-weight: 400;
              font-size: 14px;
              fill: #999999;
            }
            text.monthText{
              font-size: 80px;
              font-weight: 700;
              fill: #cccccc;
            }
            text.yearIntro{
              font-size: 48px;
              font-weight: 700;
              fill: #cccccc;
            }
            .tick text {
              fill: #777777;
            }
            .xAxis .tick:nth-child(2) text {
              text-anchor: start;
            }
            .tick line {
              shape-rendering: CrispEdges;
              stroke: #dddddd;
            }
            .tick line.origin{
              stroke: #aaaaaa;
            }
            path.domain{
              display: none;
            }
            </style>`
            )
    });

    return main;
}