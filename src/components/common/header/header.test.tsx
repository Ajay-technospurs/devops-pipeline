import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./header";

describe("Header Component", () => {
  it("renders the title correctly", () => {
    render(<Header title="Test Title" />);
    expect(screen.getByText(/test title/i)).toBeInTheDocument();
  });

  it("does not render action button if actionType is not provided", () => {
    render(<Header title="No Action" />);
    expect(screen.queryByTestId("header-action-button")).not.toBeInTheDocument();
  });

  it("renders the correct icon for actionType 'add'", () => {
    render(<Header title="Add Action" actionType="add" />);
    const actionButton = screen.getByTestId("header-action-button");
    expect(actionButton).toBeInTheDocument();
    expect(screen.getByAltText("add_filled_icon")).toBeInTheDocument();
    expect(screen.getAllByText(/add/i)).toHaveLength(2);
  });

  it("renders the correct icon for actionType 'close'", () => {
    render(<Header title="Close Action" actionType="close" />);
    const actionButton = screen.getByTestId("header-action-button");
    expect(actionButton).toBeInTheDocument();
    expect(actionButton.querySelector("svg")).toBeTruthy();
  });

  it("renders the correct icon for actionType 'info'", () => {
    render(<Header title="Info Action" actionType="info" />);
    expect(screen.queryByTestId("header-action-button")).not.toBeInTheDocument();
  });

  it("triggers the onActionClick callback when action button is clicked", () => {
    const mockOnClick = jest.fn();
    render(<Header title="Clickable" actionType="close" onActionClick={mockOnClick} />);

    const actionButton = screen.getByTestId("header-action-button");
    fireEvent.click(actionButton);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
