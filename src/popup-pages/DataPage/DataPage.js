import "./data-page.scss";

export function DataPage({ close }) {
  return (
    <div className="data-page">
      <h2 className="data-page__title">Dataset</h2>
      <p>
        While there are many datasets and other information related to LotR on the Internet, it is difficult to find one
        with enough detail to allow tracing each character's journey in full. This is why for this visualization, we
        created our own dataset that fits our specific use case. It was put together by reading the books and recording
        each stop a character makes and all events they are part of. While this sounds like a daunting task, it was made
        much easier by the almost chronicle-like nature of the series and Tolkien's meticulous attention to detail.

        If you would like to view, download, or use our dataset for your own purposes, you can do so
        <a
        style={{textDecoration: 'none'}}
          target="_blank"
          href="https://docs.google.com/spreadsheets/d/15ykK0MIWrG7DyYbbWT8skaWTP3jfUjdVhIKg76N5BWE/edit?usp=sharing"
        >
          {" "}
          here &#8599;
        </a>
        .
      </p>
      <button className="data-page__button" onClick={close}>
        Close
      </button>
    </div>
  );
}
