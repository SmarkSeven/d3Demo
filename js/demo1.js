// 画布宽高
const width = 400;
const height = 400;
// 数据集
const dataset = [ 250 , 210 , 170 , 130 , 90 , 124 , 145 , 130 , 190 ];
const rectWidth = 25;

// 画布周边的空白
const padding = {left:30, right:30, top:20, bottom:20};

// 矩形之间的空白
const rectPadding = 4;
// x轴的比例尺
const xScale = d3.scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([0, width - padding.left - padding.right]);

// y轴的比例尺
const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([width - padding.top - padding.bottom, 0])

// x轴
const xAxis = d3.axisBottom()
      .scale(xScale);

// y轴
const yAxis = d3.axisLeft()
      .scale(yScale);

// 添加画布
let svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// 添加矩形
svg.selectAll('.rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d, i) => {
      return xScale(i) + rectPadding / 2 +  padding.left;
    })
    .attr('y', (d) => {
      return  height - padding.bottom;
    })
    .attr('width', xScale.bandwidth() - rectPadding)
    .attr('height', 0)
    .attr('fill', 'steelblue')
    .transition()
    .delay(function(d,i){
        return i * 200;
    })
    .duration(2000)
    .attr('y', (d) => {
      return yScale(d) + padding.top;
    })
    .attr('height', (d) => {
      return height - padding.top - padding.bottom - yScale(d);
    })

// 添加文字
svg.selectAll('.text')
    .data(dataset)
    .enter()
    .append('text')
    .attr('class', 'text')
    .attr('x', (d, i) => {
      return xScale(i) + rectPadding / 2 +  padding.left;
    })
    .attr('y', (d) => {
      return  height - padding.bottom;
    })
    .attr('dx', () => {
      return (xScale.bandwidth() - rectPadding) / 2;
    })
    .attr('dy', (d) => {
      return 20;
    })
    .text((d) => {
      return d;
    })
    .transition()
    .delay(function(d,i){
        return i * 200;
    })
    .duration(2000)
    .attr('y', (d) => {
      return yScale(d) + padding.top;
    })
    
svg.append('g')
    .attr('transform', "translate(" + padding.left + "," + (height - padding.bottom) + ")")
    .call(xAxis);

svg.append('g')
    .attr('transform', "translate(" + padding.left + "," + padding.bottom + ")")
    .call(yAxis);
