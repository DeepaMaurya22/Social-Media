import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserProvider } from "./context/AuthContext";
import PostBox from "./components/Home/PostBox";
import DashboardLayout from "./Layout/DashboardLayout";
import AllProfiles from "./pages/All Profiles/AllProfiles";
import Chat from "./pages/Chat/Chat";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/create-post" element={<PostBox />} />
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profiles" element={<AllProfiles />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
