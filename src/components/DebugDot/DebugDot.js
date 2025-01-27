import { useEffect, useState } from "react";
import * as d3 from "d3";

// HOW TO ACTIVATE DEBUG DOT
// 1. Get React Developer Tools
// 2. Open components tab
// 3. Find DebugDot
// 4. Under props: showDot = true
// 5. Use it as usual
// 6. Refresh the page to get rid of it

const renderDebugDot = (selection, props) => {
  const { xStart, yStart, radius } = props;

  let circleData = [{ x: xStart, y: yStart }];

  const circle = selection
    .append("circle")
    .data(circleData)
    .attr("id", "debugDot")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", radius)
    .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

  circle.append("title").text((d) => `x: ${Math.trunc(d.x)}, y: ${Math.trunc(d.y)}`);
};

const dragstarted = (event, d) => {
  d3.selectAll("#debugDot").raise().attr("stroke", "black");
};

const dragged = (event, d) => {
  d3.selectAll("#debugDot")
    .attr("cx", (d.x = event.x))
    .attr("cy", (d.y = event.y));

  d3.selectAll("#debugDot")
    .select("title")
    .text((d) => `x: ${Math.trunc(d.x)}, y: ${Math.trunc(d.y)}`);
};

const dragended = (event, d) => {
  d3.selectAll("#debugDot").attr("stroke", null);
  console.log(`{ "x": ${Number(d.x.toFixed(0))}, "y": ${Number(d.y.toFixed(0))} }`)
};

export function DebugDot({ isMapRendered, showDot }) {
  // const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    const zoomGroup = d3.select("#zoomContainer");
    if (showDot) {
      renderDebugDot(zoomGroup, { xStart: 1000, yStart: 1000, radius: 10 });
    } else {
      d3.select("#debugDot").remove();
    }
  }, [isMapRendered, showDot]);

  // return <Setting label="Toggle Debug Dot" value={showDot} type="boolean" onChange={(v) => setShowDot(v)} />;
  return null;
}
