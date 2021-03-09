import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { LotrDate } from "../../data/LotrDate";
import {
  Timelines,
  Places,
  Header,
  DebugDot,
  TimeSelector,
  CharacterFilter,
  EventPopup,
  LotrMap,
  TutorialPopup,
} from "../../components";
import "./lotr-visualisation.scss";

// world bounds
const worldTopLeft = [0, 0];
const worldBottomRight = [3200, 3300]; // extra space on bottom or it bugs out

export function LotrVisualisation({ client }) {
  const chartRef = useRef(null);
  const [isMapRendered, setIsMapRendered] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new LotrDate("5 Mar 3019"));
  const [activeCharacters, setActiveCharacters] = useState(client.getAll("character", "id"));

  // Set up the timeline data
  const timelineData = client.getCharactersById(activeCharacters).map((character) => {
    const timeline = client
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
  const distinctEventDates = client.getDistinctDates();

  // Set up the place data.
  const placeData = client.getAll("place").map((place) => ({
    ...place,
    events: client
      .getAll("event")
      .filter((event) => event.placeId === place.id)
      .map((event) => ({ ...event, lotrDateValue: new LotrDate(event.date).value }))
      .sort((first, second) => first.lotrDateValue - second.lotrDateValue),
  }));

  // show event popup details
  function handlePlaceClick(mouseEvent, place) {
    // place.events
    const characterIds = client.getCharactersForEvents(place.events.map((e) => e.id));
    setPopupData({
      ...place,
      screenX: mouseEvent.x,
      screenY: mouseEvent.y,
      characterIds,
    });
  }

  useEffect(() => {
    const svg = d3.select("svg");
    const zoomGroup = d3.select("#zoomContainer");
    zoomGroup.append("g").attr("id", "timelines");
    zoomGroup.append("g").attr("id", "places");
    zoomGroup.append("g").attr("id", "event-popup");

    const minScale = 1;
    const maxScale = 20;

    // Define what elements to apply semantic zoom opacity to.
    const semanticOpacitySelections = [
      // Each element defines what and how to interpolate its opacity.
      { selectionString: "#misc_font", start: 0.225, end: 0.25 },
      { selectionString: "#uppercase_font", start: 0.125, end: 0.175 },
      { selectionString: "#outline_font", start: 0.075, end: 0.1 },
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

    svg.call(
      d3
        .zoom()
        .scaleExtent([minScale, maxScale])
        // limit translation i.e. get rid of out-of-map scrolling
        .translateExtent([worldTopLeft, worldBottomRight])
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
        <LotrMap />
        <Timelines isMapRendered={isMapRendered} data={timelineData} time={currentTime.value} />
        <Places isMapRendered={isMapRendered} data={placeData} time={currentTime.value} onClick={handlePlaceClick} />
        <DebugDot isMapRendered={isMapRendered} />
        <TimeSelector time={currentTime} range={distinctEventDates} onChange={(time) => setCurrentTime(time)} />
        <CharacterFilter
          data={client.getAll("character")}
          activeCharacters={activeCharacters}
          setActiveCharacters={setActiveCharacters}
        />
        <EventPopup data={popupData} />
        <TutorialPopup />
      </div>
    </>
  );
}
