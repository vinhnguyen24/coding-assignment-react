import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import TicketDetails from "./ticket-details";

describe("TicketDetails", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            description: "Fix login bug",
            completed: false,
            assigneeId: null,
          }),
      })
    ) as jest.Mock;
  });

  it("renders loading skeleton while fetching ticket", async () => {
    render(
      <MemoryRouter initialEntries={["/1"]}>
        <Routes>
          <Route
            path="/:id"
            element={
              <TicketDetails
                users={[]}
                onAssign={jest.fn()}
                onComplete={jest.fn()}
                resetFlag={1}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Ticket #1")).toBeInTheDocument();
    expect(screen.getByText(/Fix login bug/)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Unassigned");
  });
});
