// App.jsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
// Update this path to match your actual file
import Signup from "./pages/signup";
import Home from "./pages/Home";
import Signin from "./pages/Signin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}