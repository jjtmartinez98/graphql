export function GeneratePieGraph(doneInt, receivedInt){
    // Data
    const newData = [
    { label: "Green", value: doneInt },
    { label: "Yellow", value: receivedInt },
    ];

    // Set up the SVG container
    const newSvgContainer = document.getElementById("pieChart");

    // Calculate the total value
    const totalValue = newData.reduce((total, item) => total + item.value, 0);

    // Define the pie chart dimensions and center
    const pieWidth = 300;
    const pieHeight = 300;
    const centerX = pieWidth / 2;
    const centerY = pieHeight / 2;

    // Set up the colors for the sections
    const colors = ["green", "yellow"];

    // Create the pie chart
    let startAngle = 0;
    newData.forEach((item, index) => {
    const percentage = item.value / totalValue;
    const endAngle = startAngle + percentage * (Math.PI * 2);

    // Create the path for the section
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const x1 = centerX + Math.cos(startAngle) * pieWidth / 2;
    const y1 = centerY + Math.sin(startAngle) * pieHeight / 2;
    const x2 = centerX + Math.cos(endAngle) * pieWidth / 2;
    const y2 = centerY + Math.sin(endAngle) * pieHeight / 2;
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    const pathData = `M ${centerX},${centerY} L ${x1},${y1} A ${pieWidth / 2} ${pieHeight / 2} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
    path.setAttribute("d", pathData);
    path.setAttribute("fill", colors[index]);
    path.setAttribute("stroke", "white");
    path.setAttribute("stroke-width", "2");
    newSvgContainer.appendChild(path);

    // Add tooltip
    const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const tooltipX = centerX + Math.cos(startAngle + percentage * Math.PI) * pieWidth / 3;
    const tooltipY = centerY + Math.sin(startAngle + percentage * Math.PI) * pieHeight / 3;
    tooltip.setAttribute("x", tooltipX);
    tooltip.setAttribute("y", tooltipY);
    tooltip.setAttribute("text-anchor", "middle");
    tooltip.setAttribute("alignment-baseline", "middle");
    tooltip.setAttribute("fill", "black");
    tooltip.textContent = item.value.toFixed(2);
    tooltip.style.visibility = "hidden";
    newSvgContainer.appendChild(tooltip);

    // Show tooltip on hover
    path.addEventListener("mouseover", () => {
        tooltip.style.visibility = "visible";
    });

    path.addEventListener("mouseout", () => {
        tooltip.style.visibility = "hidden";
    });

    // Update the startAngle for the next section
    startAngle = endAngle;
    });
}