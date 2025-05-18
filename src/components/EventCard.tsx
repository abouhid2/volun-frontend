import React from "react";
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Event } from "../types";
import { ParticipantButton } from "./ParticipantButton";

interface EventCardProps {
  event: Event;
  onParticipationChange: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onParticipationChange,
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {event.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {new Date(event.date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {event.description}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Participants ({event.participants_count})
        </Typography>
        {event.participants && event.participants.length > 0 ? (
          <List dense>
            {event.participants.map((participant) => (
              <ListItem key={participant.id}>
                <ListItemText primary={participant.name} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No participants yet
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2
          }}
        >
          <ParticipantButton
            eventId={event.id}
            isParticipating={event.is_participating}
            onParticipationChange={onParticipationChange}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
