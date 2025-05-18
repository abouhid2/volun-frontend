import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { getEvents } from "../services/api";
import { Event } from "../types";
import { EventCard } from "./EventCard";
import { EventForm } from "./EventForm";

export const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events...');
      const data = await getEvents();
      console.log('Events received:', data);
      setEvents(data);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.error || "Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography>Loading events...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" component="h1">
              Events
            </Typography>
            <Button variant="contained" onClick={() => setIsFormOpen(true)}>
              Create Event
            </Button>
          </Box>
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          <Button variant="outlined" onClick={fetchEvents}>
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Events
          </Typography>
          <Button variant="contained" onClick={() => setIsFormOpen(true)}>
            Create Event
          </Button>
        </Box>

        {events.length === 0 ? (
          <Typography>No events available.</Typography>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onParticipationChange={fetchEvents}
            />
          ))
        )}

        <EventForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onEventCreated={fetchEvents}
        />
      </Box>
    </Container>
  );
};
