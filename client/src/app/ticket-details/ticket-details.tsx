import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Ticket, User } from "@acme/shared-models";
import { Typography, Paper, Button, Skeleton } from "@mui/material";
import TicketInfoCard from "../../components/TicketInfoCard";
import styles from "./ticket-details.module.css";

type Props = {
  users: User[];
  onAssign: (ticketId: number, userId: number) => void;
  onComplete: (ticketId: number) => void;
};

const TicketDetails = ({ users, onAssign, onComplete }: Props) => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        if (!res.ok) {
          throw new Error("Ticket not found");
        }
        const data = await res.json();
        setTicket(data);
      } catch (error) {
        setIsError(true);
      }
    };

    fetchTicket();
  }, [id]);

  if (isError) {
    return (
      <div className={styles["__ticket-card"]}>
        <Paper sx={{ p: 4, maxWidth: 600, margin: "auto" }}>
          <Typography variant="h5" color="error">
            404 Ticket Not Found
          </Typography>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Go Back to Home
          </Button>
        </Paper>
      </div>
    );
  }

  if (!ticket) {
    return (
      <Paper sx={{ p: 4, maxWidth: 600, margin: "auto" }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={30} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          sx={{ mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          sx={{ mb: 2 }}
        />
      </Paper>
    );
  }

  return (
    <div className={styles["ticket-details"]}>
      <h3>Ticket #{ticket.id}</h3>
      <TicketInfoCard
        ticket={ticket}
        users={users}
        onAssign={onAssign}
        onComplete={onComplete}
      />
    </div>
  );
};

export default TicketDetails;
