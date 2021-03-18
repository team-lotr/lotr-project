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
  Setting,
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

const minScale = 0.7;
const maxScale = 20;

export function LotrVisualisation({ client }) {
  const chartRef = useRef(null);
  const [isMapRendered, setIsMapRendered] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [activeCharacters, setActiveCharacters] = useState(client.getAll("character", "id"));
  const [activeBookIds, setActiveBookIds] = useState(client.getDistinctBookIds());
  const [currentZoom, setCurrentZoom] = useState(minScale);
  const [parallelLines, setParallelLines] = useState(false);
  const [offsetMultiplier, setOffsetMultiplier] = useState(5);
  const [eventIndex, setEventIndex] = useState(0);

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

    // add control points to timeline
    const controlPoints = client.getControlPoints(character.name);
    return { character, timeline, controlPoints };
  });
  const distinctEventDates = client.getDistinctDates(activeBookIds);

  // Set up the place data.
  const placeData = client.getPlacesWithEventData(activeCharacters, activeBookIds, dateRange);

  // show event popup details
  function handlePlaceClick(mouseEvent, place) {
    setEventIndex(0);
    setPopupData({
      ...place,
      screenX: mouseEvent.x,
      screenY: mouseEvent.y,
    });
  }

  useEffect(() => {
    const svg = d3.select("svg");
    const zoomGroup = d3.select("#zoomContainer");
    zoomGroup.append("g").attr("id", "timelines");
    zoomGroup.append("g").attr("id", "places");
    zoomGroup.append("g").attr("id", "event-popup");

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

          setCurrentZoom(event.transform.k);

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
          parallelLines={parallelLines}
          offsetMultiplier={offsetMultiplier}
        />
        <Places
          isMapRendered={isMapRendered}
          data={placeData}
          onClick={handlePlaceClick}
          zoomPercent={(currentZoom - minScale) / maxScale}
        />
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
        <EventPopup data={popupData} eventIndex={eventIndex} setEventIndex={setEventIndex} />
        <TutorialPopup />
        <Settings>
          <DebugDot isMapRendered={isMapRendered} />
          <Setting
            label="Toggle Parallel Lines"
            value={parallelLines}
            type={"boolean"}
            onChange={(v) => setParallelLines(v)}
          />
          <Setting
            label="Path Offset Multiplier"
            value={offsetMultiplier}
            type="scalar"
            onChange={(v) => setOffsetMultiplier(v)}
            min={0}
            max={10}
            step={1}
          />

          <hr style={{ marginTop: "5px" }} />
          <a
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/15ykK0MIWrG7DyYbbWT8skaWTP3jfUjdVhIKg76N5BWE/edit?usp=sharing"
          >
            <label className="setting setting--scalar">View Dataset &#8599;</label>
          </a>
        </Settings>
      </div>
    </>
  );
}
