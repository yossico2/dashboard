// ChartBlock.tsx
// 

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";
import { ChartType } from "../Dashboard/DashboardModel";

// Define the shape of the data for the charts
interface ChartDataItem {
  time: string; // Assuming 'time' is a string for simplicity, could be Date or number
  value: number;
  // Add other properties if your data items have them, e.g., for different pie slices
  // name?: string;
}

interface ChartBlockProps {
  type: ChartType;
  data: ChartDataItem[];
}

const CHART_MARGIN = { left: 20, right: 30, bottom: 10 };

const ChartBlock: React.FC<ChartBlockProps> = ({ type, data }) => {
  switch (type) {
    case "pie":
      return (
        <ResponsiveContainer>
          <PieChart margin={CHART_MARGIN}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="time" // Assuming 'time' is used as the nameKey for pie chart segments
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              isAnimationActive={false}
            />
          </PieChart>
        </ResponsiveContainer>
      );

    case "line":
      return (
        <ResponsiveContainer>
          <LineChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="time" />
            <YAxis dataKey="value" mirror />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#82ca9d"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "bar":
      return (
        <ResponsiveContainer>
          <BarChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="time" />
            <YAxis dataKey="value" mirror />
            <Bar dataKey="value" fill="#82ca9d" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer>
          <AreaChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="time" />
            <YAxis dataKey="value" mirror />
            <Area
              dataKey="value"
              fill="#82ca9d"
              stroke="#82ca9d"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
};

export default ChartBlock;