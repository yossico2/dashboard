import AreaChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChartOutlined";
import LineChartIcon from "@mui/icons-material/ShowChartOutlined";
import PieChartIcon from "@mui/icons-material/PieChartOutline";
import { ChartType } from "./DashboardModel";

/** Interface representing a chart type object. */
export interface ChartItem {
  type: ChartType; // e.g., "line", "bar", "pie", "area"
  label: string; // e.g., "Line Chart", "Bar Chart"
  icon: React.ElementType; // React component for the icon
}

const chartItems: ChartItem[] = [
  {
    label: "Line",
    type: "line",
    icon: LineChartIcon,
  },
  {
    label: "Pie",
    type: "pie",
    icon: PieChartIcon,
  },
  {
    label: "Area",
    type: "area",
    icon: AreaChartIcon,
  },
  {
    label: "Bar",
    type: "bar",
    icon: BarChartIcon,
  }
];

export default chartItems;