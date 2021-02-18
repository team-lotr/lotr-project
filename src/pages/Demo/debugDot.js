import * as d3 from "d3";

export const renderDebugDot = (selection, props) => {
  const {
    xStart,
    yStart,
    radius
  } = props

  let circleData = [{ x: xStart, y: yStart }];

  const circle = selection
    .append("circle")
    .data(circleData)
    .attr("id", "debugDot")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", radius)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  circle.append("title")
    .text(d => `x: ${Math.trunc(d.x)}, y: ${Math.trunc(d.y)}`);
}

const dragstarted = (event, d) => {
  d3.selectAll("#debugDot").raise().attr("stroke", "black");
}

const dragged = (event, d) => {  
  d3.selectAll("#debugDot")
    .attr("cx", d.x = event.x)
    .attr("cy", d.y = event.y);

  d3.selectAll("#debugDot")
    .select("title")
    .text(d => `x: ${Math.trunc(d.x)}, y: ${Math.trunc(d.y)}`);
}

const dragended = (event, d) => {
  d3.selectAll("#debugDot").attr("stroke", null);
}