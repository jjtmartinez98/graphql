function groupAndSumByDate(data) {
  const groupedData = {};

  for (const entry of data) {
    const { date, xp } = entry;
    if (groupedData[date]) {
      groupedData[date].xp += xp;
    } else {
      groupedData[date] = { date, xp };
    }
  }

  return Object.values(groupedData);
}

export function drawCustomChart(newData, divClassName) {
  const data = groupAndSumByDate(newData).sort((a, b) => {
    if (new Date(a.date) > new Date(b.date)) return 1;
    else if (new Date(a.date) < new Date(b.date)) return -1;
    else return 0;
  });

  const svg = d3.select(`.${divClassName}`);
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m")).tickPadding(6).tickSize(4);

  const yAxis = d3.axisLeft(y);

  const line = d3
    .line()
    .defined((d) => !isNaN(d.xp))
    .x((d) => x(new Date(d.date)))
    .y((d) => y(d.xp))
    .curve(d3.curveLinear);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  x.domain(d3.extent(data, (d) => new Date(d.date)));
  y.domain([0, d3.max(data, (d) => d.xp)]);

  g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-20) translate(-10, 0)")
    .style("font-size", "7px");

  g.append("g").attr("class", "y-axis").call(yAxis);

  // Draw the data points as circles
  const circles = g
    .selectAll(".data-point")

    .data(data)
    .enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", (d) => x(new Date(d.date)))
    .attr("cy", (d) => y(d.xp))
    .attr("r", 4)
    .attr("fill", "blue");

  // Add tooltips to the circles 
  const tip = d3
    .tip()
    .attr("class", "d3-tip")
    .html((d) => `Date: ${d.date}<br>XP: ${d.xp}`);
  svg.call(tip);
  circles.on("mouseover", tip.show).on("mouseout", tip.hide);

  // Draw the line
  g.append("path").datum(data).attr("class", "line").attr("d", line).attr("fill", "none").attr("stroke", "blue");
}

