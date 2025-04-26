import { render, screen } from "@testing-library/react";
import Tickets from "./tickets";
import { BrowserRouter } from "react-router-dom";

describe("Tickets", () => {
  it("renders the Tickets page", () => {
    render(
      <BrowserRouter>
        <Tickets
          tickets={[]}
          users={[]}
          onAdd={jest.fn()}
          onAssign={jest.fn()}
          onComplete={jest.fn()}
          isLoading={false}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/Add New Ticket/i)).toBeInTheDocument();
  });
});
