export type TicketStatus = "open" | "in-progress" | "completed";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignee?: string;
}
