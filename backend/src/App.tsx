import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { Rated } from "./pages/rated";
import { Navbar } from "./components/navbar";
import { SignedIn } from "@clerk/clerk-react";
import { Trending } from "./pages/trending";

function App() {
  return (
    <Router> 
      <div className="app-container"> 
        <SignedIn>
          <Navbar />
        </SignedIn>
        <Routes> 
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/rated" element={<Rated />} />
        </Routes> 
      </div> 
    </Router>
  );
}

export default App;
