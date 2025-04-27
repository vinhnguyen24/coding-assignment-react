import { Ticket, User } from "@acme/shared-models";
import { Box, Typography, Select, MenuItem, Button, Skeleton } from "@mui/material";
import styles from "../app/app.module.css";
import { toast } from "react-toastify";
import { useState } from "react";

type Props = {
  ticket: Ticket | null;
  users: User[];
  onAssign: (ticketId: number, userId: number) => void;
  onComplete: (ticketId: number) => void;
};

const TicketInfoCard = ({ ticket, users, onAssign, onComplete }: Props) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async (ticket: Ticket) => {
    let textSuccess = ticket.completed
      ? "Ticket marked as incomplete!"
      : "Ticket marked as complete!";
      setIsLoading(true)
    try {
      await onComplete(ticket.id);
      toast.success(textSuccess);
      setIsLoading(false)
    } catch (error) {
      toast.error("Failed to update ticket");
      setIsLoading(false)
    }
  };

  const handleAssign = async (ticket: Ticket, value: number) => {
    setIsLoading(true)
    try {
      await onAssign(ticket.id, value);
      toast.success("Assign success!");
      setIsLoading(false)
    } catch (error) {
      toast.error("Assign fail!");
      setIsLoading(false)
    }
  };
  return ticket ? (
    <Box className={styles["__ticket-card"]}>
      {/* LEFT: Description */}
      <Box flex={7}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Description:</strong>
        </Typography>
        <Box className={styles["__description"]}>
          <Typography variant="body1">{ticket?.description}</Typography>
        </Box>
      </Box>

      {/* RIGHT: Actions */}
      <Box className={styles["__actions"]}>
        {isLoading ? <> <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" height={40} /></>:<><Select
          value={ticket?.assigneeId ?? -1}
          fullWidth
          onChange={(e) => handleAssign(ticket, Number(e.target.value))}
          sx={{ mb: 2 }}
        >
          <MenuItem value={-1}>Unassigned</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Status:</strong>{" "}
          {ticket?.completed ? "✅ Completed" : "⏳ Incomplete"}
        </Typography>
        <Button
          onClick={() => handleMarkComplete(ticket)}
          variant="contained"
          color="primary"
          fullWidth
        >
          {ticket?.completed ? "Mark Incomplete" : "Mark Complete"}
        </Button></>}
        
      </Box>
    </Box>
  ) : null;
};

export default TicketInfoCard;
