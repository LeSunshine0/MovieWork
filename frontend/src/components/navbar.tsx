import { Link } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/trending">Trending</Link>
        <Link to="/rated">Rated</Link>
      </div>
      <div className="nav-auth">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}