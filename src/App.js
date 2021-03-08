import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LotrVisualisation, Home, Data } from "./pages";
import "./styles/app.scss";

function App() {
  return (
    <Router>
      <div className="container">
        <Switch>
          <Route path="/">
            <LotrVisualisation />
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
