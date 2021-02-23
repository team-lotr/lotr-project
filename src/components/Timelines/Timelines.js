import { useEffect } from "react";
import * as d3 from "d3";
import _ from "underscore";
import "./timelines.scss";

const characterCircleRadius = 5;
const hightlightedCircleRadius = 10;

function filterData(data, time) {
  data.forEach((element) => {
    element.timeline = _.sortBy(
      element.timeline.filter((event) => event.lotrDateValue <= time),
      (event) => event.lotrDateValue
    );
  });
  return data;
}

const makeLineData = (pathData) => pathData.timeline.map((event) => [event.x, event.y]);

const line = d3.line().curve(d3.curveCardinal.tension(0.6));

// Timelines
// This function takes an array of timelines and renders timelines
// onto an already rendered map element. The boolean "isMapRendered"
// ensures that the useEffect callback is not called without a prepared map.
export function Timelines({ data, time, isMapRendered }) {
  useEffect(() => {
    // Filter out points that are beyond the current time, then sort by the time.
    data = filterData(data, time);

    const timelinesGroup = d3.select("#timelines");

    // Do data join.
    const timelineUpdate = timelinesGroup.selectAll(".timeline").data(data, (d) => d);
    const circleUpdate = timelinesGroup.selectAll(".characterCircle").data(data, (d) => d);

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

    const circleEnter = circleUpdate
      .enter()
      .append("circle")
      .classed("characterCircle", true)
      .attr("r", characterCircleRadius)
      .style("fill", (d) => d.character.color1)
      .on("mouseover", highlight)
      .on("mouseout", unhighlight);

    circleEnter.append("title").text((d) => d.character.name);

    // Perform actions on merged update and enter selections.
    const timelineMerge = timelineEnter
      .merge(timelineUpdate)
      .attr("d", (d) => line(makeLineData(d)));

    const circleMerge = circleEnter
      .merge(circleUpdate)
      .attr("cx", (d) => (d.timeline.length > 0 ? d.timeline[d.timeline.length - 1].x : -1000000))
      .attr("cy", (d) => (d.timeline.length > 0 ? d.timeline[d.timeline.length - 1].y : -1000000));

    // Remove exit selection.
    timelineUpdate.exit().remove();
    circleUpdate.exit().remove();
  }, [isMapRendered, time]);

  return null;
}

// Function for highlighting a path and de-emphasizing the other paths.
const highlight = (event, d) => {
  d3.selectAll(".timeline")
    .classed("highlightedLine", (_d) => d.character.id === _d.character.id)
    .classed("fadedLine", (_d) => d.character.id !== _d.character.id)
    .classed("regularLine", false);

  d3.selectAll(".highlightedLine").raise();

  d3.selectAll(".characterCircle")
    .classed("fadedCircle", (_d) => d.character.id !== _d.character.id)
    .classed("regularCircle", (_d) => d.character.id === _d.character.id);

  d3.selectAll(".regularCircle").raise().attr("r", hightlightedCircleRadius);
};

// Function for resetting the paths from the effects of the highlight function.
const unhighlight = () => {
  d3.selectAll(".timeline").classed("highlightedLine", false).classed("fadedLine", false).classed("regularLine", true);

  d3.selectAll(".characterCircle")
    .classed("fadedCircle", false)
    .classed("regularCircle", true)
    .attr("r", characterCircleRadius);
};
