import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ConfirmationDialog, { ConfirmationDialogProps } from "./confirmation";

describe("ConfirmationDialog Component", () => {
  const onOpenChangeMock = jest.fn();
  const onConfirmMock = jest.fn();

  const defaultProps:ConfirmationDialogProps = {
    open: true,
    onOpenChange: onOpenChangeMock,
    onConfirm: onConfirmMock,
    title: "Confirm Action",
    description: "Are you sure you want to proceed?",
    confirmText: "Yes",
    cancelText: "No",
    variant: "default",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dialog with correct title and description", () => {
    render(<ConfirmationDialog {...defaultProps} />);

    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    render(<ConfirmationDialog {...defaultProps} />);

    const confirmButton = screen.getByText("Yes");
    await userEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange when cancel button is clicked", async () => {
    render(<ConfirmationDialog {...defaultProps} />);

    const cancelButton = screen.getByText("No");
    await userEvent.click(cancelButton);

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it("applies destructive variant class correctly", () => {
    render(<ConfirmationDialog {...defaultProps} variant="destructive" />);

    const confirmButton = screen.getByText("Yes");
    expect(confirmButton).toHaveClass("bg-destructive hover:bg-destructive/90");
  });

  it("does not render when open prop is false", () => {
    render(<ConfirmationDialog {...defaultProps} open={false} />);

    expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Are you sure you want to proceed?")
    ).not.toBeInTheDocument();
  });
});
