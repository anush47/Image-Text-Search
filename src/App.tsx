import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path={import.meta.env.BASE_URL} element={<Home />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
