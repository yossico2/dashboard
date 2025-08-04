// App.tsx
// 

import "./App.css";
import Dashboard from "./Dashboard/Dashboard";
import { Box } from '@mui/material';

function App() {
  return (
    <Box id="app" sx={{ width: "100vw", height: "100vh" }}>
      <Dashboard />
    </Box>
  );
}

export default App;