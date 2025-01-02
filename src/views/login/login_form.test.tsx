import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./login_form";
import { toast } from "../../hooks/use-toast";
import { AppRouterContextProviderMock } from "@/test/tools";

jest.mock('../../hooks/use-toast', () => {
    const toast = jest.fn();
    return {
      toast,
      useToast: () => ({
        toast,
        dismiss: jest.fn(),
      }),
    };
  });

describe("LoginForm", () => {
  const VALID_USERNAME = "ajaydharmarajck@gmail.com";
  const VALID_PASSWORD = "NotSimple9999!";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form", () => {
    const push = jest.fn();
     render(<AppRouterContextProviderMock router={{ push }}><LoginForm /></AppRouterContextProviderMock>);

    expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays validation errors for empty fields", async () => {
    const push = jest.fn();
     render(<AppRouterContextProviderMock router={{ push }}><LoginForm /></AppRouterContextProviderMock>);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('displays error for invalid credentials', async () => {
    const push = jest.fn()
    render(<AppRouterContextProviderMock router={{ push }}><LoginForm /></AppRouterContextProviderMock>);
    
    await userEvent.type(screen.getByLabelText(/user name/i), 'invalid_user');
    await userEvent.type(screen.getByLabelText(/password/i), 'invalid_pass');
    await userEvent.click(screen.getByTestId('login-action-button'));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Login Failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
    },{timeout:4500});
  });

  it('logs in successfully with valid credentials', async () => {
    const push = jest.fn()
    render(<AppRouterContextProviderMock router={{ push }}><LoginForm /></AppRouterContextProviderMock>);
    
    await userEvent.type(screen.getByLabelText(/user name/i), VALID_USERNAME);
    await userEvent.type(screen.getByLabelText(/password/i), VALID_PASSWORD);
    await userEvent.click(screen.getByTestId('login-action-button'));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Login Successful',
        description: `Welcome back, ${VALID_USERNAME}!`,
        variant: 'default',
      });
    //   expect(mockRouter.push).toHaveBeenCalledWith('/develop');
    },{timeout:4500});
  });

  it('shows loading state during submission', async () => {
    const push = jest.fn()
    render(<AppRouterContextProviderMock router={{ push }}><LoginForm /></AppRouterContextProviderMock>);
    
    await userEvent.type(screen.getByLabelText(/user name/i), VALID_USERNAME);
    await userEvent.type(screen.getByLabelText(/password/i), VALID_PASSWORD);
    
    const loginButton = screen.getByTestId('login-action-button');
    await userEvent.click(loginButton);

    expect(loginButton).toHaveTextContent(/signing in.../i);
    expect(loginButton).toBeDisabled();

    await waitFor(() => {
      expect(loginButton).toHaveTextContent(/login/i);
      expect(loginButton).not.toBeDisabled();
    },{timeout:3900});
  });
});
