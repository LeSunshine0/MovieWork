import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

export function Dashboard() {
  return (
    <div className="dashboard">
      <SignedIn>
        <h1>Dashboard</h1>
        {/* Your dashboard content for authenticated users */}
      </SignedIn>
      
      <SignedOut>
        <div className="welcome-text">
          <h1>Welcome to MovieWork</h1>
          <p>Please sign in to continue</p>
        </div>
        <div className="auth-container">
          <div className="auth-buttons">
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}