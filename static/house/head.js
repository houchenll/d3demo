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
            }, 3000);
        }, 5000);

        return svg.node();
    });

    main.variable(observer()).define(["html"], function(html) {
        return(
            html`<style>
            .title {
                font-size: 40px;
                font-weight: 800;
                fill: #252729;
            }

            .name {
              font-size: 24px;
              font-weight: 400;
              fill: #757779;
            }
            </style>`
            )
    });

    return main;
}
        
