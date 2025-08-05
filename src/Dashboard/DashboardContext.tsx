import React from "react";
import { DashboardModel } from "./DashboardModel";
import DashboardService from "./DashboardService";

type DashboardContextModel = {
    dashboard: DashboardModel | undefined
    updateDashboard: (dashboard: DashboardModel | undefined) => void;
    dashboardService: DashboardService;
}

// create the context
const DashboardContext = React.createContext<DashboardContextModel | undefined>(undefined);

// create a custom hook to use the context
export const useDashboard = () => {
    const context = React.useContext(DashboardContext);
    if (!context)
        throw new Error("useDashboard must be used within a DashboardContextProvider");
    return context;
};

// create a provider component
export const DashboardContextProvider = ({ children }) => {

    const updateDashboard = (value) => {
        setDashboard({ ...value });
    }

    const [dashboard, setDashboard] = React.useState<DashboardModel | undefined>({ current: undefined, items: {}, layouts: {} });

    const dashboardService = new DashboardService();

    return (
        <DashboardContext.Provider value={{ dashboard, updateDashboard, dashboardService }}>
            {children}
        </DashboardContext.Provider>
    );
};
