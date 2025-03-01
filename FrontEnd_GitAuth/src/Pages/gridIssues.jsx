/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import SearchBar from "./SearchBar";
import {
  ClientSideRowModelModule,
  QuickFilterModule,
  TextFilterModule,
  PaginationModule,
} from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import axios from "axios";
import SkeletonLoader from "./SkeletonLoader";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  QuickFilterModule,
  PaginationModule,
]);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IssuesGrid = ({ org, repo }) => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [loading, setLoading] = useState(true);

  const onFilterTextBoxChanged = useCallback((event) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption("quickFilterText", event.target.value);
    }
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!org || !repo) return;
      setLoading(true)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/organizations/${org}/repos/${repo}/issues`,
          {
            withCredentials: true,
          }
        );
        setRowData(response.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
      setLoading(false)
    };
    fetchIssues();
  }, [org, repo]);

  const colDefs = [
    { field: "number", headerName: "Issue Number", width: 120 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "user.login", headerName: "Author", width: 150 },
    { field: "state", headerName: "State", width: 100 },
    { field: "comments", headerName: "Comments", width: 120 },
    { field: "created_at", headerName: "Created At", width: 180 },
    { field: "updated_at", headerName: "Updated At", width: 180 },
    {
      field: "html_url",
      headerName: "Commit Link",
      cellRenderer: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: "#1e90ff" }}>
          View
        </a>
      ),
      filter: true,
    },
  ];

  return (
    <div style={{ backgroundColor: "#121212", color: "#ffffff", padding: "20px", borderRadius: "8px" }}>
      <SearchBar onFilterChange={onFilterTextBoxChanged} />
      <div style={{ height: 400, width: "100%" }}>
      {loading ? <SkeletonLoader /> : (
        <div style={{ height: 400, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={colDefs}
            rowModelType="clientSide"
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10,20,50,100]}
            className="ag-theme-alpine-dark"
          />
        </div>
      )}
      </div>
    </div>
  );
};

export default IssuesGrid;
