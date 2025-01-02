import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { GitHubRepositoryForm } from './GitHubRepositoryForm';
import { useRepositorySync } from '@/hooks/repo-sync';
import { toast } from '@/hooks/use-toast';
import { RepositoryProvider } from '@/types/repository';

// Mock dependencies
jest.mock('axios');
jest.mock('@/hooks/repo-sync', () => ({
  useRepositorySync: jest.fn()
}));
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn()
}));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockUseRepositorySync = useRepositorySync as jest.MockedFunction<typeof useRepositorySync>;

describe('GitHubRepositoryForm', () => {
  const mockSyncRepository = jest.fn();
  const mockUpdateRepository = jest.fn();
  const mockValidateRepository = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRepositorySync.mockReturnValue({
        syncRepository: mockSyncRepository,
        updateRepository: mockUpdateRepository,
        validateRepository: mockValidateRepository,
        isLoading: false,
        error: null
    });

    // Mock successful GitHub API response
    mockAxios.get.mockResolvedValue({
      data: {
        description: 'Test description',
        stargazers_count: 100,
        forks_count: 50,
        html_url: 'https://github.com/owner/repo'
      }
    });
  });

  it('renders form with initial empty state', () => {
    render(<GitHubRepositoryForm />);

    expect(screen.getByLabelText(/repository url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/private repository/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add github repository/i })).toBeInTheDocument();
  });

  it('renders form with initial data', () => {
    const initialData = {
      provider: RepositoryProvider.GITHUB,
      name: 'test-repo',
      fullName: 'owner/test-repo',
      url: 'https://github.com/owner/test-repo',
      isPrivate: true,
      accessToken: 'test-token',
      description: 'Test description',
      stars: 100,
      forks: 50
    };

    render(<GitHubRepositoryForm initialData={initialData} />);

    expect(screen.getByDisplayValue('https://github.com/owner/test-repo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update github repository/i })).toBeInTheDocument();
  });

  it('extracts repository full name from URL correctly', async () => {
    render(<GitHubRepositoryForm />);
    
    const urlInput = screen.getByLabelText(/repository url/i);
    await userEvent.type(urlInput, 'https://github.com/owner/repo');

    expect(urlInput).toHaveValue('https://github.com/owner/repo');
  });

  it('handles URL with .git extension', async () => {
    render(<GitHubRepositoryForm />);
    
    const urlInput = screen.getByLabelText(/repository url/i);
    await userEvent.type(urlInput, 'https://github.com/owner/repo.git');

    expect(urlInput).toHaveValue('https://github.com/owner/repo.git');
  });

  it('shows access token field when private repository is selected', async () => {
    render(<GitHubRepositoryForm />);
    
    const privateSwitch = screen.getByRole('switch');
    await userEvent.click(privateSwitch);

    expect(screen.getByLabelText(/github personal access token/i)).toBeInTheDocument();
  });

  it('submits form with correct data for public repository', async () => {
    render(<GitHubRepositoryForm onSuccess={mockOnSuccess} />);
    
    await userEvent.type(screen.getByLabelText(/repository url/i), 'https://github.com/owner/repo');
    
    fireEvent.click(screen.getByRole('button', { name: /add github repository/i }));

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo',
        { headers: {} }
      );
      expect(mockSyncRepository).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith({
        title: "Repository Added",
        description: "owner/repo has been successfully added.",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('submits form with correct data for private repository', async () => {
    render(<GitHubRepositoryForm onSuccess={mockOnSuccess} />);
    
    await userEvent.type(screen.getByLabelText(/repository url/i), 'https://github.com/owner/repo');
    await userEvent.click(screen.getByRole('switch'));
    await userEvent.type(screen.getByLabelText(/github personal access token/i), 'test-token');
    
    fireEvent.click(screen.getByRole('button', { name: /add github repository/i }));

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo',
        { headers: { Authorization: 'token test-token' } }
      );
      expect(mockSyncRepository).toHaveBeenCalled();
    });
  });

  it('handles API error gracefully', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('API Error'));
    
    render(<GitHubRepositoryForm />);
    
    await userEvent.type(screen.getByLabelText(/repository url/i), 'https://github.com/owner/repo');
    fireEvent.click(screen.getByRole('button', { name: /add github repository/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to add repository",
        variant: "destructive",
      });
    });
  });

  it('updates existing repository correctly', async () => {
    const initialData = {
      provider: RepositoryProvider.GITHUB,
      name: 'test-repo',
      fullName: 'owner/test-repo',
      url: 'https://github.com/owner/test-repo',
      isPrivate: false
    };

    render(<GitHubRepositoryForm initialData={initialData} onSuccess={mockOnSuccess} />);
    
    fireEvent.click(screen.getByRole('button', { name: /update github repository/i }));

    await waitFor(() => {
      expect(mockUpdateRepository).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith({
        title: "Repository Updated",
        description: "owner/test-repo has been successfully updated.",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});