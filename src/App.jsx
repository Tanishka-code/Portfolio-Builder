import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Builder from "./pages/Builder";
import Portfolios from "./pages/Portfolios";
import PortfolioDetails from "./pages/PortfolioDetails";

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