import { useEffect, useState } from "react";
import * as d3 from "d3";
import "./debug-dot.scss";

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
};

export function DebugDot({ isMapRendered }) {
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    const zoomGroup = d3.select("#zoomContainer");
    if (showDot) {
      renderDebugDot(zoomGroup, { xStart: 100, yStart: 100, radius: 10 });
    } else {
      d3.select("#debugDot").remove();
    }
  }, [isMapRendered, showDot]);

  return (
    <div className="debugDot">
      <label>
        DebugDot
        <input type="checkbox" checked={showDot} onChange={() => setShowDot(!showDot)} />
      </label>
    </div>
  );
}