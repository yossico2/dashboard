// Dashboard.tsx
// 

import React from "react"; // Explicitly import React
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardContextProvider } from './DashboardContext';

// Import CSS styles for react-grid-layout and react-resizable
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./styles.css"; // Project-specific styles

// Import components used in the routes
import DashboardGrid from "./DashboardGrid";
import DetailPage from "./DetailPage";
import EditPage from "./EditPage";

/**
 * Defines the base URL for the application if deployed in a subdirectory.
 * Set to an empty string for deployment at the root.
 */
const PUBLIC_URL: string = "";

/**
 * `Dashboard` component sets up the routing for the dashboard application.
 * It uses `react-router-dom` for navigation and wraps the routes with `DashboardContextProvider`
 * to provide dashboard-related state to all components within the routing tree.
 */
export default function Dashboard(): React.ReactElement {
    return (
        // Provides dashboard context to all child components
        <DashboardContextProvider>
            {/*
              BrowserRouter enables client-side routing.
              The `basename` prop is used if the application is served from a sub-directory.
            */}
            <BrowserRouter basename={`${PUBLIC_URL}`}>
                {/* Routes component defines the navigation paths */}
                <Routes>
                    {/* Route for viewing a specific dashboard item by ID */}
                    <Route path="/:id/view" element={<DetailPage />} />
                    {/* Route for editing a specific dashboard item by ID */}
                    <Route path="/:id/edit" element={<EditPage />} />
                    {/* Default route for the main dashboard view */}
                    <Route path="/" element={<DashboardGrid />} />
                    {/*
                      Catch-all route: If no other route matches,
                      it redirects to the home dashboard page.
                    */}
                    <Route path="*" element={<Navigate to={'/'} replace />} />
                </Routes>
            </BrowserRouter>
        </DashboardContextProvider>
    );
}