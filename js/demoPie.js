const width = 900,
      height = 600,
      radius = Math.min(width, height) / 2;

const pie = d3.pie()
      .sort(null)
      .value((d) => {
        return d.value;
      });

const arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

const svg = d3.select("body")
	.append("svg")
  .attr('width', width)
  .attr('height', height)
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const key = (d) => {
  return d.data.label;
}

const color = d3.scaleOrdinal(d3.schemeCategory20);
const domain = ["Java", "Go", "JavaScript","Coffe", "Node", "Schema", "Ruby", "PHP", "C++", "C", "Shell"];

function randomData () {
  let labels = domain;
  return labels.map((label) => {
    return { label, value: Math.random() }
  });
}

change(randomData());
change(randomData());

d3.select('.randomize')
  .on('click', () => {
    change(randomData());
  });

function change (data) {
  /* ------------- ARC ------------ */

  const piedata = pie(data);
  let positions = [];
  const slice = svg.select('.slices')
        .selectAll('path.slice')
        .data(piedata, key);

  slice.enter()
        .insert('path')
        .attr('class', 'slice')
        .style('fill', (d) => color(d.data.label));

  slice.transition()
        .duration(1000)
        .attrTween('d', function(d) {
          this._current = this._current || d;
          const interpolate  = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            return arc(interpolate(t))
          }
        });

  slice.exit()
        .remove();

  /* ------------- TEXT ------------ */

  const text = svg.select('.labels')
        .selectAll('text')
        .data(piedata, key);

  text.enter()
      .insert('text')
      .attr('dy', '.35em')
      .text((d) => {
        return d.data.label;
      })

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  text.transition().duration(1000)
      .attrTween("transform", function(d, i) {
			this._current = this._current || d;
			const interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
      let yOffset = 0;
      const pos = outerArc.centroid(d);
      pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
      positions[i] = { pos };
      if (i !== 0) {
        const pre = positions[i - 1].pos;
        if (pre[0] === pos[0]) {
          const distance = pos[1] - pre[1];
          if (-20 < distance && distance < 20) {
            yOffset = distance > 0 ? 20 - distance : -(20 + distance);
            pos[1] += yOffset;
            positions[i].pos = pos;
            positions[i].yOffset = yOffset;
          }
        }
      }
			return function(t) {
				const d3 = interpolate(t);
				const pos = outerArc.centroid(d3);
				pos[0] = radius * (midAngle(d3) < Math.PI ? 1 : -1);
        pos[1] += yOffset;
				return "translate("+ pos +")";
			};
		})
    .styleTween("text-anchor", function(d){
			this._current = this._current || d;
			const interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return (t) => {
				const d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start" : "end";
			};
		});

    text.exit()
		.remove();

    /* ------- OLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(piedata, key);
	
	polyline.enter()
		.append("polyline")
    .style('stroke-width', 2)
    .style('stroke', '#555')
    .style('fill', 'none');

	polyline.transition().duration(1000)
		.attrTween("points", function(d, i){
			this._current = this._current || d;
			const interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
      const yOffset = positions[i].yOffset;
			return (t) => {
				const d2 = interpolate(t);
				const pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);

        const pos2 = outerArc.centroid(d2)
        if (yOffset) {
          pos[1] += yOffset;
          pos2[1] += yOffset;
        }
				return [arc.centroid(d2), pos2, pos];
			};			
		});
	
	polyline.exit()
		.remove();
}
