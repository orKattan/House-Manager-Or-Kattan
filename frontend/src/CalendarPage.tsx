import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Typography, Button, Box } from '@mui/material';

// Define the shape of a Task
interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  start_time?: string;
  end_time?: string;
  category: Category;
}

// Define an Enum for the categories
enum Category {
  Bathroom = "bathroom",
  Bedroom = "bedroom",
  Garden = "garden",
  Kitchen = "kitchen",
  Laundry = "laundry",
  Livingroom = "livingroom"
}

const localizer = momentLocalizer(moment);

function CalendarPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch tasks once on component mount
  useEffect(() => {
    console.log("CalendarPage component mounted");
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      alert("Please log in first");
      navigate("/login");
      return;
    }
    fetch("http://localhost:8000/tasks", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired or unauthorized");
          navigate("/login");
          return [];
        }
        return res.json();
      })
      .then((data: Task[]) => {
        console.log("Fetched tasks:", data); // Debugging log
        setTasks(data);
        const events = data.map(task => ({
          title: task.title,
          start: new Date(task.start_time || ""),
          end: new Date(task.end_time || ""),
          allDay: false,
          resource: task
        }));
        setEvents(events);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [navigate]);

  useEffect(() => {
    console.log("Tasks state updated:", tasks);
  }, [tasks]);

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Calendar View
      </Typography>
      <Box sx={{ marginBottom: '1rem' }}>
        <Button variant="contained" component={Link} to="/">
          Back to Home
        </Button>
      </Box>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </Container>
  );
}

export default CalendarPage;
