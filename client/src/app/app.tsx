import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Ticket, User } from "@acme/shared-models";
import styles from "./app.module.css";
import Tickets from "./tickets/tickets";
import TicketDetails from "./ticket-details/ticket-details";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { ErrorBoundary } from "../components/ErrorBoundary";

const App = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);
  const [isLoading, setIsLoading] = useState(false);
  const [resetFlag, setResetFlag] = useState(1);

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).
  useEffect(() => {
    setIsLoading(true);
    async function fetchTickets() {
      const ticketsData = await fetch("/api/tickets");
      return ticketsData.json();
    }
    async function fetchUsers() {
      const usersData = await fetch("/api/users");
      return usersData.json();
    }
    Promise.all([fetchTickets(), fetchUsers()])
      .then(([ticketsResponse, usersResponse]) => {
        setTickets(ticketsResponse);
        setUsers(usersResponse);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAssign = async (ticketId: number, userId: number) => {
    try {
      if (userId !== -1) {
        await fetch(`/api/tickets/${ticketId}/assign/${userId}`, {
          method: "PUT",
        });
      } else {
        await fetch(`/api/tickets/${ticketId}/unassign`, {
          method: "PUT",
        });
      }

      const res = await fetch("/api/tickets");
      const updated = await res.json();
      setTickets(updated);
      setResetFlag(resetFlag + 1);
    } catch (err) {
      console.error("Assign error", err);
      setResetFlag(resetFlag + 1);
    }
  };

  const handleComplete = async (ticketId: number) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;
    try {
      if (ticket.completed) {
        await fetch(`/api/tickets/${ticketId}/complete`, {
          method: "DELETE",
        });
      } else {
        await fetch(`/api/tickets/${ticketId}/complete`, {
          method: "PUT",
        });
      }
      const res = await fetch("/api/tickets");
      const updated = await res.json();
      setTickets(updated);
      setResetFlag(resetFlag + 1);
    } catch (err) {
      console.error("Complete error", err);
      setResetFlag(resetFlag + 1);
    }
  };

  const handleAddTicket = async (description: string) => {
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      const newTicket = await res.json();
      setTickets((prev) => [...prev, newTicket]);
    } catch (err) {
      console.error("Add ticket error:", err);
    }
  };

  return (
    <ErrorBoundary>
      <div className={styles["app"]}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <h1>Ticketing App</h1>
      <Routes>
        <Route
          path="/"
          element={
            <Tickets
              tickets={tickets}
              users={users}
              onComplete={handleComplete}
              onAssign={handleAssign}
              onAdd={handleAddTicket}
              isLoading={isLoading}
            />
          }
        />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route
          path="/:id"
          element={
            <TicketDetails
              users={users}
              onAssign={handleAssign}
              onComplete={handleComplete}
              resetFlag={resetFlag}
            />
          }
        />
      </Routes>
    </div>
    </ErrorBoundary>
    
  );
};

export default App;
