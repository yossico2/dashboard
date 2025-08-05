// Panel.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import MenuIcon from "@mui/icons-material/Menu";
import WarningIcon from "@mui/icons-material/Warning";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ViewIcon from "@mui/icons-material/VisibilityOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import Typography from "@mui/material/Typography";

import ChartBlock from "../Example/ChartBlock";
import chartItems from "../Example/ChartItems";
import { ChartType, DashboardItem } from "./DashboardModel";
import { useDashboard } from './DashboardContext';

/**
 * Interface representing the item prop passed to Panel.
 * This extends the DashboardContextItem to include 'type', 'title', and 'data'.
 * Adjust this interface to accurately reflect the actual properties of `item`.
 */
interface PanelProps {
    item: DashboardItem;
    removeItem: (id: string) => void;
    className?: string; // Optional className from react-grid-layout
    style?: React.CSSProperties; // Optional style from react-grid-layout
    children?: React.ReactNode; // Optional children prop
    // a function that renders the content of the grid item
    renderContent?: (item: DashboardItem) => React.ReactNode;
}

/**
 * `Panel` component represents a single draggable and resizable item within the dashboard grid.
 * It displays content provided by `renderContent` prop and provides a menu for basic item actions.
 */
const Panel = React.forwardRef<HTMLDivElement, PanelProps>((props, ref) => {

    const {
        item,
        removeItem,
        className,
        style,
        children,
        renderContent, // Function to render the content of the grid item
        ...rest
    } = props;

    // Destructure dashboard state and update function from the DashboardContext.
    const { dashboard, updateDashboard } = useDashboard();

    // State for controlling the Material-UI menu's open/close state and anchor element.
    const [anchorEl, setAnchorEl] = React.useState<any>(null);
    const open = Boolean(anchorEl);

    /**
     * Handles opening the context menu for the grid item.
     * @param {React.MouseEvent<SVGSVGElement>} event - The click event from the menu icon.
     */
    const handleMenuClick = (event: React.MouseEvent<SVGSVGElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Handles closing the context menu.
     */
    const handleMenuClose = (): void => {
        setAnchorEl(null);
    };

    // Hook from react-router-dom for programmatic navigation.
    const navigate = useNavigate();

    /**
     * Updates the `current` item in the dashboard context.
     * This is typically done before navigating to view or edit pages.
     */
    const updateCurrentItem = (): void => {
        if (dashboard && dashboard.items && item.id) {
            dashboard.current = dashboard.items[item.id];
            dashboard.current!.type = type;
            updateDashboard(dashboard);
        }
    };

    /**
     * Handles the 'View' menu item click.
     * Closes the menu, updates the current item in context, and navigates to the view page.
     */
    const handleViewClick = (): void => {
        handleMenuClose();
        updateCurrentItem();
        navigate(`/${item.id}/view`);
    };

    /**
     * Handles the 'Edit' menu item click.
     * Closes the menu, updates the current item in context, and navigates to the edit page.
     */
    const handleEditClick = (): void => {
        handleMenuClose();
        updateCurrentItem();
        navigate(`/${item.id}/edit`);
    };

    /**
     * Handles the 'Delete' menu item click.
     * Closes the menu and calls the `removeItem` prop to remove the grid item.
     */
    const handleDeleteClick = (): void => {
        handleMenuClose();
        removeItem(item.id);
    };

    // State for the currently selected chart type of this grid item.
    const [type, setType] = React.useState<ChartType>(item.type);

    /**
     * Handles the click event for changing the chart type from the menu.
     * Updates the local state `type` and closes the menu.
     * @param {string} value - The new chart type value (e.g., "line", "bar").
     */
    const handleTypeClick = (value: ChartType): void => {
        setType(value);
        handleMenuClose();
    };

    return (
        <div className={`grid-item ${className || ''}`} style={style} {...rest} ref={ref}>
            <div className="grid-item__title">
                <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                    <MenuIcon
                        htmlColor="gray"
                        onClick={handleMenuClick}
                        className="RGL-draggableCancel"
                        sx={{ px: 1, cursor: "pointer" }}
                    />
                    <Typography variant="body2" color="gray">{item.title}</Typography>
                </Box>

                <Menu
                    id="fade-menu"
                    MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem key="menu.view" onClick={handleViewClick}>
                        <ListItemIcon><ViewIcon /></ListItemIcon>
                        <ListItemText>View</ListItemText>
                    </MenuItem>

                    <MenuItem key="menu.edit" onClick={handleEditClick}>
                        <ListItemIcon><EditIcon /></ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>

                    <MenuItem key="menu.delete" onClick={handleDeleteClick}>
                        <ListItemIcon><DeleteIcon /></ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>

                    <Divider />
                    {
                        // Map through chartItems to dynamically create menu items for chart type selection
                        chartItems.map((chartType) => (
                            <MenuItem key={chartType.type} onClick={() => handleTypeClick(chartType.type)}>
                                <ListItemIcon><chartType.icon /></ListItemIcon>
                                <ListItemText>{chartType.label}</ListItemText>
                            </MenuItem>
                        ))
                    }
                </Menu>
            </div>

            <div className="grid-item__graph" style={{ overflow: 'hidden', flexBasis: "50%" }}>
                {
                    item.data && item.data.length > 0 ?
                        <ChartBlock type={type} data={item.data} />
                        :
                        <Box sx={{ display: 'flex', justifyContent: 'center', position: "relative", top: "50%", textAlign: "center" }}>
                            <WarningIcon sx={{ color: "yellow" }} />
                            <Typography variant="body2" color="gray" sx={{ ml: 1 }}>No Data</Typography>
                        </Box>
                }
            </div>
            <div className="grid-item__content" style={{ overflow: 'hidden', flexBasis: "50%", height: "100%" }}>
                {/* Render the content using the renderContent prop */}
                {renderContent?.(item)}
            </div>
            {children}
        </div>
    );
});

export default Panel;