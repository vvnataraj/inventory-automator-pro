import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Purchases from "./pages/Purchases";
import Analytics from "./pages/Analytics";
import Sales from "./pages/Sales";
import Progress from "./pages/Progress";
import Locations from "./pages/Locations";
import UserSettings from "./pages/UserSettings";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import Support from "./pages/Support";
import Training from "./pages/Training";
import Documentation from "./pages/Documentation";

// Add the import for AccountSettings
import AccountSettings from "./pages/AccountSettings";

function App() {
  // Check if the app is running in a development environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log the environment type to the console
  if (isDevelopment) {
    console.log('Running in development mode');
  } else {
    console.log('Running in production mode');
  }

  // Log the current version to the console
  console.log('Version:', process.env.REACT_APP_VERSION);

  // Log the build number to the console
  console.log('Build Number:', process.env.REACT_APP_BUILD_NUMBER);

  // Log the build date to the console
  console.log('Build Date:', process.env.REACT_APP_BUILD_DATE);

  // Log the git commit hash to the console
  console.log('Git Commit Hash:', process.env.REACT_APP_GIT_COMMIT_HASH);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/inventory",
      element: (
        <ProtectedRoute>
          <Inventory />
        </ProtectedRoute>
      ),
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      ),
    },
    {
      path: "/purchases",
      element: (
        <ProtectedRoute>
          <Purchases />
        </ProtectedRoute>
      ),
    },
    {
      path: "/analytics",
      element: (
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      ),
    },
    {
      path: "/sales",
      element: (
        <ProtectedRoute>
          <Sales />
        </ProtectedRoute>
      ),
    },
    {
      path: "/progress",
      element: (
        <ProtectedRoute>
          <Progress />
        </ProtectedRoute>
      ),
    },
    {
      path: "/locations",
      element: (
        <ProtectedRoute>
          <Locations />
        </ProtectedRoute>
      ),
    },
    {
      path: "/user-settings",
      element: (
        <ProtectedRoute>
          <UserSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: "/support",
      element: (
        <ProtectedRoute>
          <Support />
        </ProtectedRoute>
      ),
    },
    {
      path: "/training",
      element: (
        <ProtectedRoute>
          <Training />
        </ProtectedRoute>
      ),
    },
    {
      path: "/documentation",
      element: (
        <ProtectedRoute>
          <Documentation />
        </ProtectedRoute>
      ),
    },
    {
      path: "/account-settings",
      element: (
        <ProtectedRoute>
          <AccountSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
