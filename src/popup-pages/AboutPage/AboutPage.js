import "./about-page.scss";
import teamData from "./team-data.json";
import hugoImg from "../../assets/team-member-hugo.png";
import felixImg from "../../assets/team-member-felix.png";
import liangImg from "../../assets/team-member-liang.jpeg";
import andersImg from "../../assets/team-member-anders.jpeg";
import siyanaImg from "../../assets/team-member-siyana.png";

const nameToImageMap = {
  Hugo: hugoImg,
  Felix: felixImg,
  Liang: liangImg,
  Anders: andersImg,
  Siyana: siyanaImg,
};

export function AboutPage({ close }) {
  return (
    <div className="about-page">
      <h2 className="about-page__title">About</h2>
      <p>
        The goal for this project was to create an interactive visualisation of the Lord of the Rings universe, in order
        to allow fans of Tolkien's works to further engage with his creation.
      </p>
      <p>
        We explored many different ways of acquiring the dataset we needed, but ended up doing a manual data generation
        by reading through and carefully taking notes on the events, places and characters of the Lord of the Rings
        trilogy.
      </p>
      <p>
        The visualisation consists out of a map of Middle Earth, with the paths of most of the main characters being
        visualised as paths on the map. The map provides filtering options for characters, time and books. This together
        with the semantic zooming which reveals more of the map as you zoom in we hope gives you an engaging experience.
      </p>
      <h2 className="about-page__title">The Team</h2>

      <div className="about-page__team">
        {teamData.map(({ name, email, tags }) => (
          <TeamMemberBox key={name} name={name} email={email} tags={tags} />
        ))}
      </div>
      <h2 className="about-page__title">Sources and References</h2>
      <div className="about-page__references">
        <p>
          [1] North, Chris. “Information Visualization.” Handbook of Human Factors and Ergonomics, by Gavriel ed
          Salvendy, Wiley, 2012, pp. 1209–1232.
        </p>
        <p>
          [2] “The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations.” The Craft of Information
          Visualization: Readings and Reflections, by Benjamin Bederson and Ben Shneiderman, 2003.
        </p>
        <p>[3] “Timeline of the History of Middle-Earth - LotrProject.” The Lord of the Rings Family Tree Project</p>
        <p>[4] lotrproject.com/timeline/. Tolkien, J. R. R. Lord of the Rings. HarperCollinsPublishers, 2005.</p>
      </div>
      <button className="about-page__button" onClick={close}>
        Close
      </button>
    </div>
  );
}

function TeamMemberBox({ name, email, tags }) {
  return (
    <div className="team-member-box">
      <div className="team-member-box__col">
        <img className="team-member-box__img" src={nameToImageMap[name]} />
      </div>
      <div className="team-member-box__col">
        <h3 className="team-member-box__name">{name}</h3>
        <p className="team-member-box__email">{email}</p>
        <p className="team-member-box__tags">{tags.join(", ")}</p>
      </div>
    </div>
  );
}
