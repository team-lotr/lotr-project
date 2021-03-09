import { useState } from "react";
import * as d3 from "d3";
import "./event-popup.scss";

export function EventPopup({ data }) {
  console.log(data)
  const initialIndex = data ? data.events.length - 1 : 0;
  const [eventIndex, setEventIndex] = useState(initialIndex);

  if (!data) return null;

  //   const d = data.events[0];

  //   const popup = d3.select("#event-popup")
  //     .append("foreignObject")
  //     // problem: screenX and Y appears differently from time to time
  //     .attr('transform', `translate(${data.screenX + 350}, ${data.screenY + 125})`)
  //     .attr("width", 600)
  //     .attr("height", 150);

  //   const body = popup.append("xhtml:body")
  //     .style("text-align", "left")
  //     .html("<p>N/A</p>");

  //   const html = `
  //   <h3>${d.name}</h3>
  //   <table border="0" cellspacing="0" cellpadding="2">
  //   <tbody>
  //     <tr>
  //       <th>Date:</th>
  //       <td>${d.date}</td>
  //     </tr>
  //     <tr>
  //       <th>Descritption:</th>
  //       <td>${d.description}</td>
  //     </tr>
  //   </tbody>
  //   </table>
  // `;

  // body.html(html);

  const handleArrowClick = (v) => {
    if (eventIndex === 0 && v === -1) {
      return;
    }
    if (eventIndex === data.events.length - 1 && v === 1) {
      return;
    }
    setEventIndex(eventIndex + v);
  };

  const event = data.events[eventIndex];

  return (
    <div className="event-popup">
      <div className="event-popup__header">
        <p className="event-popup__arrow" onClick={() => handleArrowClick(-1)}>
          {"<"}
        </p>
        <h2 className="event-popup__title">{event.name}</h2>
        <p className="event-popup__arrow" onClick={() => handleArrowClick(1)}>
          {">"}
        </p>
      </div>
      <div className="event-popup__content">
        <p className="event-popup__date">{event.date}</p>
        <p className="event-popup__description">{event.description}</p>
        {event.evt_wiki ? (
          <a className="event-popup__wiki" href={event.evt_wiki} target="_blank">Read More &gt;</a>
        ) : null}
      </div>
    </div>
  );
}
