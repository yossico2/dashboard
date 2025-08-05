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
import DetailPage from "../Example/DetailPage";
import EditPage from "../Example/EditPage";

// imports used in DashboardGrid
import { Button, Grid } from "@mui/material";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";

import Panel from "./Panel";
import DashboardService from "./DashboardService";
import { useDashboard } from './DashboardContext';
import { DashboardItem, DashboardModel } from "./DashboardModel";

/**
 * Defines the base URL for the application if deployed in a subdirectory.
 * Set to an empty string for deployment at the root.
 */
const PUBLIC_URL: string = "";

/**
 * `Dashboard` component sets up the routing for dashboard panels.
 * It uses `react-router-dom` for navigation and wraps the routes with `DashboardContextProvider`
 * to provide dashboard-related state to all components within the routing tree.
 */
export default function Dashboard(): React.ReactElement {
    return (
        <DashboardContextProvider>
            {/*
              BrowserRouter enables client-side routing.
              The `basename` prop is used if the application is served from a sub-directory.
            */}
            <BrowserRouter basename={`${PUBLIC_URL}`}>
                {/* Routes component defines the navigation paths */}
                <Routes>
                    {/* Route for viewing a specific `Panel` by ID */}
                    <Route path="/:id/view" element={<DetailPage />} />
                    {/* Route for editing a specific `Panel` by ID */}
                    <Route path="/:id/edit" element={<EditPage />} />
                    {/* Default route for the main dashboard view */}
                    <Route path="/" element={<DashboardGrid />} />
                    {/* Catch-all route: redirects to the home dashboard page. */}
                    <Route path="*" element={<Navigate to={'/'} replace />} />
                </Routes>
            </BrowserRouter>
        </DashboardContextProvider>
    );
}

/**
 * DashboardGrid component displays and manages a dynamic grid layout of charts.
 * It uses `react-grid-layout` for responsive grid management and interacts with
 * DashboardService for data manipulation and DashboardContext for state management.
 */
function DashboardGrid(): React.ReactElement {

    // Memoize `DashboardService` instance to ensure it's created only once.
    const dashboardService = React.useMemo(() => new DashboardService(), []);
    // Destructure dashboard state and update function from the DashboardContext.
    const { dashboard, updateDashboard } = useDashboard();

    // A dummy state to force re-render when an item is added or removed,
    // especially useful if the dashboard object reference doesn't change
    // but its internal properties (like `items`) do.
    const [refreshDummy, setRefreshDummy] = React.useState<boolean>(false);

    // Memoize `WidthProvider(Responsive)` for `react-grid-layout` to avoid
    // re-creating it on every render, which can cause performance issues.
    const ResponsiveReactGridLayout = React.useMemo(() => WidthProvider(Responsive), []);

    /**
     * Checks if the dashboard object is empty.
     * A dashboard is considered empty if it's null/undefined or if its `items` object has no keys.
     * @param {DashboardModel | null | undefined} dashboard - The dashboard object from context.
     * @returns {boolean} True if the dashboard is empty, false otherwise.
     */
    function isEmptyDashboard(dashboard: DashboardModel | null | undefined): boolean {
        return !dashboard || Object.keys(dashboard.items).length === 0;
    }

    /**
     * `useEffect` hook to load the dashboard when the component mounts
     * or if the dashboard from context is initially empty.
     */
    React.useEffect(() => {
        if (isEmptyDashboard(dashboard)) {
            const loadedDashboard = dashboardService.loadDashboard();
            updateDashboard(loadedDashboard);
        }
    }, []);

    if (!dashboard) return (<></>);

    /**
     * Handles adding a new chart to the dashboard.
     * It calls `dashboardService.addItem` to modify the dashboard state,
     * then updates the context and triggers a re-render.
     */
    const addItem = (): void => {
        dashboardService.addItem(dashboard);
        updateDashboard(dashboard);
        setRefreshDummy(prev => !prev); // Toggle dummy state to force re-render
    };

    /**
     * Handles removing a chart from the dashboard by its ID.
     * It calls `dashboardService.removeItem` to modify the dashboard state,
     * then updates the context and triggers a re-render.
     * @param {string} chartId - The unique identifier of the chart to be removed.
     */
    const removeItem = (chartId: string): void => {
        dashboardService.removeItem(dashboard, chartId);
        updateDashboard(dashboard);
        setRefreshDummy(prev => !prev); // Toggle dummy state to force re-render
    };

    /**
     * Callback function for `react-grid-layout` when the layout changes (e.g., drag, resize).
     * It updates the dashboard's layout in the `DashboardService`.
     * @param {Layout[]} newLayout - The current layout for the active breakpoint.
     * @param {Layouts} newLayouts - An object containing layouts for all breakpoints.
     */
    const onLayoutChange = (newLayout: Layout[], newLayouts: Layouts): void => {
        dashboardService.setLayouts(dashboard, newLayouts);
    };

    /**
     * Callback function for `react-grid-layout` when the breakpoint changes (e.g., window resize).
     * @param {string} breakpoint - The name of the new active breakpoint (e.g., 'lg', 'md').
     * @param {number} cols - The number of columns for the new breakpoint.
     */
    const onBreakPointChange = (breakpoint: string, cols: number): void => {
        // console.log(`breakpoint: ${breakpoint}, cols: ${cols}`);
    };

    return (
        <Grid container direction="column" spacing={2} sx={{ overflow: "hidden" }}>
            <Grid item sx={{ display: "fixed", top: 10, left: 10 }}>
                <Button variant="contained" color="primary" sx={{ mt: 1, ml: 1 }} onClick={addItem}>Add Panel</Button>
            </Grid>
            {
                !isEmptyDashboard(dashboard) &&
                <Grid item>
                    <ResponsiveReactGridLayout
                        className="layout"
                        draggableCancel=".RGL-draggableCancel"
                        draggableHandle=".grid-item__title"
                        breakpoints={dashboardService.breakpoints}
                        cols={dashboardService.cols}
                        layouts={dashboard.layouts}
                        useCSSTransforms
                        autoSize
                        // compactType={"horizontal"}
                        onLayoutChange={onLayoutChange}
                        onBreakpointChange={onBreakPointChange}
                    >
                        {
                            // Iterate over the dashboard.items and render each as a `Panel`.
                            // The `key` prop is crucial for React's reconciliation process.
                            Object.entries(dashboard.items).map(([key, item]) => (
                                <Panel key={key} item={item as DashboardItem} removeItem={() => removeItem(key)} />
                            ))
                        }
                    </ResponsiveReactGridLayout>
                </Grid>
            }
        </Grid>
    );
}
