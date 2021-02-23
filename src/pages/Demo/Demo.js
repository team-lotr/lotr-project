import { useEffect, useRef, useState } from "react";
import { ReactComponent as MapSvg } from "../../assets/mapome-slim.svg";
import * as d3 from "d3";

import { DataClient } from "../../data/DataClient";
import { Timelines } from "../../components/Timelines";
import { Events } from "../../components/Events";
import { Header } from "../../components/Header";
import { DebugDot } from "../../components/DebugDot";
import { TimeSelector } from "../../components/TimeSelector";
import "./Demo.scss";
import { LotrDate } from "../../data/LotrDate";

export function Demo() {
  const [isMapRendered, setIsMapRendered] = useState(false);
  const chartRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new LotrDate("12 Apr 3018"));

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
  const distinctEventDates = dataClient.getDistinctDates();

  // Set up the event data.
  const eventData = dataClient.getAll("event").map((event) => {
    console.log(event);
    return {
      ...event,
      place: dataClient.getPlaceBy("id", event.placeId),
      lotrDateValue: new LotrDate(event.date).value
    };
  });

  useEffect(() => {
    const svg = d3.select("svg");
    const zoomGroup = d3.select("#zoomContainer");
    zoomGroup.append("g").attr("id", "timelines");
    zoomGroup.append("g").attr("id", "events");

    // Add zooming and panning to the zoom group.
    svg.call(
      d3
        .zoom()
        .scaleExtent([1, 20])
        .on("zoom", (event) => {
          zoomGroup.attr("transform", event.transform);
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
        <Events isMapRendered={isMapRendered} data={eventData} time={currentTime.value} />
        <DebugDot isMapRendered={isMapRendered} />
        <TimeSelector time={currentTime} range={distinctEventDates} onChange={(time) => setCurrentTime(time)} />
      </div>
    </>
  );
}
