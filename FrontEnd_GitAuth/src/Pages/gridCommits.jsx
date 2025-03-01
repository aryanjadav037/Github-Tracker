/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  QuickFilterModule,
  TextFilterModule,
  PaginationModule,
} from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import axios from "axios";
import SearchBar from "./SearchBar"; // Import the new SearchBar component
import SkeletonLoader from "./SkeletonLoader";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  QuickFilterModule,
  PaginationModule,
]);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CommitsGrid = ({ org, repo }) => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [loading, setLoading] = useState(true);

  const onFilterTextBoxChanged = useCallback((event) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption("quickFilterText", event.target.value);
    }
  }, []);

  useEffect(() => {
    const fetchCommits = async () => {
      if (!org || !repo) {
        return;
      }
      setLoading(true);
      try {
        const url = `${API_BASE_URL}/organizations/${org}/repos/${repo}/commits`;
        const response = await axios.get(url, {
          withCredentials: true,
        });

        const flattenedData = response.data.map((commit) => ({
          sha: commit.sha,
          authorName: commit.commit.author.name,
          authorEmail: commit.commit.author.email,
          date: commit.commit.author.date,
          message: commit.commit.message,
          html_url: commit.html_url,
        }));

        setRowData(flattenedData);
      } catch (error) {
        console.error("Error fetching commits:", error);
      }
      setLoading(false);
    };

    fetchCommits();
  }, [org, repo]);

  const colDefs = [
    { field: "sha", headerName: "Commit SHA", filter: true },
    { field: "authorName", headerName: "Author", filter: true },
    { field: "authorEmail", headerName: "Email", filter: true },
    { field: "date", headerName: "Date", filter: true },
    { field: "message", headerName: "Message", flex: 1, filter: true },
    {
      field: "html_url",
      headerName: "Commit Link",
      cellRenderer: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1e90ff" }}
        >
          View
        </a>
      ),
      filter: true,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#ffffff",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <SearchBar onFilterChange={onFilterTextBoxChanged} />{" "}
      {/* Using SearchBar component */}
      <div style={{ height: 400, width: "100%" }}>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div style={{ height: 400, width: "100%" }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={colDefs}
              rowModelType="clientSide"
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeOptions={[10, 20, 50, 100]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitsGrid;
