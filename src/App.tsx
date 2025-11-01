import { BrowserRouter } from "react-router-dom";
import "./App.css";

import AppRoutes from "./routes";
// import Image360Viewer from "./components/Image360Viewer";

function App() {
  // const images = Array.from({ length: 72 }, (_, i) => `/images/${i + 1}.webp`);

  return (
    <>
      {/* <Image360Viewer images={images} /> */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
