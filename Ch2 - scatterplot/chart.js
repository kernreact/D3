async function drawLineChart() {
    // 1. Acces Data
    const dataset = await d3.json('./my_weather_data.json');
    //console.table(dataset[0]);

    const xAccessor = (d) => d.dewPoint;
    const yAccessor = (d) => d.humidity;
    const colorAccessor = d => d.cloudCover;

    //console.log(xAccessor(dataset[0]));

    // 2. Chart dimensions

    const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

    // 2.A wrapper-size
    let dimensions = {
        width: width,
        height: width,
        margin: {
            top: 10,
            right: 10,
            bottom: 50,
            left: 50
        }
    }
    // 2.B bounds
    dimensions.boundedWidth = 
        dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight =
        dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

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
    
    // 3 create scales
    
    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice();

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice();
    
    const colorScale = d3
            .scaleLinear()
            .domain(d3.extent(dataset, colorAccessor))
            .range(['orange', 'red']);

    // 4 draw data
    
    //bounds.append('path').attr('d','M 0 0 L 100 0 L 100 100 L 0 50 Z');
    const dots = bounds
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(xAccessor(d)))
        .attr('cy', (d) => yScale(yAccessor(d)))
        .attr('r', 5)
        .attr("fill", d => colorScale(colorAccessor(d)));

    // 5 draw axes
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = bounds
        .append('g')
        .call(xAxisGenerator)
        .style('transform', `translateY(${dimensions.boundedHeight}px)`);
    const xAxisLabel = xAxis
            .append('text')
            .attr('x', dimensions.boundedWidth /2)
            .attr('y', dimensions.margin.bottom - 10)
            .attr('fill', 'black')
            .style('font-size', '1.4em')
            .html('Dew point (&deg;F)');

    const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);
    const yAxis = bounds
        .append('g')
        .call(yAxisGenerator);
    const yAxisLabel = yAxis
            .append('text')
            .attr('x', -dimensions.boundedHeight / 2)
            .attr('y', -dimensions.margin.left + 15)
            .attr('fill', 'black')
            .style('font-size', '1.4em')
            .style("transform", "rotate(-90deg)")
            .style("text-anchor", "middle")
            .text('Relative humidity')

}

drawLineChart();