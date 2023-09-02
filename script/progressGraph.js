
// Data
export function BuildLineGraphData(data) {
   // Data
//    const data = [
//     { month: "Jan", value: 57 },
//     { month: "Feb", value: 150 },
//     { month: "Mar", value: 200 },
//     { month: "Apr", value: 210 },
//     { month: "May", value: 276 },
//     { month: "Jun", value: 290 },
//   ];

  // Set up the SVG container
  const svgContainer = document.getElementById("lineGraph");

  // Find the min and max values for scaling the graph
  const minValue = 0     
  //Math.min(...data.map((item) => item.value));
  const maxValue = Math.max(...data.map((item) => item.value));

  // Define the graph dimensions and margins
  const graphWidth = 300;
  const graphHeight = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  // Calculate the scaling factors for x and y axes
  const xScale = (graphWidth - margin.left - margin.right) / (data.length - 1);
  const yScale = (graphHeight - margin.top - margin.bottom) / (maxValue - minValue);

  // Build the line path
  let path = `M${margin.left},${graphHeight - margin.bottom - (data[0].value - minValue) * yScale} `;
  data.forEach((point, index) => {
    path += `L${margin.left + index * xScale},${graphHeight - margin.bottom - (point.value - minValue) * yScale} `;
  });

  // Build the line graph
  const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  linePath.setAttribute("d", path);
  linePath.setAttribute("fill", "none");
  linePath.setAttribute("stroke", "blue");
  linePath.setAttribute("stroke-width", "2");
  svgContainer.appendChild(linePath);

  let lastMonth = 0 
  // Build data point dots and tooltips
  data.forEach((point, index) => {


    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", margin.left + index * xScale);
    dot.setAttribute("cy", graphHeight - margin.bottom - (point.value - minValue) * yScale);
    dot.setAttribute("r", "4");
    dot.setAttribute("fill", "blue");
    dot.style.cursor = "pointer";
    svgContainer.appendChild(dot);

    const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tooltip.setAttribute("x", margin.left + index * xScale);
    tooltip.setAttribute("y", graphHeight - margin.bottom - (point.value - minValue) * yScale - 10);
    tooltip.setAttribute("text-anchor", "middle");
    tooltip.setAttribute("font-size", "12px");
    tooltip.textContent = point.value - lastMonth;
    tooltip.style.visibility = "hidden";
    svgContainer.appendChild(tooltip);

    lastMonth = point.value

    dot.addEventListener("mouseover", () => {
      tooltip.style.visibility = "visible";
    });

    dot.addEventListener("mouseout", () => {
      tooltip.style.visibility = "hidden";
    });
  });

  // Build x-axis labels (months)
  data.forEach((point, index) => {
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", margin.left + index * xScale);
    label.setAttribute("y", graphHeight - margin.bottom + 20);
    label.setAttribute("text-anchor", "middle");
    label.textContent = point.month;
    svgContainer.appendChild(label);
  });

  // Build y-axis labels (values)
  const yLabels = [minValue, (minValue + maxValue) / 2, maxValue];
  yLabels.forEach((labelValue) => {
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", margin.left - 10);
    label.setAttribute("y", graphHeight - margin.bottom - (labelValue - minValue) * yScale);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("alignment-baseline", "middle");
    label.textContent = labelValue;
    svgContainer.appendChild(label);
  });

  // Add x-axis line
  const xAxisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xAxisLine.setAttribute("x1", margin.left);
  xAxisLine.setAttribute("x2", graphWidth - margin.right);
  xAxisLine.setAttribute("y1", graphHeight - margin.bottom);
  xAxisLine.setAttribute("y2", graphHeight - margin.bottom);
  xAxisLine.setAttribute("stroke", "black");
  xAxisLine.setAttribute("stroke-width", "1");
  svgContainer.appendChild(xAxisLine);

  // Add y-axis line
  const yAxisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  yAxisLine.setAttribute("x1", margin.left);
  yAxisLine.setAttribute("x2", margin.left);
  yAxisLine.setAttribute("y1", margin.top);
  yAxisLine.setAttribute("y2", graphHeight - margin.bottom);
  yAxisLine.setAttribute("stroke", "black");
  yAxisLine.setAttribute("stroke-width", "1");
  svgContainer.appendChild(yAxisLine);
}