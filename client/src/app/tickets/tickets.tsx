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
  ButtonGroup,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import styles from "./tickets.module.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TicketInfoCard from "client/src/components/TicketInfoCard";
import { toast } from "react-toastify";

export type TicketsProps = {
  tickets: Ticket[];
  users: User[];
  onAdd: (description: string) => void;
  onAssign: (ticketId: number, userId: number) => void;
  onComplete: (ticketId: number) => void;
  isLoading: boolean;
};

const Tickets = ({
  tickets,
  users,
  onComplete,
  onAssign,
  onAdd,
  isLoading,
}: TicketsProps) => {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "incomplete"
  >("all");
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalQuickViewOpen, setIsModalQuickViewOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [updatingTicket, setUpdatingTicket] = useState<{
    ticketId: number | null;
    updateType: string | null;
  }>({
    ticketId: null,
    updateType: null,
  });

  type Column = {
    id: string;
    label: string;
    minWidth?: number;
    align?: "right" | "left" | "center" | "justify" | "inherit";
  };

  const columns: Column[] = [
    { id: "id", label: "ID", minWidth: 20, align: "left" },
    { id: "description", label: "Description", minWidth: 150, align: "left" },
    { id: "assignee", label: "Assignee", minWidth: 100, align: "left" },
    { id: "status", label: "Status", minWidth: 100, align: "left" },
    { id: "actions", label: "Actions", minWidth: 100, align: "left" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTicketDescription.trim()) {
      onAdd(newTicketDescription);
      setNewTicketDescription("");
      setIsModalOpen(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus === "all") return true;
    return filterStatus === "completed" ? ticket.completed : !ticket.completed;
  });

  const handleQuickView = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalQuickViewOpen(true);
  };

  const handleMarkComplete = async (ticket: Ticket) => {
    setUpdatingTicket({ ticketId: ticket.id, updateType: "mark_complete" });
    let textSuccess = ticket.completed
      ? "Ticket marked as incomplete!"
      : "Ticket marked as complete!";
    try {
      await onComplete(ticket.id);
      toast.success(textSuccess);
    } catch (error) {
      toast.error("Failed to update ticket");
    }
    setUpdatingTicket({ ticketId: null, updateType: null });
  };

  const handleAssign = async (ticket: Ticket, value: number) => {
    setUpdatingTicket({ ticketId: ticket.id, updateType: "assign" });
    try {
      await onAssign(ticket.id, value);
      toast.success("Assign success!");
    } catch (error) {
      toast.error("Assign fail!");
    }
    setUpdatingTicket({ ticketId: null, updateType: null });
  };

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
            width: {
              xs: "80%",
              sm: 400,
            },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: {
              xs: 2,
              sm: 4,
            },
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
              rows={4}
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
      <Modal
        open={isModalQuickViewOpen}
        onClose={() => setIsModalQuickViewOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%",
              sm: 800,
            },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: {
              xs: 1,
              sm: 4,
            },
          }}
        >
          <TicketInfoCard
            ticket={selectedTicket}
            users={users}
            onAssign={onAssign}
            onComplete={onComplete}
          />
        </Box>
      </Modal>
      <div>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={400}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ margin: 2, maxHeight: 600 }}>
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
                {filteredTickets.length ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ticket.description}
                      </TableCell>
                      <TableCell>
                        {updatingTicket.ticketId === ticket.id &&
                        updatingTicket.updateType === "assign" ? (
                          <CircularProgress size={42} />
                        ) : (
                          <Select
                            value={ticket.assigneeId ?? -1}
                            onChange={(e) =>
                              handleAssign(ticket, Number(e.target.value))
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
                        )}
                      </TableCell>
                      <TableCell>
                        {ticket.completed ? (
                          <span className={styles["__complete"]}>
                            ✅ Completed
                          </span>
                        ) : (
                          <span className={styles["__incomplete"]}>
                            ⏳ Incomplete
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {updatingTicket.ticketId === ticket.id &&
                        updatingTicket.updateType === "mark_complete" ? (
                          <CircularProgress size={24} />
                        ) : (
                          <ButtonGroup variant="outlined" size="small">
                            <Tooltip
                              title={
                                ticket.completed
                                  ? "Mark as Incomplete"
                                  : "Mark as Complete"
                              }
                            >
                              <IconButton
                                onClick={() => handleMarkComplete(ticket)}
                                color={ticket.completed ? "success" : "default"}
                              >
                                {ticket.completed ? (
                                  <CheckCircleIcon />
                                ) : (
                                  <RadioButtonUncheckedIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={"Quick View"}>
                              <IconButton
                                onClick={() => handleQuickView(ticket)}
                                color="secondary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={"Open in new tab"}>
                              <IconButton
                                onClick={() =>
                                  window.open(`/${ticket.id}`, "_blank")
                                }
                              >
                                <OpenInNewIcon />
                              </IconButton>
                            </Tooltip>
                          </ButtonGroup>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No tickets found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Tickets;
