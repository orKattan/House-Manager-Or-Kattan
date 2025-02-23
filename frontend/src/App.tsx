import React from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext"; // Import UserProvider
import { TaskProvider } from "./contexts/TaskContext"; // Import TaskProvider
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; // Import Sidebar
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateTaskPage from './pages/CreateTaskPage';
import FilterTasksPage from './pages/FilterTasksPage';
import RoomTasksPage from './pages/RoomTasksPage';
import './App.css'; // Import App.css for layout styles

const App: React.FC = () => {
  return (
    <UserProvider>
      <TaskProvider>
        <Router>
          <AppContent />
        </Router>
      </TaskProvider>
    </UserProvider>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar = !["/", "/login", "/register"].includes(location.pathname);
  const showSidebar = ["/create-task", "/filter-tasks", "/tasks"].some(path => location.pathname.startsWith(path));

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="app-layout">
        {showSidebar && <Sidebar />}
        <div className="main-content">
          <Switch>
            <Route path="/" exact component={WelcomePage} />
            {/* <Route path="/HomePage" exact component={HomePage} /> */}
            <Route path="/calendar" component={CalendarPage} />
            <Route path="/profile" component={ProfileEditPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/create-task" component={CreateTaskPage} />
            <Route path="/filter-tasks" component={FilterTasksPage} />
            <Route path="/tasks/:room" component={RoomTasksPage} />
          </Switch>
        </div>
      </div>
    </>
  );
};

export default App;
