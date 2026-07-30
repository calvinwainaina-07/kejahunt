// Central route map for every screen in the KejaHunt application.
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/signup.jsx";
import ForgotPassword from "./pages/forgotpassword.jsx";
import HunterDashboard from "./pages/hunterdashboard.jsx";
import SavedListings from "./pages/savedlisting.jsx";
import RoommateMatching from "./pages/roommatematching.jsx";
import OwnerDashboard from "./pages/ownerdashboard.jsx";
import NewListingDashboard from "./pages/newlistingdashboard.jsx";
import Messaging from "./pages/messaging.jsx";
import Profile from "./pages/profile.jsx";
import PropertyDetails from "./pages/propertydetails.jsx";
import Bookings from "./pages/bookings.jsx";
import Notifications from "./pages/notifications.jsx";
import RoommateProfile from "./pages/roommateprofile.jsx";

export default function App() {
  // All page-level navigation is declared here to keep URLs in one central place.
  return (
    // HashRouter keeps each screen reachable when the app is served from VS Code or a static host.
    <HashRouter>
      <Routes>
        {/* Authentication and core house-hunter routes. */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<HunterDashboard />} />
        <Route path="/saved" element={<SavedListings />} />
        <Route path="/roommates" element={<RoommateMatching />} />
        <Route path="/roommate-profile" element={<RoommateProfile />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/new-listing" element={<NewListingDashboard />} />
        <Route path="/owner/edit/:id" element={<NewListingDashboard />} />
        <Route path="/messages" element={<Messaging />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        {/* Dynamic route: id identifies the listing selected by the user. */}
        <Route path="/property/:id" element={<PropertyDetails />} />

        {/* Start visitors on the public landing page. */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
