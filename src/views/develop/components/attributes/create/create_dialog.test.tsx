import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateAttributesDialog from "./create_dialog";

describe("CreateAttributesDialog", () => {
  const mockSetOpen = jest.fn();

  beforeEach(() => {
    mockSetOpen.mockClear();
  });

  it("renders dialog content when open is true", () => {
    render(<CreateAttributesDialog open={true} setOpen={mockSetOpen} />);

    expect(screen.getByText("New Attribute")).toBeInTheDocument();
    expect(screen.getByLabelText(/attribute name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/file path \/ url/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("does not render dialog content when open is false", () => {
    render(<CreateAttributesDialog open={false} setOpen={mockSetOpen} />);

    expect(screen.queryByText("New Attribute")).not.toBeInTheDocument();
  });

  it("calls setOpen(false) when the cancel button is clicked", async () => {
    render(<CreateAttributesDialog open={true} setOpen={mockSetOpen} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it("updates input fields correctly", async () => {
    render(<CreateAttributesDialog open={true} setOpen={mockSetOpen} />);

    const nameInput = screen.getByLabelText(/attribute name/i);
    const filePathInput = screen.getByLabelText(/file path \/ url/i);

    await userEvent.type(nameInput, "Test Attribute");
    await userEvent.type(filePathInput, "/test/path");

    expect(nameInput).toHaveValue("Test Attribute");
    expect(filePathInput).toHaveValue("/test/path");
  });

  it("calls setOpen(false) and resets form on successful submit", async () => {
    render(<CreateAttributesDialog open={true} setOpen={mockSetOpen} />);

    const nameInput = screen.getByLabelText(/attribute name/i);
    const filePathInput = screen.getByLabelText(/file path \/ url/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(nameInput, "Test Attribute");
    await userEvent.type(filePathInput, "/test/path");
    await userEvent.click(addButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(nameInput).toHaveValue("");
    expect(filePathInput).toHaveValue("");
  });

  it("does not submit when required fields are empty", async () => {
    render(<CreateAttributesDialog open={true} setOpen={mockSetOpen} />);

    const addButton = screen.getByTestId("create-attribute-button");
    await userEvent.click(addButton);

    // Verify that setOpen was not called
    await waitFor(()=>{
        expect(mockSetOpen).not.toHaveBeenCalled();
    },{timeout:3000})
  });
});
