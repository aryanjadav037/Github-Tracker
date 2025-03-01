import { useState, useEffect, useCallback } from "react";
import {
  Github,
  CheckCircle2,
  History,
  Trash2,
  ArrowRight,
} from "lucide-react";
import "./gitConnection.css";
import Navbar from "./Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Replace with your backend URL
function GitHubConnection() {
  // Parse URL search params manually instead of using Next.js useSearchParams
  const getSearchParams = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      get: (param) => searchParams.get(param),
    };
  }, []);

  const [isConnected, setIsConnected] = useState(
    localStorage.getItem("githubConnected") === "true"
  );

  const [user, setUser] = useState({
    username: localStorage.getItem("githubUsername") || "",
    avatar_url: localStorage.getItem("githubAvatar") || "",
  });

  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    const searchParams = getSearchParams();
    const username = searchParams.get("username");
    const avatar_url = searchParams.get("avatar_url");
    const last_synced_at = searchParams.get("last_synced_at");
  
    if (username && avatar_url && last_synced_at) {
      const formattedDate = new Date(last_synced_at).toLocaleString();
      setLastSync(formattedDate);
      setUser({ username, avatar_url });
      setIsConnected(true);
      localStorage.setItem("githubConnected", "true");
      localStorage.setItem("githubUsername", username);
      localStorage.setItem("githubAvatar", avatar_url);
      localStorage.setItem("lastSync", formattedDate); // Store lastSync in localStorage
      window.history.replaceState({}, document.title, "/");
    } else {
      // Restore lastSync from localStorage on page refresh
      const storedLastSync = localStorage.getItem("lastSync");
      if (storedLastSync) {
        setLastSync(storedLastSync);
      }
    }
  }, [getSearchParams]);

  const handleConnect = () => {
    window.open(`${API_BASE_URL}/auth/github`, "_self");
  };

  const handleRemove = async () => {
    setIsConnected(false);
    setUser({ username: "", avatar_url: "" });
    setLastSync(null); // Reset lastSync state
    localStorage.removeItem("githubConnected");
    localStorage.removeItem("githubUsername");
    localStorage.removeItem("githubAvatar");
    localStorage.removeItem("lastSync"); // Remove lastSync from localStorage
  };

  return (
    <div className="container">
      {isConnected ? (
        <div>
          <nav className="navbar">
            <div className="navbar-content">
              <div className="user-info">
                <div className="avatar">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url || "/placeholder.svg"}
                      alt={user.username}
                    />
                  ) : (
                    <div className="avatar-fallback">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="navbar-title">
                    {user.username}
                    <span className="badge">
                      <CheckCircle2 size={16} />
                      Connected
                    </span>
                  </h2>
                  <p className="navbar-description">
                    <Github size={16} />
                    GitHub Account
                  </p>
                </div>
              </div>
              <div className="sync-info">
                <div className="sync-details">
                  <div className="icon-container">
                    <History size={16} />
                  </div>
                  <div>
                    <h3>Last Synchronized</h3>
                    <p>{lastSync}</p>
                  </div>
                </div>
              </div>
              <button className="button destructive" onClick={handleRemove}>
                <Trash2 size={16} />
                Disconnect
              </button>
            </div>
          </nav>
          <Navbar />
        </div>
      ) : (
        <div className="card">
          <div className="card-header centered">
            <div className="github-icon">
              <Github size={24} />
            </div>
            <h2 className="card-title">Connect to GitHub</h2>
            <p className="card-description">
              Link your GitHub account to sync repositories and track your
              contributions
            </p>
          </div>
          <div className="card-content">
            <div className="benefits">
              <h3>Benefits of connecting:</h3>
              <ul>
                <li>
                  <CheckCircle2 size={16} />
                  <span>Sync your repositories automatically</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>Track your commit history and contributions</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>Seamless integration with your workflow</span>
                </li>
              </ul>
            </div>
            <button
              className="button primary full-width"
              onClick={handleConnect}
            >
              Connect with GitHub
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="card-footer centered">
            We only request read access to your public repositories
          </div>
        </div>
      )}
    </div>
  );
}

export default GitHubConnection;
