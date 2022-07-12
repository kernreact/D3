async function drawMap() {

  // grab the data
  const countryShapes = await d3.json('./../world-geojson.json');

  console.log(countryShapes);

  const countryNameAccessor = d => d.properties['NAME'];
  const countryIdAccessor = d => d.properties['ADM0_A3_IS'];

  const dataset = await d3.csv('./../data_bank_data.csv');
  console.log(dataset);

  const metric = 'Population growth (annual %)';

  let metricDataByCountry = {};

  dataset.forEach((d) => {
    if(d['Series Name'] != metric) return;
    metricDataByCountry[d['Country Code']] = +d['2017 [YR2017]'] || 0;
  });

  console.log(metricDataByCountry);

  // chart dimensions
  let dimensions = {
    width: window.innerWidth * 0.9,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    }
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  
  const sphere = { type: 'Sphere' };

  const projection = d3.geoEqualEarth().fitWidth(dimensions.boundedWidth, sphere);

  const pathGenerator = d3.geoPath(projection);
  console.log(pathGenerator(sphere));
  console.log(pathGenerator.bounds(sphere));

  const [[x0, y0],[x1, y1]] = pathGenerator.bounds(sphere);

  dimensions.boundedHeigth = y1;
  dimensions.height = dimensions.boundedHeigth + dimensions.margin.top + dimensions.margin.bottom;
  dimensions.boundedHeight = y1
  
  // draw canvas
  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // Draw scales
  const metricValues = Object.values(metricDataByCountry);
  console.log("mv", metricValues);

  const metricValueExtent = d3.extent(metricValues);
  console.log(metricValueExtent);
  const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]]);
  const colorScale = d3
      .scaleLinear()
      .domain([-maxChange, 0, maxChange])
      .range(['indigo', 'white', 'darkgreen']);

  // draw the data
  const earth = bounds
      .append('path')
      .attr('class', 'earth')
      .attr('d', pathGenerator(sphere));

  const graticuleJson = d3.geoGraticule10();
  console.log(graticuleJson);

  const graticule = bounds
      .append('path')
      .attr('class', 'graticule')
      .attr('d', pathGenerator(graticuleJson));
  console.log(graticule);
  
  const countries = bounds
      .selectAll('.country')
      .data(countryShapes.features)
      .join('path')
        .attr("class", "country")
        .attr("d", pathGenerator)
        .attr("fill", d => {
          const metricValue = metricDataByCountry[countryIdAccessor(d)];
          if(typeof metricValue == 'undefined') return "#e2e6e9";
          return colorScale(metricValue);
        });



}
drawMap()