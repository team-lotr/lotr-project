import { Nav } from "../../components/Nav";
import { MyFn } from '../../components/CharacterSelection';
import { useEffect, useRef } from "react";
import { ReactComponent as MapSvg } from "../../assets/mapome-slim.svg";
import * as d3 from "d3";

import characters from "../../data/characters.json";
import events from "../../data/events.json";
import places from "../../data/places.json";
import { drawTimeline, highlight, unhighlight } from "./drawTimeline";


const margin = { top: 0, left: 0, bottom: 0, right: 0 };
// const width = document.body.clientWidth - margin.left - margin.right;
// const height = window.innerHeight - margin.top - margin.bottom;

// Set up constants and variables for dynamic data.
let currentTime = 5;
let useCurves = true;
let highlightedCharacter;
const fadedOpacity = 0.4;
const regularStrokeWidth = 7;
const highlightedStrokeWidth = 10;

const gandalfId = 10;

function getCharacterById(id) {
  return characters.find((character) => character.id === id);
}

function getEventsWithCharacter(characterId) {
  const character = getCharacterById(characterId);
  return events.filter((event) => character.events.includes(event.id));
}

function joinEventsWithPlaces(events) {
  return events.map((event, index) => {
    const place = places.find((p) => p.id === event.place);
    return {
      id: event.id,
      t: index,
      x: place.x + index,
      y: place.y + index,
    };
  });
}

const gandalfCharacter = getCharacterById(gandalfId);
const gandalfTimeline = joinEventsWithPlaces(getEventsWithCharacter(gandalfId));
const gandalfData = {
  character: gandalfCharacter,
  timeline: gandalfTimeline,
};

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

  console.log(gandalfData);

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
      <MyFn data="hello"/>
      <div ref={chartRef}>
        <MapSvg />
      </div>
    </>
  );
}
