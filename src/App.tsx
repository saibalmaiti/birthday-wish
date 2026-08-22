import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Footer from "./components/romantic/Footer";

import CreateBirthday from "./pages/CreateBirthday";
import BirthdayCreated from "./pages/BirthdayCreated";
import BirthdayPage from "./pages/BirthdayPage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        {/* Main page content */}
        <div className="flex-1">
          <Routes>
            {/* Default route */}
            <Route
              path="/"
              element={<Navigate to="/create" replace />}
            />

            {/* Create a new birthday surprise */}
            <Route
              path="/create"
              element={<CreateBirthday />}
            />

            {/* Page shown immediately after creation */}
            <Route
              path="/created/:slug"
              element={<BirthdayCreated />}
            />

            {/* Actual shared birthday surprise */}
            <Route
              path="/b/:slug"
              element={<BirthdayPage />}
            />

            {/* Temporary: edit route will be built next */}
            <Route
              path="*"
              element={<Navigate to="/create" replace />}
            />
          </Routes>
        </div>

        {/* Common footer for every page */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;