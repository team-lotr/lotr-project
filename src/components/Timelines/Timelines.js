import { useEffect } from "react";
import * as d3 from "d3";
import _ from "underscore";
import "./timelines.scss";
import { addVectors, normalize, objectToVector, perpendicularCounterClockwise, subtractVectors, vectorScalarMult } from "../../utils/VectorMath";

const characterCircleRadius = 5;
const hightlightedCircleRadius = 10;
const characterIdOffsetMultiplier = 5;

function filterData(data, time) {
  data.forEach((element) => {
    element.timeline = _.sortBy(
      element.timeline.filter((event) => event.lotrDateValue <= time),
      (event) => event.lotrDateValue
    );
  });
  return data;
}

// Offset each point on all lines depending on the line's character's id.
function parallelOffset(data) {
  // For each character's line.
  data.forEach((element, i) => {
    // The new points that are offset.
    const offsetPoints = [];

    // For each timeline.
    element.timeline
      .map((event) => objectToVector(event)) // Convert coordinates to position vectors and iterate to make control points.
      .forEach(function (point, j, array) {
        if (j == 0 || j == array.length - 1) { // First endpoint or last endpoint.
          offsetPoints.push(point);
        } else { // Any inner point.
          const left = array[j - 1];
          const right = array[j + 1];

          // Find vector describing offset direction.
          const offsetUnitVector = normalize(perpendicularCounterClockwise(subtractVectors(right, left)));

          // Offset the inner point depending on character id.
          offsetPoints.push(addVectors(point, vectorScalarMult(offsetUnitVector, (element.character.id - 5) * characterIdOffsetMultiplier)));
        }
      });

    // Replace the old event coordinates with the offset ones.
    element.timeline = element.timeline.map((event, i) => ({ ...event, x: offsetPoints[i].x, y: offsetPoints[i].y }));
  });

  return data;
}

const makeLineData = (pathData) => pathData.timeline.map((event) => [event.x, event.y]);

const line = d3.line().curve(d3.curveCardinal.tension(0.6));

// Timelines
// This function takes an array of timelines and renders timelines
// onto an already rendered map element. The boolean "isMapRendered"
// ensures that the useEffect callback is not called without a prepared map.
export function Timelines({ data, time, isMapRendered, parallelLines }) {
  useEffect(() => {
    // Filter out points that are beyond the current time, then sort by the time.
    data = filterData(data, time);

    if (parallelLines) {
      data = parallelOffset(data);
    }

    const timelinesGroup = d3.select("#timelines");

    // Do data join.
    const timelineUpdate = timelinesGroup.selectAll(".timeline").data(data, (d) => d.character.id);
    const circleUpdate = timelinesGroup.selectAll(".characterCircle").data(data, (d) => d.character.id);

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
    const timelineMerge = timelineEnter.merge(timelineUpdate).attr("d", (d) => line(makeLineData(d)));

    const circleMerge = circleEnter
      .merge(circleUpdate)
      .attr("cx", (d) => (d.timeline.length > 0 ? d.timeline[d.timeline.length - 1].x : -1000000))
      .attr("cy", (d) => (d.timeline.length > 0 ? d.timeline[d.timeline.length - 1].y : -1000000));

    // Remove exit selection.
    timelineUpdate.exit().remove();
    circleUpdate.exit().remove();
  }, [isMapRendered, time, data]);

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
