import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={WelcomePage} />
        <Route path="/home" component={HomePage} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={LoginPage} />
      </Switch>
    </Router>
  );
};

export default App;
