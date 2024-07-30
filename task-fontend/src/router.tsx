import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardView from "./views/DashboardView";
import CreateProjectView from "./views/Projects/CreateProjectView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
      {/* the layout will appear in all routes inside on router 
      */}
        <Route element={<AppLayout />}> 
          <Route path="/" element={<DashboardView />} index />
          <Route path="/projects/create" element={<CreateProjectView />}  />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
