import { useEffect } from "react";
import * as d3 from "d3";
import _ from "underscore";
import "./events.scss";

const regularEventRadius = 4;
const hightlightedEventRadius = 6;

// Events
// This function takes an array of events onto an already rendered map element.
// The boolean "isMapRendered" ensures that the useEffect callback is not
// called without a prepared map.
export function Events({ data, time, isMapRendered }) {
  useEffect(() => {
    if (!data) return;

    // Filter out events that are beyond the current time, then sort by the time.
    data = data.filter((event) => event.lotrDateValue <= time);

    const eventsGroup = d3.select("#events");

    // Do data join.
    const circleUpdate = eventsGroup.selectAll(".event").data(data);

    // Perform actions on enter selection.
    const circleEnter = circleUpdate
      .enter()
      .append("circle")
      .classed("event", true)
      .attr("r", regularEventRadius)
      .on("mouseover", highlight)
      .on("mouseout", unhighlight);

    circleEnter.append("title").text((d) => d.name);

    // Perform actions on merged update and enter selections.
    const circleMerge = circleEnter
      .merge(circleUpdate)
      .attr("cx", (d) => d.place.x)
      .attr("cy", (d) => d.place.y);

    // Remove exit selection.
    circleUpdate.exit().remove();
  }, [isMapRendered, time]);

  return null;
}

// Function for highlighting a path and de-emphasizing the other events.
const highlight = (event, d) => {
  d3.selectAll(".event")
    .classed("highlightedEvent", (_d) => d.id === _d.id)
    .classed("regularEvent", (_d) => d.id !== _d.id);

  d3.selectAll(".highlightedEvent").raise().attr("r", hightlightedEventRadius);
};

// Function for resetting the paths from the effects of the highlight function.
const unhighlight = () => {
  d3.selectAll(".event").classed("highlightedEvent", false).classed("regularEvent", true).attr("r", regularEventRadius);
};
