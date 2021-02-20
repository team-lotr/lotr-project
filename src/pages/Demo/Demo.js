import { Nav } from "../../components/Nav";
import { MyFn } from "../../components/CharacterSelection";
import { useEffect, useRef } from "react";
import { ReactComponent as MapSvg } from "../../assets/mapome-slim.svg";
import * as d3 from "d3";

import { DataClient } from "../../data/DataClient";
import { drawTimeline, highlight, unhighlight } from "./drawTimeline";
import { renderDebugDot } from "./debugDot";
import "./Demo.scss";
import { noConflict } from "underscore";

// Set up constants and variables for dynamic data.
let currentTime = 30200000;
const debugDot = false;

// Set up the timeline data.
const dataClient = new DataClient();
const timelineData = dataClient
  .getAll("character")
  .map(character => {
    const timeline = dataClient
      .getCharacterTimelineBy("id", character.id)
      .sort((first, second) => first.lotrDateValue - second.lotrDateValue) // Sort according to ascending time.
      .reduce((noRedundantEvents, event, i, array) => { // Remove the redundant events from the timeline.
        // Only keep event if it is the first event or the previous event was not in the same place as this one.
        if (i == 0 || (i > 0 && event.placeId !== array[i-1].placeId)) {
          noRedundantEvents.push(event);
        }
        return noRedundantEvents;
      }, []);
    return { character, timeline };
  });

const updateTimelines = (selection, data) => {
  // Do data join.
  const timelineUpdate = selection.selectAll(".timeline").data(data);

  // Perform actions on enter selection.
  const timelineEnter = timelineUpdate
    .enter()
    .append("path")
    .classed("regularLine", true)
    .classed("timeline", true)
    .style("stroke", d => d.character.color1)
    .on("mouseover", highlight)
    .on("mouseout", unhighlight)

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

    if (debugDot) {
      renderDebugDot(zoomGroup, { xStart: 100, yStart: 100, radius: 10});
    }
    updateTimelines(timelinesGroup, timelineData);
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
