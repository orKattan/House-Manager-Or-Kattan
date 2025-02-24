import React from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/UserContext"; // Import AuthProvider from UserContext
import { UserProvider } from "./contexts/UserContext"; // Import UserProvider
import { TaskProvider } from "./contexts/TaskContext"; // Import TaskProvider
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; // Import Sidebar
import WelcomePage from "./pages/WelcomePage";
import CalendarPage from "./pages/CalendarPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateTaskPage from './pages/CreateTaskPage';
import FilterTasksPage from './pages/FilterTasksPage';
import RoomTasksPage from './pages/RoomTasksPage';
import EditAccountPage from './pages/EditAccountPage'; // Import EditAccountPage
import EditPasswordPage from './pages/EditPasswordPage'; // Import EditPasswordPage
import './App.css'; // Import App.css for layout styles

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <TaskProvider>
          <Router>
            <AppContent />
          </Router>
        </TaskProvider>
      </UserProvider>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar = !["/", "/login", "/register"].includes(location.pathname);
  const showSidebar = ["/create-task", "/filter-tasks", "/tasks", "/edit-account", "/edit-password"].some(path => location.pathname.startsWith(path));

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="app-layout">
        {showSidebar && <Sidebar />}
        <div className="main-content">
          <Switch>
            <Route path="/" exact component={WelcomePage} />
            <Route path="/calendar" component={CalendarPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/create-task" component={CreateTaskPage} />
            <Route path="/filter-tasks" component={FilterTasksPage} />
            <Route path="/tasks/:room" component={RoomTasksPage} />
            <Route path="/edit-account" component={EditAccountPage} /> {/* Add route for EditAccountPage */}
            <Route path="/edit-password" component={EditPasswordPage} /> {/* Add route for EditPasswordPage */}
          </Switch>
        </div>
      </div>
    </>
  );
};

export default App;
