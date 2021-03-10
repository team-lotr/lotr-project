import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { LotrDate } from "../../data/LotrDate";
import {
  Timelines,
  Places,
  Header,
  DebugDot,
  CharacterFilter,
  EventPopup,
  LotrMap,
  TutorialPopup,
  Settings,
  TimeNavigator,
} from "../../components";
import "./lotr-visualisation.scss";

// world bounds
const worldTopLeft = [0, 0];
const worldBottomRight = [3200, 3300]; // extra space on bottom or it bugs out
const DEFAULT_START_TIME = new LotrDate("23 Sept 3018"); // Leaving Bag End
const DEFAULT_END_TIME = new LotrDate("25 Mar 3019"); // The Ring is destroyed
const DEFAULT_DATE_RANGE = {
  start: DEFAULT_START_TIME,
  end: DEFAULT_END_TIME,
};

export function LotrVisualisation({ client }) {
  const chartRef = useRef(null);
  const [isMapRendered, setIsMapRendered] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [activeCharacters, setActiveCharacters] = useState(client.getAll("character", "id"));
  const [activeBookIds, setActiveBookIds] = useState(client.getDistinctBookIds());

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
  const distinctEventDates = client.getDistinctDates(activeBookIds);

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
        <Timelines
          isMapRendered={isMapRendered}
          timelineData={timelineData}
          dateRange={dateRange}
          bookIds={activeBookIds}
        />
        <Places
          isMapRendered={isMapRendered}
          data={placeData}
          dateRange={dateRange}
          bookIds={activeBookIds}
          onClick={handlePlaceClick}
        />

        {/* <TimeSelector time={currentTime} range={distinctEventDates} onChange={(time) => setCurrentTime(time)} /> */}
        <TimeNavigator
          activeBookIds={activeBookIds}
          setActiveBookIds={setActiveBookIds}
          dateRange={dateRange}
          setDateRange={setDateRange}
          fullDateRange={distinctEventDates}
        />
        <CharacterFilter
          data={client.getAll("character")}
          activeCharacters={activeCharacters}
          setActiveCharacters={setActiveCharacters}
        />
        <EventPopup data={popupData} />
        <TutorialPopup />
        <Settings>
          <DebugDot isMapRendered={isMapRendered} />
        </Settings>
      </div>
    </>
  );
}
