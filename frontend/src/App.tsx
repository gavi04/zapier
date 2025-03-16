// App.jsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
// Update this path to match your actual file
import Signup from "./pages/signup";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import ZapCreationPage from "./pages/createZap";
import Dashboard from "./pages/dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/createZap" element={<ZapCreationPage/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}