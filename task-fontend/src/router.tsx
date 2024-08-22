import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardView from "./views/DashboardView";
import CreateProjectView from "./views/Projects/CreateProjectView";
import EditProjectsViews from "./views/Projects/EditProjectsViews";
import ProjectsDetailsView from "./views/Projects/ProjectsDetailsView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ConfirmAccountView from "./views/auth/ConfirmAccountView";
import RequestNewCode from "./views/auth/RequestNewCode";
import ForgotPasswordView from "./views/auth/ForgotPasswordView";
import NewPasswordView from "./views/auth/NewPasswordView";
import ProjectTeamView from "./views/Projects/ProjectTeamView";
import ProfileView from "./views/profile/ProfileView";
import ChangePasswordView from "./views/profile/ChangePasswordView";
import ProfileLayout from "./layouts/ProfileLayout";
import NotFound from "./views/404/NotFound";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* the layout will appear in all routes inside on router
         */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} index />
          <Route path="/projects/create" element={<CreateProjectView />} />
          <Route
            path="/projects/:projectId/edit"
            element={<EditProjectsViews />}
          />
          <Route
            path="/projects/:projectId/team"
            element={<ProjectTeamView />}
          />
          <Route
            path="/projects/:projectId"
            element={<ProjectsDetailsView />}
          />
            {/* This layout is inside the Layoutapp */}
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/profile/password" element={<ChangePasswordView />} />
          </Route>
        </Route>

        {/* the layout will appear in all routes inside on router
         */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
          <Route
            path="/auth/confirm-account"
            element={<ConfirmAccountView />}
          />
          <Route path="/auth/request-code" element={<RequestNewCode />} />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordView />}
          />
          <Route path="/auth/new-password" element={<NewPasswordView />} />
        </Route>

          <Route element={<AuthLayout/>}>
          <Route path="/404" element={<NotFound/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
