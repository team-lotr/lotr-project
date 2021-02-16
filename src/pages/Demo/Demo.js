import { Nav } from "../../components/Nav";
import { MyFn } from "../../components/CharacterSelection";
import { useEffect, useRef } from "react";
import { ReactComponent as MapSvg } from "../../assets/mapome-slim.svg";
import * as d3 from "d3";

import { DataClient } from "../../data/DataClient";
import { drawTimeline, highlight, unhighlight } from "./drawTimeline";

const margin = { top: 0, left: 0, bottom: 0, right: 0 };
// const width = document.body.clientWidth - margin.left - margin.right;
// const height = window.innerHeight - margin.top - margin.bottom;

// Set up constants and variables for dynamic data.
let currentTime = 30200000;
let useCurves = true;
let highlightedCharacter;
const fadedOpacity = 0.4;
const regularStrokeWidth = 7;
const highlightedStrokeWidth = 10;

const dataClient = new DataClient();
const gandalfId = 10;
const gandalfData = {
  character: dataClient.getCharacterBy("id", gandalfId),
  timeline: dataClient.getCharacterTimelineBy("id", gandalfId),
};

// Modification to get path drawing working until we handle
// two subsequent events being in the same place
gandalfData.timeline[0].x += 1;

const updateTimelines = (selection, data) => {
  // Do data join.
  const timelineUpdate = selection.selectAll(".timeline").data(data);

  // Perform actions on enter selection.
  const timelineEnter = timelineUpdate
    .enter()
    .append("path")
    .style("stroke-width", regularStrokeWidth)
    .style("stroke", (d) => d.character.color)
    .style("fill", "none")
    .attr("class", "timeline");
  // .on("mouseover", highlight)
  // .on("mouseout", unhighlight)

  timelineEnter.append("title").text((d) => d.character.name);

  // Perform actions on merged update and enter selections.
  timelineEnter
    .merge(timelineUpdate)
    .attr("d", (d) => drawTimeline(d, currentTime))
    .select("title")
    .text((d) => d.character.name);

  // Remove exit selection.
  timelineUpdate.exit().remove();
};

export function Demo() {
  const chartRef = useRef(null);

  useEffect(() => {
    const svg = d3.select("svg");
    const zoomGroup = d3.select("#zoomContainer");
    const timelinesGroup = zoomGroup.append("g").attr("id", "timelines");

    // Add zooming and panning to the zoom group.
    svg.call(
      d3.zoom().on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      })
    );

    updateTimelines(timelinesGroup, [gandalfData]);
  }, []);

  return (
    <>
      <Nav />
      <h2>Demo</h2>
      <MyFn data="hello" />
      <div ref={chartRef}>
        <MapSvg />
      </div>
    </>
  );
}
