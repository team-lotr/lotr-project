import { useEffect } from "react";
import * as d3 from "d3";
import _ from "underscore";
import "./timelines.scss";
import { path } from "d3";
import { getFID } from "web-vitals";
import {
  addVectors,
  magnitude,
  negatedVector,
  normalize,
  objectToVector,
  perpendicularCounterClockwise,
  subtractVectors,
  vectorScalarMult,
} from "../../utils/VectorMath";

const characterCircleRadius = 5;
const hightlightedCircleRadius = 10;

let globalParallelLines = false;

// needed info:
//  char name
// for the points -> end date

function filterData(data, dateRange, bookIds) {
  const result = [];
  for (const element of data) {
    const filteredTimeline = element.timeline.filter((e) => {
      return (
        e.lotrDateValue >= dateRange.start.value && e.lotrDateValue <= dateRange.end.value && bookIds.includes(e.bookId)
      );
    });
    const sortedTimeline = _.sortBy(filteredTimeline, (e) => e.lotrDateValue);
    result.push({
      ...element,
      timeline: sortedTimeline,
    });
  }
  return result;
}

const getControlPoints = (pts, evtId) => {
  const k = Object.keys(pts).find(k => k.endsWith(evtId))
  return pts[k];
}

const makeSimpleLineData = (pd) => pd.timeline.map(e => [e.x, e.y])

const makeLineData = (pathData) =>
  pathData.timeline.reduce(
    (acc, event, i, events) => [
      ...acc,
      // add control points for up to current event if there are any
      // control point ids are made by combining fullIds of the preceding and the current event
      ...(getControlPoints(pathData.controlPoints, event.fullId)
        ? getControlPoints(pathData.controlPoints, event.fullId).map(({ x, y }) => [x, y])
        : []),
      [event.x, event.y],
    ],
    []
  );
// Offset each point on all lines depending on the line's character's id.
function parallelOffset(data, offsetMultiplier) {
  const lineData = [];
  const distanceScale = d3.scaleLinear().domain([0, 250]).range([0, offsetMultiplier]);

  // For each character's line.
  data.forEach((element, i) => {
    const lineWithOffsetPoints = [];

    // For each timeline.
    element.timeline.forEach(function (point, j, array) {
      lineWithOffsetPoints.push(point); // Always push the current point.

      if (j == array.length - 1) return; // Do nothing for the last point.

      const currentPoint = objectToVector(point);
      const nextPoint = objectToVector(array[j + 1]);
      const leftToRightVector = subtractVectors(nextPoint, currentPoint);

      // Find vector describing the nudge offset.
      const nudgeOffsetVector = vectorScalarMult(
        // Nudge perpendicularly away from the line according to the character's id.
        normalize(perpendicularCounterClockwise(leftToRightVector)),
        (element.character.id - 5) * distanceScale(magnitude(leftToRightVector))
      );

      // Vector describing the parallel offset.
      const parallelOffsetVector = vectorScalarMult(leftToRightVector, 0.2); // Some way between the current point and the next point.

      // Offset the inner points depending on character id.
      lineWithOffsetPoints.push(addVectors(currentPoint, addVectors(nudgeOffsetVector, parallelOffsetVector)));
      lineWithOffsetPoints.push(addVectors(nextPoint, addVectors(nudgeOffsetVector, negatedVector(parallelOffsetVector))));
    });

    // Replace the old event coordinates with the offset ones.
    element.timeline = lineWithOffsetPoints;
    lineData.push(element);
  });

  return lineData;
}

const line = d3.line().curve(d3.curveCardinal.tension(0.6));

// Timelines
// This function takes an array of timelines and renders timelines
// onto an already rendered map element. The boolean "isMapRendered"
// ensures that the useEffect callback is not called without a prepared map.
export function Timelines({ timelineData, dateRange, bookIds, isMapRendered, parallelLines, offsetMultiplier }) {
  useEffect(() => {
    globalParallelLines = parallelLines;

    // Filter out points that are beyond the current time or not in current books, then sort by the time.
    const data = filterData(timelineData, dateRange, bookIds);
    const lineData = globalParallelLines ? parallelOffset(data, offsetMultiplier) : data;

    const timelinesGroup = d3.select("#timelines");

    // Do data join.
    const timelineUpdate = timelinesGroup.selectAll(".timeline").data(lineData, (d) => d.character.id);
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
    const timelineMerge = timelineEnter.merge(timelineUpdate).attr("d", (d) => line(globalParallelLines ? makeSimpleLineData(d) : makeLineData(d)));

    const circleMerge = circleEnter
      .merge(circleUpdate)
      .attr("cx", (d) => (d.timeline.length > 0 ? d.timeline[d.timeline.length - 1].x : -1000000))
      .attr("cy", (d) => (d.timeline.length > 0 ? d.timeline[d.timeline.length - 1].y : -1000000));

    // Remove exit selection.
    timelineUpdate.exit().remove();
    circleUpdate.exit().remove();
  }, [isMapRendered, dateRange, bookIds, timelineData, offsetMultiplier]);

  return null;
}

// Function for highlighting a path and de-emphasizing the other paths.
const highlight = (event, d) => {

  d3.selectAll(".timeline")
    .classed("highlightedLine", (_d) => d.character.id === _d.character.id)
    .classed("fadedLine", (_d) => d.character.id !== _d.character.id)
    .classed("regularLine", false);

  d3.selectAll(".characterCircle")
    .classed("fadedCircle", (_d) => d.character.id !== _d.character.id)
    .classed("regularCircle", (_d) => d.character.id === _d.character.id);

  d3.selectAll(".regularCircle").raise().attr("r", hightlightedCircleRadius);

  d3.select("#timelines")
    .append("path")
    .classed("animatedLine", true)
    .attr("d", line(globalParallelLines ? makeSimpleLineData(d) : makeLineData(d)))
    .raise();
};

// Function for resetting the paths from the effects of the highlight function.
const unhighlight = () => {
  d3.selectAll(".animatedLine").remove();

  d3.selectAll(".timeline").classed("highlightedLine", false).classed("fadedLine", false).classed("regularLine", true);

  d3.selectAll(".characterCircle")
    .classed("fadedCircle", false)
    .classed("regularCircle", true)
    .attr("r", characterCircleRadius);
};
