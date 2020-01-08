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
        console.log(dataset);

        const height = 600;
        const svg = d3.select(DOM.svg(width, height));

        svg.append('text')
            .attrs({
                class: 'title',
                y: 24
            })
            .html('hello world');

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