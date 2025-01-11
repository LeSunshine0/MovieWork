import "./App.css";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Rated } from "./pages/rated";
import { Trending } from "./pages/trending";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-links">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/trending">Trending</NavLink>
          <NavLink to="/rated">Rated</NavLink>
        </div>
        <div className="nav-auth">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="auth-buttons">
              <SignInButton mode="modal" />
              <SignUpButton mode="modal" />
            </div>
          </SignedOut>
        </div>
      </nav>
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/rated" element={<Rated />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
