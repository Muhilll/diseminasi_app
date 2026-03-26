import { Router } from "@solidjs/router";
import type { Component } from "solid-js";
import { routeConfig } from "./router";

const App: Component = () => {
  return (
    <Router>
      {routeConfig}
    </Router>
  );
};

export default App;
