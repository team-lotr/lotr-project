import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LotrVisualisation, Home, Data } from "./pages";
import { DataClient } from "./data/DataClient";
import "./styles/app.scss";

function App() {
  const dataClient = new DataClient();
  window.dataClient = dataClient;

  return (
    <Router>
      <div className="container">
        <Switch>
          <Route path="/">
            <LotrVisualisation client={dataClient} />
          </Route>
          <Route path="/data">
            <Data />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
