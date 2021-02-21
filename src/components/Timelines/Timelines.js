import { useEffect } from "react";
import { drawTimeline, highlight, unhighlight } from "./drawTimeline";
import * as d3 from "d3";

// Timelines
// This function takes an array of timelines and renders timelines
// onto an already rendered map element. The boolean "isMapRendered"
// ensures that the useEffect callback is not called without a prepared map.
export function Timelines({ data, time, isMapRendered }) {
  useEffect(() => {
    // Do data join.
    const timelinesGroup = d3.select("#timelines");
    const timelineUpdate = timelinesGroup.selectAll(".timeline").data(data);

    // Perform actions on enter selection.
    const timelineEnter = timelineUpdate
      .enter()
      .append("path")
      .classed("regularLine", true)
      .classed("timeline", true)
      .style("stroke", (d) => d.character.color1)
      .on("mouseover", highlight)
      .on("mouseout", unhighlight);

    timelineEnter.append("title").text((d) => d.character.name);

    // Perform actions on merged update and enter selections.
    timelineEnter
      .merge(timelineUpdate)
      .attr("d", (d) => drawTimeline(d, time))
      .select("title")
      .text((d) => d.character.name);

    // Remove exit selection.
    timelineUpdate.exit().remove();
  }, [isMapRendered]);

  return null;
}
