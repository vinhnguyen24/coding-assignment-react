import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Ticket, User } from "@acme/shared-models";

import styles from "./app.module.css";
import Tickets from "./tickets/tickets";

const App = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).
  useEffect(() => {
    async function fetchTickets() {
      const data = await fetch("/api/tickets").then();
      setTickets(await data.json());
    }

    async function fetchUsers() {
      const data = await fetch("/api/users").then();
      setUsers(await data.json());
    }

    fetchTickets();
    fetchUsers();
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
    } catch (err) {
      console.error("Assign error", err);
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
    } catch (err) {
      console.error("Complete error", err);
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
    <div className={styles["app"]}>
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
            />
          }
        />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<h2>Details Not Implemented</h2>} />
      </Routes>
    </div>
  );
};

export default App;
