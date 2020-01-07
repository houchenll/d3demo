export default function define(runtime, observer) {
    const main = runtime.module();

    // main.variable(observer("chart")).define("chart", ["d3", "DOM", "dataset", "width", "world_simplified", "projection", "topojson"], function(d3, DOM, dataset, width, world_simplified, projection, topojson) {
    main.variable(observer("chart")).define("chart", ["d3", "DOM", "width"], function(d3, DOM, width) {
        const height = 1000;
        const svg = d3.select(DOM.svg(width, height));
        console.log(`enter chart, width ${width}, svg is ${svg}, DOM is ${DOM}, d3 is ${d3}`);

        // let colourScale = d3.scaleOrdinal()
            // .range(["#adb0ff", "#ffb3ff", "#90d595", "#e48381", "#aafbff", "#f7bb5f", "#eafb50"])
            // .domain(["India","Europe","Asia","Latin America","Middle East","North America","Africa"]);

        // let regions = world_simplified.objects.ne_10m_admin_0_countries.geometries.map(d => d.properties.REGION_WB);
        // regions = [...new Set(regions)];

        // const path = d3.geoPath().projection(projection);

        let mapLegend = svg.append('g')
            .attr('class', 'map-legend')
            .attr('transform', 'translate(10, 10)');
        console.log(mapLegend);

        // let mapLegend = svg.append('g')
        //     .attrs({
        //         class: 'map-legend',
        //         transform: 'translate(10, 10)'
        //     });
        // console.log(mapLegend);
        mapLegend
            .append('rect')
            .attrs({
                x: 0,
                y: 0,
                width: 1000,
                height: 800
            })
            .styles({
                fill: '#ff0000',
                stroke: '#dddddd'
            });

        console.log(`chart width ${width}, height ${height}, mapLegend is ${mapLegend}`);

        // mapLegend
        //     .append('path')
        //     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'South Asia')))
        //     .attrs({
        //       d: path,
        //       fill: colourScale('India')
        //     });
        
        // mapLegend
        //     .append('path')
        //     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'East Asia & Pacific')))
        //     .attrs({
        //       d: path,
        //       fill: colourScale('Asia')
        //     });
          
        // mapLegend
        //     .append('path')
        //     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'Europe & Central Asia' && d.properties.ADMIN != 'Greenland')))
        //     .attrs({
        //       d: path,
        //       fill: colourScale('Europe')
        //     });
          
        // mapLegend
        //     .append('path')
        //     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'North America')))
        //     .attrs({
        //       d: path,
        //       fill: colourScale('North America')
        //     });
          
        // mapLegend
        //     .append('path')
        //     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'Middle East & North Africa')))
        //     .attrs({
        //       d: path,
        //       fill: colourScale('Middle East')
        //     });
          
        // mapLegend
        //     .append('path')
        //     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'Sub-Saharan Africa')))
        //     .attrs({
        //       d: path,
        //       fill: colourScale('Africa')
        //     });
        
        // mapLegend
        //     .append('path')
        //     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'Latin America & Caribbean')))
        //     .attrs({
        //       d: path,
        //       fill: colourScale('Latin America')
        //     });

        return svg.node();
    });

    // main.variable(observer("dataset")).define("dataset", ["d3"], function(d3) {
    //     return(
    //         d3.csv('https://gist.githubusercontent.com/johnburnmurdoch/4199dbe55095c3e13de8d5b2e5e5307a/raw/fa018b25c24b7b5f47fd0568937ff6c04e384786/city_populations')
    //     )
    // });

    // // 世界地图坐标数据
    // main.variable(observer("world")).define("world", ["d3"], function(d3) {
    //     return(
    //         d3.json("https://gist.githubusercontent.com/johnburnmurdoch/b6a18add7a2f8ee87a401cb3055ccb7b/raw/f46c5c442c5191afc105b934b4b68c653545b7c1/ne_10m_simplified.json")
    //     )
    // });

    // // topojson是表示地图的d3作者定义的json格式，用于解析地图json数据
    // main.variable(observer("topojson")).define("topojson", ["require"], function(require) {
    //     return(
    //         require('topojson-client@3', 'topojson-simplify@3')
    //     )
    // });

    // // 使用topojson解析地图数据
    // main.variable(observer("world_simplified")).define("world_simplified", ["topojson", "world"], function(topojson, world) {
    //     let word_simplified = topojson.presimplify(world);
    //     let min_weight = topojson.quantile(word_simplified, 0.3);
    //     word_simplified = topojson.simplify(word_simplified, min_weight);

    //     let land = word_simplified;

    //     return land
    // });

    // main.variable(observer("projection")).define("projection", ["d3", "land"], function(d3, land) {
    //     return(
    //         d3.geoNaturalEarth1().fitSize([220, 125], land)
    //     )
    // });

    // main.variable(observer("land")).define("land", ["topojson", "world_simplified"], function(topojson, world_simplified) {
    //     return(
    //         topojson.feature(world_simplified, {
    //             type: 'GeometryCollection',
    //             geometries: world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => ['Antarctica','Greenland'].includes(d.properties.ADMIN))
    //         })
    //     )
    // });


    return main;
}