/* eslint-disable react/prop-types */
import SearchBar from "./SearchBar";
import { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  QuickFilterModule,
  TextFilterModule,
  ValidationModule,
  PaginationModule,
} from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import axios from "axios";
import SkeletonLoader from "./SkeletonLoader";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  QuickFilterModule,
  ValidationModule,
  PaginationModule,
]);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ChangelogsGrid = ({ org, repo }) => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [loading, setLoading] = useState(true);

  const onFilterTextBoxChanged = useCallback((event) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption("quickFilterText", event.target.value);
    }
  }, []);

  useEffect(() => {
    const fetchChangelogs = async () => {
      if (!org || !repo) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/organizations/${org}/repos/${repo}/issues/changelogs`,
          {
            withCredentials:true,
          }
        );
        setRowData(response.data.commits || []);
      } catch (error) {
        console.error("Error fetching changelogs:", error);
      }
      setLoading(false);
    };
    fetchChangelogs();
  }, [org, repo]);

  const colDefs = [
    { field: "sha", headerName: "Commit SHA", width: 200 },
    { field: "commit.author.name", headerName: "Author", width: 150 },
    { field: "commit.author.email", headerName: "Email", width: 180 },
    { field: "commit.author.date", headerName: "Date", width: 180 },
    { field: "commit.message", headerName: "Message", width:300  },
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
      flex:1
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

export default ChangelogsGrid;