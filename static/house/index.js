export default function define(runtime, observer) {
    console.log("get const main");
    const main = runtime.module();

    main.variable(observer("d3")).define("d3", ["require"], function(require) {
        console.log("d3 observer")
        return(require('d3-scale','d3-array','d3-fetch','d3-selection','d3-timer','d3-color','d3-format','d3-ease','d3-interpolate','d3-axis', 'd3-geo', 'd3-selection-multi'))
    });

    main.variable(observer("dataset")).define("dataset", ["d3"], function(d3) {
        console.log("dataset observer");
        return(d3.csv('dataset.csv'))
    });

    main.variable(observer("chart")).define("chart", ["d3", "DOM", "dataset", "width"], function(d3, DOM, dataset, width) {
        console.log(`chart observer, width ${width}, dataset is:`);

        const height = 600;
        const top_n = 10;
        const tickDuration = 500;

        let month = 201101;

        const svg = d3.select(DOM.svg(width, height));

        const margin = {
            top: 80,
            right: 0,
            bottom: 5,
            left: 0
        };
        let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);

        // 处理数据
        dataset.forEach(d => {
            d.value = +d.value,
            d.value = isNaN(d.value) ? 0 : d.value,
            d.month = +d.month,
            d.colour = "#C8BDFF"
        });
        console.log(dataset);

        let monthSlice = dataset.filter(d => d.month == month && !isNaN(d.value))
            .sort((a,b) => b.value - a.value)
            .slice(0,top_n);
        monthSlice.forEach((d,i) => d.rank = i);
        console.log(monthSlice);


        let x = d3.scaleLinear()
            .domain([0, d3.max(monthSlice, d => d.value)])
            .range([margin.left, width-margin.right-65]);

        let y = d3.scaleLinear()
            .domain([top_n, 0])
            .range([height-margin.bottom, margin.top]);

        let colourScale = d3.scaleOrdinal()
            .range(["#adb0ff", "#ffb3ff", "#90d595", "#e48381", "#aafbff", "#f7bb5f", "#eafb50"])
            .domain(["Dongbei","Xibei","Xinan","Huabei","Huadong","Huazhong","Huanan"]);


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
            .text(d => d3.format(',')(d.value));


        // 循环查询数据
        d3.timeout(_ => {
            console.log('2000 timeout');

            let ticker = d3.interval(e => {
                console.log(`ticker come, month ${month}`);

                monthSlice = dataset.filter(d => d.month == month && !isNaN(d.value))
                    .sort((a,b) => b.value - a.value)
                    .slice(0,top_n);
                monthSlice.forEach((d,i) => d.rank = i);
                console.log(monthSlice);


                // 重置 x 区间
                x.domain([0, d3.max(monthSlice, d => d.value)]);


                // 绘制 bar
                let bars = svg.selectAll('.bar').data(monthSlice, d => d.name);

                // bar 从表格外加入表格，初始显示在表格外，使用动画显示到它应显示的位置
                // ease 后的attr 表格希望动画后rect的属性
                bars.enter()
                    .append('rect')
                    .attrs({
                        // 空格换为下划线
                        class: d => `bar ${d.name.replace(/\s/g,'_')}`,
                        x: x(0)+1,
                        width: d => x(d.value)-x(0)-1,
                        y: d => y(top_n+1)+5,
                        height: y(1)-y(0)-barPadding
                    })
                    .styles({
                        fill: d => "#adb0ff"
                    })
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr({
                        y: d => y(d.rank) + 5
                    });

                // 表格中已存在的bar，在数据变化后，变更它的width和y，使用动画移动它的位置
                bars
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        width: d => x(d.value)-x(0)-1,
                        y: d => y(d.rank)+5
                    });

                // 因数据变化，需要移出表格的bar，指定它需要变化到的width和y，然后使用动画移动
                bars
                    .exit()
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        width: d => x(d.value)-x(0)-1,
                        y: d => y(top_n+1)+5
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
                        // opacity: d => d.opacity,
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
                        // opacity: d => d.opacity,
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
                    });

                labels
                    .exit()
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        transform: d => `translate(${x(d.value)-8}, ${y(top_n+1)+5})`
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
                    .text(d => d3.format(',.0f')(d.value))
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attrs({
                        y: d => y(d.rank)+5+((y(1)-y(0))/2)+1
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
                        let i = d3.interpolateRound(d.value, d.value);
                        return function(t) {
                            this.textContent = d3.format(',')(i(t));
                        };
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
                    .remove();


                if (month == 201912) ticker.stop();

                var year = parseInt(month / 100);
                var mon = month % 100;
                if (mon == 12) {
                    year = year + 1;
                    month = year * 100 + 1;
                } else {
                    month = month + 1;
                }

            }, tickDuration);
        }, 2000);

        let title = svg.append('text')
            .attrs({
                class: 'title',
                y: 24
            })
            .html('house price');

        return svg.node();
    });

    main.variable(observer()).define(["html"], function(html) {
        console.log("html observer");
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
            text.yearText{
              font-size: 96px;
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

    console.log("return main");
    return main;
}