import { Router, Route } from "@solidjs/router";
import type { Component } from "solid-js";
import Comp from "./Comp";
import Dashboard from "./pages/Dashboard";
import IndexPage from "./pages/Index";

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={IndexPage} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  );
};

export default App;
