import ringRender from "./assets/render.png";
import "./App.css";

function App() {
  return (
    <div className="container">
      <img src={ringRender} className="cover" />
      <div className="content">
        <h2 className="header">LOTR Project - DH2321</h2>
      </div>
    </div>
  );
}

export default App;
