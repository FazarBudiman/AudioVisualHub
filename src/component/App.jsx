import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompressAudio from "./pages/CompressAudio";
import ResizerImage from "./pages/ResizerImage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CompressAudio />} />
        <Route path="/compress-audio" element={<CompressAudio />} />
        <Route path="/resize-image" element={<ResizerImage />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
