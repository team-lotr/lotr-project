import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Demo } from "./pages/Demo";
import { Home } from "./pages/Home";
import { Data } from "./pages/Data";
import "./styles/App.scss";

function App() {
  return (
    <Router>
      <div className="container">
        <Switch>
          <Route path="/demo">
            <Demo />
          </Route>
          <Route path="/data">
            <Data />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
