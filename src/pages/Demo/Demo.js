import { useEffect, useRef, useState } from "react";
import { ReactComponent as MapSvg } from "../../assets/mapome-slim.svg";
import * as d3 from "d3";

import { DataClient } from "../../data/DataClient";
import { Timelines } from "../../components/Timelines";
import { Places } from "../../components/Places";
import { Header } from "../../components/Header";
import { DebugDot } from "../../components/DebugDot";
import { TimeSelector } from "../../components/TimeSelector";
import { CharacterFilter } from "../../components/CharacterFilter";
import { LotrDate } from "../../data/LotrDate";
import "./Demo.scss";

const dataClient = new DataClient();
const characterData = dataClient.getAll("character");

export function Demo() {
  const chartRef = useRef(null);
  const [isMapRendered, setIsMapRendered] = useState(false);
  const [currentTime, setCurrentTime] = useState(new LotrDate("12 Apr 3018"));
  const [activeCharacters, setActiveCharacters] = useState(characterData.map((c) => c.id));

  // Set up the timeline data.

  const timelineData = dataClient.getAll("character").map((character) => {
    const timeline = dataClient
      .getCharacterTimelineBy("id", character.id, "lotrDateValue")
      .reduce((noRedundantEvents, event, i, array) => {
        // Remove the redundant events from the timeline.
        // Only keep event if it is the first event or the previous event was not in the same place as this one.
        if (i == 0 || (i > 0 && event.placeId !== array[i - 1].placeId)) {
          noRedundantEvents.push(event);
        }
        return noRedundantEvents;
      }, []);
    return { character, timeline };
  });
  const distinctEventDates = dataClient.getDistinctDates();

  // Set up the place data.
  const placeData = dataClient.getAll("place").map((place) => ({
    ...place,
    events: dataClient
      .getAll("event")
      .filter((event) => event.placeId === place.id)
      .map((event) => ({ ...event, lotrDateValue: new LotrDate(event.date).value }))
      .sort((first, second) => first.lotrDateValue - second.lotrDateValue),
  }));

  useEffect(() => {
    const svg = d3.select("svg");
    const zoomGroup = d3.select("#zoomContainer");
    zoomGroup.append("g").attr("id", "timelines");
    zoomGroup.append("g").attr("id", "places");

    const minScale = 1;
    const maxScale = 20;

    // Define what elements to apply semantic zoom opacity to.
    const semanticOpacitySelections = [
      // Each element defines what and how to interpolate its opacity.
      { selectionString: "#other_font", start: 0.15, end: 0.2 },
    ].map((element) => ({
      ...element,
      // Create a d3 scale for the opacity interpolation.
      scale: d3
        .scaleLinear()
        .domain([minScale, (maxScale - minScale) * element.start, (maxScale - minScale) * element.end, maxScale])
        .range([0, 0, 1, 1]),
      // Create a d3 selection from the selection string.
      selection: d3.select(element.selectionString).style("opacity", 0),
    }));

    // Add zooming, panning and semantic zoom to the zoom group.
    svg.call(
      d3
        .zoom()
        .scaleExtent([minScale, maxScale])
        .on("zoom", (event) => {
          zoomGroup.attr("transform", event.transform);

          // For each selection in the array, set the opacity according to the event scale.
          semanticOpacitySelections.forEach((element) =>
            element.selection.style("opacity", element.scale(event.transform.k))
          );
        })
    );

    setIsMapRendered(true);
  }, []);

  return (
    <>
      <Header />
      <div ref={chartRef}>
        <MapSvg />
        <Timelines isMapRendered={isMapRendered} data={timelineData} time={currentTime.value} />
        <Places isMapRendered={isMapRendered} data={placeData} time={currentTime.value} />
        <DebugDot isMapRendered={isMapRendered} />
        <TimeSelector time={currentTime} range={distinctEventDates} onChange={(time) => setCurrentTime(time)} />
        <CharacterFilter
          data={characterData}
          activeCharacters={activeCharacters}
          setActiveCharacters={setActiveCharacters}
        />
      </div>
    </>
  );
}
