import { Ticket, User } from "@acme/shared-models";
import { Box, Typography, Select, MenuItem, Button } from "@mui/material";
import styles from "../app/app.module.css";

type Props = {
  ticket: Ticket | null;
  users: User[];
  onAssign: (ticketId: number, userId: number) => void;
  onComplete: (ticketId: number) => void;
};

const TicketInfoCard = ({ ticket, users, onAssign, onComplete }: Props) => {
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
        <Select
          value={ticket?.assigneeId ?? -1}
          fullWidth
          onChange={(e) => onAssign(ticket.id, Number(e.target.value))}
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
          onClick={() => onComplete(ticket.id)}
          variant="contained"
          color="primary"
          fullWidth
        >
          {ticket?.completed ? "Mark Incomplete" : "Mark Complete"}
        </Button>
      </Box>
    </Box>
  ) : null;
};

export default TicketInfoCard;
