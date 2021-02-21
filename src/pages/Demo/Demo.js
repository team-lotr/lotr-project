import { useEffect, useRef, useState } from "react";
import { ReactComponent as MapSvg } from "../../assets/mapome-slim.svg";
import * as d3 from "d3";

import { DataClient } from "../../data/DataClient";
import { Timelines } from "../../components/Timelines";
import { Header } from "../../components/Header";
import { renderDebugDot } from "./debugDot";
import "./Demo.scss";

// Set up constants and variables for dynamic data.
let currentTime = 30200000;
const debugDot = false;

export function Demo() {
  const [isMapRendered, setIsMapRendered] = useState(false);
  const chartRef = useRef(null);

  // Set up the timeline data.
  const dataClient = new DataClient();
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

  useEffect(() => {
    const svg = d3.select("svg");
    const zoomGroup = d3.select("#zoomContainer");
    zoomGroup.append("g").attr("id", "timelines");

    // Add zooming and panning to the zoom group.
    svg.call(
      d3.zoom().on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      })
    );

    if (debugDot) {
      renderDebugDot(zoomGroup, { xStart: 100, yStart: 100, radius: 10 });
    }

    setIsMapRendered(true);
  }, []);

  return (
    <>
      <Header />
      <div ref={chartRef}>
        <MapSvg />
        <Timelines isMapRendered={isMapRendered} data={timelineData} time={currentTime} />
      </div>
    </>
  );
}
