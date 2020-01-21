export default function define(runtime, observer) {
    const main = runtime.module();

    main.variable(observer("d3")).define("d3", ["require"], function(require) {
        return(require('d3-scale','d3-array','d3-fetch','d3-selection','d3-timer','d3-color','d3-format','d3-ease','d3-interpolate','d3-axis', 'd3-geo', 'd3-selection-multi'))
    });

    main.variable(observer("chart")).define("chart", ["d3", "DOM"], function(d3, DOM) {

        const width = 1536;
        const height = 864;

        var svg = d3.select(DOM.svg(width, height)).attr('style', 'border:1px solid #999;');

        let title = svg.append('text')
                .attr('class', 'title')
                .attr('x', 446)
                .attr('y', 352)
                .attr('width', width)
                .styles({
                    opacity: 0
                })
                .html('中国大陆城市历年房价排名(TOP 15)');

        let name = svg.append('text')
                .attr('class', 'name')
                .attr('x', 690)
                .attr('y', 446)
                .attr('width', 1536)
                .styles({
                    opacity: 0
                })
                .html('後塵出品');

        d3.timeout(_ => {
            title
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .styles({
                    opacity: 1
                });

            name
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .styles({
                    opacity: 1
                });

            d3.timeout(_ => {
                title
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .styles({
                        opacity: 0
                    });

                name
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .styles({
                        opacity: 0
                    });
            }, 5000);
        }, 3000);

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
        
