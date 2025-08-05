import { DashboardModel, Layouts, DashboardItem } from "./DashboardModel";

const DASHBOARD_LOCAL_STORAGE_KEY = "dashboard";

/**
 * Manage Dashboards
 */
export default class DashboardService {

    // breakpoints = { lg: 1280, md: 1024, sm: 320, xs: 240, xxs: 0 };
    breakpoints = { lg: 1280, md: 1080, sm: 320, xs: 240, xxs: 0 };
    cols = { lg: 8, md: 6, sm: 3, xs: 2, xxs: 2 };

    /**
     * list local dashboards
     */
    listLocalDashboards() {
        // lilox:TODO
    }

    /**
     * list remote dashboards
     */
    listRemoteDashboards() {
        // lilox:TODO
    }

    /**
     * 
     * @param id load from localStorage
     */
    loadDashboard(id?: string): DashboardModel {
        const storedValue = localStorage.getItem(DASHBOARD_LOCAL_STORAGE_KEY);
        const dashboard: DashboardModel = storedValue ? JSON.parse(storedValue) : {
            current: undefined,
            items: {},
            layouts: {}
        };

        for (let id in dashboard.items) {
            const item = dashboard.items[id];
            item.id = id;

            // generate random data
            if (!item.data)
                item.data = this.generateRandomData();
        }

        return dashboard;
    }

    /**
     * save to localStorage
     * @param dashboard 
     */
    saveDashboard(dashboard: DashboardModel) {
        const holdData = {};

        // clear data
        for (let id in dashboard.items) {
            holdData[id] = dashboard.items[id].data;
            delete dashboard.items[id].data;
        }

        localStorage.setItem(DASHBOARD_LOCAL_STORAGE_KEY, JSON.stringify(dashboard));

        // restore data
        for (let id in dashboard.items)
            dashboard.items[id].data = holdData[id];
    }

    /**
     * 
     * @param dashboard Add to localStorage
     */
    addDashboard(dashboard: DashboardModel) {
        // lilox:TODO
    }

    /**
     * 
     * @param id Remove from LOCAL storage
     */
    removeDashboard(id: string) {
        // lilox:TODO
    }

    /**
     * 
     * @param id Delete from REMOTE storage
     */
    deleteDashboard(id: string) {
        // lilox:TODO
    }

    /**
     * Export dashboard to file
     * @param id
     * @param path 
     */
    exportDashboard(id: string, path: string) {
        // lilox:TODO
    }

    /**
     * Add a new item to the dashboard
     * @param dashboard 
     */
    addItem(dashboard: DashboardModel, title?: string): DashboardItem {
        // generate new id
        let idNum = 1;
        const idPrefix = 'dashboard-item-';

        for (let id in dashboard.items) {
            const id2 = parseInt(id.substring(idPrefix.length));
            if (id2 >= idNum)
                idNum = id2 + 1;
        }

        const id = `${idPrefix}${idNum}`;
        if (!title)
            title = `Panel ${idNum}`;

        const type = "line";

        // generate random data
        const data: { time: string, value: number }[] = this.generateRandomData();

        dashboard.items[id] = {
            id,
            type,
            title,
            data
        };

        this.generateLayoutes(dashboard, id);
        this.saveDashboard(dashboard);
        return dashboard.items[id];
    }

    generateRandomData() {
        const data: { time: string, value: number }[] = [];
        for (let i = 0; i < 50; i++) {
            data.push(
                {
                    time: `${Math.floor(Math.random() * 13)}:${Math.floor(Math.random() * 60)} AM`,
                    value: Math.floor(Math.random() * 5000)
                }
            );
        }

        return data;
    }

    generateLayoutes(dashboard: DashboardModel, id: string) {
        for (let name of ["lg", "md", "sm", "xs", "xxs"]) {
            const layout = dashboard.layouts[name];
            if (!layout || layout.length === 0) {
                switch (name) {
                    case "lg":
                    case "md":
                        dashboard.layouts[name] = [{ w: 2, h: 2, x: 0, y: 0, i: id }];
                        break;
                    case "sm":
                    case "xs":
                    case "xxs":
                        dashboard.layouts[name] = [{ w: 1, h: 1, x: 0, y: 0, i: id }];
                        break;
                }
            }
            else {
                let w, h;
                switch (name) {
                    case "lg":
                    case "md":
                        w = h = 2;
                        break;
                    default:
                        w = h = 1;
                        break;
                }

                const cols = this.cols[name];

                // find row to insert
                const itemsPerRow = cols / w;
                const y = Math.floor(layout.length / itemsPerRow) * h;

                // find column to insert
                let x = 0;
                for (let i = 0; i < layout.length; i++) {
                    if (layout[i]["y"] === y) {
                        if (layout[i]["x"] >= x) {
                            x = layout[i]["x"] + layout[i]["w"];
                        }
                    }
                }

                layout.push({ w: w, h: h, x: x, y: y, i: id });
            }
        }
    }

    removeItem(dashboard: DashboardModel, id: string) {
        // update dashboard.items
        delete dashboard.items[id];

        // update layouts
        for (let size in dashboard.layouts)
            dashboard.layouts[size] = dashboard.layouts[size].filter(function (obj) { return obj.i !== id; });

        // save changes
        this.saveDashboard(dashboard);
    }

    setLayouts(dashboard: DashboardModel, newLayouts: Layouts) {
        dashboard.layouts = newLayouts;
        this.saveDashboard(dashboard);
    }
}
