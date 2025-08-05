// DetailPage.tsx
// 
import React from "react"; // Explicitly import React
import { Link, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";

import ChartBlock from "./ChartBlock";
import chartItems from "./ChartItems"; // Assuming chartItems is an array of objects with value, label, and icon

// Import types from DashboardContext to ensure consistency
import { useDashboard } from '../Dashboard/DashboardContext';
import { ChartType } from "../Dashboard/DashboardModel";

/**
 * `DetailPage` component displays a detailed view of a selected chart from the dashboard.
 * It allows changing the chart type and navigating back to the main dashboard or to the edit page.
 */
export default function DetailPage(): React.ReactElement {
  // Destructure dashboard state from the DashboardContext.
  const { dashboard, updateDashboard } = useDashboard(); // Assuming updateDashboard is also available and used for type change

  // Hook from react-router-dom for programmatic navigation.
  const navigate = useNavigate();

  // State for controlling the Material-UI menu's open/close state and anchor element.
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);

  /**
   * Handles opening the context menu.
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

  /**
   * Handles the click event for changing the chart type from the menu.
   * Updates the `type` property of the `dashboard.current` item and closes the menu.
   * @param {string} type - The new chart type value (e.g., "line", "bar").
   */
  const handleTypeClick = (type: ChartType): void => {
    if (dashboard && dashboard.current) {
      // Cast dashboard.current to DashboardItem to ensure 'type' property is recognized
      dashboard.current.type = type;
      // It's good practice to update the context if a property of a nested object changes
      updateDashboard({ ...dashboard }); // Force context update by creating a new object reference
    }
    handleMenuClose();
  };

  /**
   * `useEffect` hook to redirect to the dashboard root if no current item is selected
   * or if the dashboard context is not available.
   */
  React.useEffect(() => {
    if (!dashboard || !dashboard.current) {
      // redirect to dashboard root
      navigate("/");
    }
  }, [dashboard, navigate]); // Dependencies ensure effect runs when these change

  // Early exit: Render nothing if no context or current item is available,
  // as the useEffect will handle the redirection.
  if (!dashboard || !dashboard.current) {
    return (<></>);
  }

  // Cast dashboard.current for easier access to its properties with correct types
  const currentItem = dashboard.current;

  return (
    <Box sx={{ width: "90vw", height: "90vh" }}>
      <div className="detail-page__title">
        <MenuIcon htmlColor="gray" onClick={handleMenuClick} sx={{ px: 1, cursor: "pointer" }} />
        <Typography variant="body2" color="gray">{currentItem.title} (details)</Typography>
      </div>

      <Link className="go-back" to="/"><CloseIcon /></Link>

      <Menu
        id="fade-menu"
        MenuListProps={{ 'aria-labelledby': 'fade-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        {/* Link to the edit page for the current item */}
        <MenuItem onClick={handleMenuClose}>
          <Link to={`/${currentItem.id}/edit`} style={{ color: '#000000' }}>Edit</Link>
        </MenuItem>

        <Divider />

        {/* Map through chartItems to dynamically create menu items for chart type selection */}
        {
          chartItems.map((chartType) => (
            <MenuItem key={chartType.type} onClick={() => handleTypeClick(chartType.type)}>
              <ListItemIcon><chartType.icon /></ListItemIcon>
              <ListItemText>{chartType.label}</ListItemText>
            </MenuItem>
          ))
        }
      </Menu>

      {/* Render the ChartBlock with the current item's type and data */}
      <ChartBlock type={currentItem.type} data={currentItem.data} />
    </Box>
  );
}