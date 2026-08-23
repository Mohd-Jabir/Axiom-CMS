import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import PublicLayout from "../components/layout/PublicLayout.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import GuestRoute from "../routes/GuestRoute.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import RoleRoute from "../routes/RoleRoute.jsx";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import ResendVerification from "../pages/ResendVerification.jsx";
import Posts from "../pages/Posts.jsx";
import PostDetails from "../pages/PostDetails.jsx";
import PostEditor from "../pages/PostEditor.jsx";
import MyPosts from "../pages/MyPosts.jsx";
import Category from "../pages/Category.jsx";
import Tag from "../pages/Tag.jsx";
import Profile from "../pages/Profile.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ManageCategories from "../pages/ManageCategories.jsx";
import ManageTags from "../pages/ManageTags.jsx";
import Admin from "../pages/Admin.jsx";
import AdminUsers from "../pages/AdminUsers.jsx";
import NotFound from "../pages/NotFound.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "posts",
            element: <Posts />,
          },
          {
            path: "posts/:slug",
            element: <PostDetails />,
          },
          {
            path: "category/:slug",
            element: <Category />,
          },
          {
            path: "tag/:slug",
            element: <Tag />,
          },
          {
            path: "users/:username",
            element: <Profile />,
          },
          {
            path: "verify-email",
            element: <VerifyEmail />,
          },
        ],
      },
     {
  element: <GuestRoute />,
  children: [
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
  ],
},

{
  path: "resend-verification",
  element: <ResendVerification />,
},
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "my-posts",
            element: (
              <RoleRoute allowedRoles={["admin", "editor", "author", "user"]} />
            ),
            children: [
              {
                index: true,
                element: <MyPosts />,
              },
            ],
          },
          {
            path: "posts/create",
            element: (
              <RoleRoute allowedRoles={["admin", "editor", "author", "user"]} />
            ),
            children: [
              {
                index: true,
                element: <PostEditor />,
              },
            ],
          },
          {
            path: "posts/edit/:id",
            element: (
              <RoleRoute allowedRoles={["admin", "editor", "author", "user"]} />
            ),
            children: [
              {
                index: true,
                element: <PostEditor />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["admin"]} />,

            children: [
              {
                element: <DashboardLayout />,

                children: [
                  {
                    path: "dashboard",
                    element: <Dashboard />,
                  },

                  {
                    path: "dashboard/categories",
                    element: <ManageCategories />,
                  },

                  {
                    path: "dashboard/tags",
                    element: <ManageTags />,
                  },

                  {
                    path: "admin",
                    element: <Admin />,
                  },

                  {
                    path: "admin/users",
                    element: <AdminUsers />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
