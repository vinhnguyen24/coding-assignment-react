import { useState } from "react";
import { Ticket, User } from "@acme/shared-models";
import {
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";

interface TicketsProps {
  tickets: Ticket[];
  users: User[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const Tickets = ({ tickets, users, setTickets }: TicketsProps) => {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "incomplete"
  >("all");
  const [newTicketDescription, setNewTicketDescription] = useState("");

  // Filter tickets based on completed status (boolean)
  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus === "all") return true;
    return filterStatus === "completed" ? ticket.completed : !ticket.completed;
  });

  // Handle adding a new ticket
  const handleAddTicket = async () => {
    if (newTicketDescription.trim() === "") {
      alert("Please enter a ticket description");
      return;
    }

    const newTicket = {
      description: newTicketDescription,
      assigneeId: null,
      completed: false,
    };

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });

      if (!response.ok) {
        throw new Error("Failed to create a new ticket");
      }

      const createdTicket = await response.json();
      setTickets([...tickets, createdTicket]); // Update the tickets list with the new ticket
      setNewTicketDescription(""); // Clear the input field
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Now that TypeScript knows `error` is an instance of `Error`, we can access `message`
        alert("Error creating ticket: " + error.message);
      } else {
        // In case the error is not an instance of `Error`, we can handle it differently
        alert("An unknown error occurred while creating the ticket.");
      }
    }
  };

  // Handle completing a ticket
  const handleCompleteTicket = async (ticketId: number) => {
    await fetch(`/api/tickets/${ticketId}/complete`, { method: "PUT" });
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, completed: true } : ticket
    );
    setTickets(updatedTickets);
  };

  // Handle assigning a user to a ticket
  const handleAssignUser = async (ticketId: number, userId: number) => {
    await fetch(`/api/tickets/${ticketId}/assign/${userId}`, { method: "PUT" });
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, assigneeId: userId } : ticket
    );
    setTickets(updatedTickets);
  };

  return (
    <Box>
      <div>
        <h2>Filter Tickets</h2>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as "all" | "completed" | "incomplete"
              )
            }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="incomplete">Incomplete</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div>
        <h2>Add New Ticket</h2>
        <TextField
          label="Ticket Description"
          variant="outlined"
          fullWidth
          value={newTicketDescription}
          onChange={(e) => setNewTicketDescription(e.target.value)}
          placeholder="Enter ticket description"
        />
        <Button
          onClick={handleAddTicket}
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          Add Ticket
        </Button>
      </div>

      {filteredTickets.map((ticket) => (
        <Box
          key={ticket.id}
          padding={2}
          border="1px solid #ccc"
          marginTop="10px"
        >
          <Typography>{ticket.description}</Typography>
          <Typography>
            {ticket.completed ? "Completed" : "In Progress"}
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Assign User</InputLabel>
            <Select
              value={ticket.assigneeId ?? ""}
              onChange={(e) =>
                handleAssignUser(ticket.id, Number(e.target.value))
              }
            >
              <MenuItem value={""}>Unassigned</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            onClick={() => handleCompleteTicket(ticket.id)}
            disabled={ticket.completed}
            style={{ marginTop: "10px" }}
          >
            {ticket.completed ? "Completed" : "Complete Ticket"}
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default Tickets;
