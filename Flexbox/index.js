// waffle example

const waffle = d3.select('.waffle');

// create an array with numbers 0-99
const numbers = d3.range(1000);

//for each item in the array, add a div element
// if the number is < 5, color it red, otherwise grey
waffle
    .selectAll('.block')
    .data(numbers)
    .enter()
    .append('div')
    .attr('class', 'block')
    .style('background-color', d => (d < 500 ? '#FE4A49' : '#CCCCCC'));



// Hist example

// include data
const data = [
    { name: 'Matt', state: 'NY'},
    { name: 'Ilia', state: 'NY'},
    { name: 'Jan', state: 'NY'},
    { name: 'Caitlyn', state: 'NY'},
    { name: 'Russel', state: 'MA'},
    { name: 'Amber', state: 'WA'},
];

// nest the data by state
//const nest = d3
//    .group(data, d => d.state);
const nest = Array.from(d3
    .group(data, d => d.state), ([key, value]) => ({key, value}));

console.log("nest",nest);
// select the figure element
const hist = d3.selectAll('.hist');

// add 3 groups
// one for each state
const group = hist
    .selectAll('.group')
    .data(nest)
    .enter()
    .append('div')
    .attr('class', 'group');
console.log("group",group);

// in each group add the appropriate number of blocks
group
    .selectAll('.block')
    .data(d => d.value)
    .enter()
    .append('div')
    .attr('class', 'hist-block');

// add a state label to each group
group.append('text').text(d => d.key);

// Stacked barchart example

const socialMedia = [
    {
        month: 'April',
        counts: { Facebook: 7045, YouTube: 4816, Twitter: 4717, Instagram: 96 }
    },
    {
        month: 'May',
        counts: { Facebook: 11401, YouTube: 1708, Twitter: 10433, Instagram: 129 }
    },
    {
        month: 'June',
        counts: { Facebook: 16974, YouTube: 3199, Twitter: 9874, Instagram: 471 }
    }
];

// Add a totl value for each month
const smTotal = socialMedia.map(d => {
    const counts = Object.entries(d.counts);
    console.log("counts", counts);
    const countings = counts.map(d => d[1]);
    console.log("countings",countings);
    const total = countings.reduce((partialSum,a) => partialSum + a, 0);
    console.log("total", total)
    return { month: d.month, counts, total};
    });
        //return accumulator + value;}, 0);
        //console.log("total", total)
    
console.log("smTotal",smTotal);
console.log("smTotal.total", d3.max(smTotal, d => d.total))


// create a Y scale for the data
const scaleY = d3
    .scaleLinear()
    .domain([0, d3.max(smTotal, d => d.total)])
    .range([0, 200]);

    console.log("yScale", scaleY);
// create a color scale for the data where Facebook is red
const scaleColor = d3
    .scaleOrdinal()
    .domain(['Facebook', 'Youtube', 'Twitter', 'Instagram'])
    .range(['#FE4A49', '#cccccc', '#dddddd', '#eeeeee']);

// select the figure element
const stack = d3.select('.stack');

// add a div for each month
const stackgroup = stack
    .selectAll('.stackgroup')
    .data(smTotal)
    .enter()
    .append('div')

console.log("stackgroup", stackgroup);
console.log("smTotal.counts", smTotal.map(sm => sm.counts));
// Add a block for each social media type
const stackblock = stackgroup
    .selectAll('.stackblock')
    .data(d => d.counts)
    .enter()
    .append('div')
    .attr('class', 'stackblock')
    // scale the height of the box based on the value
    .style('height', d => `${scaleY(d[1])}px`)
    // scale the color based on the social media type
    .style('background-color', d => scaleColor(d[1]));

// add a month label
const stacklabel = stackgroup
    .append('text')
    .text(d => d.month)
    .attr('class', 'stacklabel');

// add a total count label
const count = stackgroup
    .append('text')
    .text(d => d3.format('0.2s')(d.total))
    .attr('class', 'count');
