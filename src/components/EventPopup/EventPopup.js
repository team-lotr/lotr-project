import { useEffect } from 'react';
import * as d3 from "d3";
import "./event-popup.scss";

export function EventPopup({ data }) {
  if (!data) return null;

  const d = data.events[0];

  const popup = d3.select("#event-popup")
    .append("foreignObject")
    // problem: screenX and Y appears differently from time to time
    .attr('transform', `translate(${data.screenX + 350}, ${data.screenY + 125})`)
    .attr("width", 600)
    .attr("height", 150);

  const body = popup.append("xhtml:body")
    .style("text-align", "left")
    .html("<p>N/A</p>");
  
  const html = `
  <h3>${d.name}</h3>
  <table border="0" cellspacing="0" cellpadding="2">
  <tbody>
    <tr>
      <th>Date:</th>
      <td>${d.date}</td>
    </tr>
    <tr>
      <th>Descritption:</th>
      <td>${d.description}</td>
    </tr>
  </tbody>
  </table>
`;
  
  body.html(html);

  return null
}
