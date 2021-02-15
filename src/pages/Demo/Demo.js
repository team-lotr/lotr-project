import { Nav } from "../../components/Nav";
import { useEffect, useRef } from "react";
import { ReactComponent as MapSvg } from "../../assets/mapome-slim.svg";
import * as d3 from "d3";

const margin = { top: 0, left: 0, bottom: 0, right: 0 };
// const width = document.body.clientWidth - margin.left - margin.right;
// const height = window.innerHeight - margin.top - margin.bottom;

export function Demo() {
  const chartRef = useRef(null);

  useEffect(() => {
    const svg = d3.select("svg");
    const g = d3.select("#zoomContainer");

    // Add zooming and panning to the zoom group.
    svg.call(
      d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform);
      })
    );
  }, []);

  return (
    <>
      <Nav />
      <h2>Demo</h2>
      <div ref={chartRef}>
        <MapSvg />
      </div>
    </>
  );
}
