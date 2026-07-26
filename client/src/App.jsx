// Central route map for every screen in the KejaHunt application.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login.jsx";
import SignUp from "./pages/signup.jsx";
import ForgotPassword from "./pages/forgotpassword.jsx";
import HunterDashboard from "./pages/hunterdashboard.jsx";
import SavedListings from "./pages/savedlisting.jsx";
import RoommateMatching from "./pages/roommatematching.jsx";
import OwnerDashboard from "./pages/ownerdashboard.jsx";
import NewListingDashboard from "./pages/newlistingdashboard.jsx";
import Messaging from "./pages/messaging.jsx";

export default function App() {
  return (
    // BrowserRouter enables client-side navigation without full page reloads.
    <BrowserRouter>
      <Routes>
        {/* Authentication and core house-hunter routes. */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<HunterDashboard />} />
        <Route path="/saved" element={<SavedListings />} />
        <Route path="/roommates" element={<RoommateMatching />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/new-listing" element={<NewListingDashboard />} />
        <Route path="/owner/edit/:id" element={<NewListingDashboard />} />
        <Route path="/messages" element={<Messaging />} />

        {/* Default and unknown URLs always return users to the login page. */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
