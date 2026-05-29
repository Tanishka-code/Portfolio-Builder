import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Builder from "./Pages/Builder";
import Portfolios from "./Pages/Portfolios";
import PortfolioDetails from "./Pages/PortfolioDetails";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Builder />}
        />

        <Route
          path="/portfolios"
          element={<Portfolios />}
        />

        <Route
          path="/portfolio/:username"
          element={<PortfolioDetails />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;