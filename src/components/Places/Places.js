import { useEffect } from "react";
import * as d3 from "d3";
import _ from "underscore";
import "./places.scss";

const regularPlaceRadius = 4;
const hightlightedPlaceRadius = 6;

// Places
// This function takes an array of places onto an already rendered map element.
// The boolean "isMapRendered" ensures that the useEffect callback is not
// called without a prepared map.
export function Places({ data, time, isMapRendered, onClick, zoomPercent }) {
  useEffect(() => {
    if (!data) return;

    // Filter out events that are beyond the current time.
    data = data
      // For each place, filter out events that are beyond the current time.
      .map((place) => ({
        ...place,
        // filter by event type relative to zoom percentage
        events: place.events.filter((event) => event.lotrDateValue <= time && zoomPercent >= event.evt_type * 0.1) }))
      // Then, for each place, remove the ones that now have empty events lists.
      .filter((place) => place.events.length > 0);

    const placesGroup = d3.select("#places");

    // Do data join.
    const circleUpdate = placesGroup.selectAll(".place").data(data, (d) => d);

    // Perform actions on enter selection.
    const circleEnter = circleUpdate
      .enter()
      .append("circle")
      .classed("place", true)
      .attr("r", regularPlaceRadius)
      .on("mouseover", highlight)
      .on("mouseout", unhighlight)
      .on("click", onClick);

    circleEnter.append("title");

    // Perform actions on merged update and enter selections.
    const circleMerge = circleEnter
      .merge(circleUpdate)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    circleMerge.select("title").text((d) => d.events.map((event) => event.name).join(", "));

    // Remove exit selection.
    circleUpdate.exit().remove();
  }, [isMapRendered, time, zoomPercent]);

  return null;
}

// Function for highlighting a path and de-emphasizing the other places.
const highlight = (place, d) => {
  d3.selectAll(".place")
    .classed("highlightedplace", (_d) => _d.id === d.id)
    .classed("regularplace", (_d) => _d.id !== d.id);

  d3.selectAll(".highlightedplace").raise().attr("r", hightlightedPlaceRadius);
};

// Function for resetting the paths from the effects of the highlight function.
const unhighlight = () => {
  d3.selectAll(".place").classed("highlightedplace", false).classed("regularplace", true).attr("r", regularPlaceRadius);
};
