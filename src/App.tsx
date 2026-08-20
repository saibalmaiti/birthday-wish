import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import CreateBirthday from "./pages/CreateBirthday";
import BirthdayCreated from "./pages/BirthdayCreated";
import BirthdayPage from "./pages/BirthdayPage";

const App = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;