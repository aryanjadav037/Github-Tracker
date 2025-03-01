import { useState, useEffect } from "react";
import axios from "axios";
import CommitsGrid from "../Pages/gridCommits";
import PullsGrid from "../Pages/gridPulls";
import IssuesGrid from "../Pages/gridIssues";
import ChangelogsGrid from "../Pages/gridChange";
import "./navbar.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Navbar = () => {
  const [org, setOrg] = useState("");
  const [repo, setRepo] = useState("");
  const [showOrg, setShowOrg] = useState([]);
  const [showRepo, setShowRepo] = useState([]);
  const [selectedView, setSelectedView] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/organizations`,
          {
            withCredentials: true,
          }
        );
        setShowOrg(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!org) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/organizations/${org}/repos`,
          {
            withCredentials: true,
          }
        );
        setShowRepo(response.data);
      } catch (error) {
        console.error(`Error fetching repositories for ${org}:`, error);
      }
    };
    fetchRepos();
  }, [org]);

  return (
    <div className="navbar-container">
      {/* Dropdowns */}
      <div className="select-container">
        <select
          onChange={(e) => setOrg(e.target.value)}
          className="select-input"
          value={org}
        >
          <option value="">Select Organization</option>
          {showOrg.map((orgItem) => (
            <option key={orgItem.login} value={orgItem.login}>
              {orgItem.login}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setRepo(e.target.value)}
          className="select-input"
          value={repo}
          disabled={!org}
        >
          <option value="">Select Repository</option>
          {showRepo.map((repoItem) => (
            <option key={repoItem.name} value={repoItem.name}>
              {repoItem.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      {repo && (
        <div className="button-container">
          <button
            onClick={() => setSelectedView("commits")}
            className={selectedView === "commits" ? "active" : ""}
          >
            View Commits
          </button>
          <button
            onClick={() => setSelectedView("pulls")}
            className={selectedView === "pulls" ? "active" : ""}
          >
            View Pull Requests
          </button>
          <button
            onClick={() => setSelectedView("issues")}
            className={selectedView === "issues" ? "active" : ""}
          >
            View Issues
          </button>
          <button
            onClick={() => setSelectedView("changelogs")}
            className={selectedView === "changelogs" ? "active" : ""}
          >
            View Changelogs
          </button>
        </div>
      )}

      {/* Data Grid Display */}
      <div className="grid-container">
        {selectedView === "commits" && <CommitsGrid org={org} repo={repo} />}
        {selectedView === "pulls" && <PullsGrid org={org} repo={repo} />}
        {selectedView === "issues" && <IssuesGrid org={org} repo={repo} />}
        {selectedView === "changelogs" && (
          <ChangelogsGrid org={org} repo={repo} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
