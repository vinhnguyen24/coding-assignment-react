import { useState } from "react";
import { Ticket, User } from "@acme/shared-models";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  TextField,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import styles from "./tickets.module.css";

export type TicketsProps = {
  tickets: Ticket[];
  users: User[];
  onAdd: (description: string) => void;
  onAssign: (ticketId: number, userId: number) => void;
  onComplete: (ticketId: number) => void;
};

const Tickets = ({
  tickets,
  users,
  onComplete,
  onAssign,
  onAdd,
}: TicketsProps) => {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "incomplete"
  >("all");
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  type Column = {
    id: string;
    label: string;
    minWidth?: number;
    align?: "right" | "left" | "center" | "justify" | "inherit";
  };

  const columns: Column[] = [
    { id: "id", label: "ID", minWidth: 50, align: "left" },
    { id: "description", label: "Description", minWidth: 150, align: "left" },
    { id: "assignee", label: "Assignee", minWidth: 100, align: "left" },
    { id: "status", label: "Status", minWidth: 100, align: "center" },
    { id: "actions", label: "Actions", minWidth: 100, align: "center" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTicketDescription.trim()) {
      onAdd(newTicketDescription);
      setNewTicketDescription("");
      setIsModalOpen(false);
    }
  };

  // Filter tickets based on completed status (boolean)
  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus === "all") return true;
    return filterStatus === "completed" ? ticket.completed : !ticket.completed;
  });

  return (
    <div className={styles["tickets"]}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(!isModalOpen)}
        className={styles["__button"]}
      >
        Add New Ticket
      </Button>
      <FormControl className={styles["__filter"]}>
        <InputLabel>Filter</InputLabel>
        <Select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(
              e.target.value as "all" | "completed" | "incomplete"
            )
          }
          label="Filter"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="incomplete">Incomplete</MenuItem>
        </Select>
      </FormControl>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Add New Ticket</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              value={newTicketDescription}
              onChange={(e) => setNewTicketDescription(e.target.value)}
              label="Ticket Description"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "1rem" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
            >
              Add Ticket
            </Button>
          </form>
        </Box>
      </Modal>
      <div className={styles["__table-wrapper"]}>
        <TableContainer component={Paper} sx={{ margin: 2 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead className={styles["__table-head"]}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.description}</TableCell>
                  <TableCell>
                    <Select
                      value={ticket.assigneeId ?? -1}
                      onChange={(e) =>
                        onAssign(ticket.id, Number(e.target.value))
                      }
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value={-1}>Unassigned</MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {ticket.completed ? "✅ Completed" : "⏳ Incomplete"}
                  </TableCell>
                  <TableCell>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={ticket.completed}
                            onChange={() => onComplete(ticket.id)}
                            color="primary"
                            inputProps={{
                              "aria-label": "Mark ticket as complete",
                            }}
                          />
                        }
                        label="Complete"
                      />
                    </FormGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Tickets;
