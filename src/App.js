import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Demo } from "./pages/Demo";
import { Home } from "./pages/Home";
import "./styles/App.scss";

function App() {
  return (
    <Router>
      <div className="container">
        <Switch>
          <Route path="/demo">
            <Demo />
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
