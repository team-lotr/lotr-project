import logo from "../../assets/logo.png";
import "./home.scss";

const links = [
  {
    name: "Demo",
    href: "/demo",
  },
  {
    name: "Data",
    href: "/data",
  },
  {
    name: "Trello Board",
    href: "https://trello.com/b/aVA9GvU8/lotr-project",
  },
  {
    name: "Github",
    href: "https://github.com/team-lotr/lotr-project",
  },
  {
    name: "Google Drive",
    href:
      "https://drive.google.com/drive/folders/1uQNrktw-So1wTRUI5pJhJypk_7izfSoz",
  },
  {
    name: "Discord",
    href: "https://discord.com/channels/804374573860257832",
  },
];

export function Home() {
  return (
    <div className="home-page">
      <HomeMenu />
    </div>
  );
}

function HomeMenu() {
  return (
    <div className="home-menu">
      <h1 className="home-menu__title">There and Back Again</h1>
      <img className="home-menu__logo" src={logo} />
      <p className="home-menu__subtitle">
        A project that visualises the timelines and events of your favourite
        Lord of the Rings characters
      </p>
      <div className="home-menu__content">
        <ul>
          {links.map((link) => (
            <li>
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
