import { useState } from 'react';
import axios from 'axios';
import { BaseRepository, RepositoryProvider } from '@/types/repository';

export function useRepositorySync() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncRepository = async (repositoryData: BaseRepository) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate repository before sync
      const validationResponse = await validateRepository(repositoryData);
      
      if (!validationResponse.isValid) {
        throw new Error(validationResponse.error || 'Repository validation failed');
      }
      console.log(validationResponse,"validationResponse");
      
      // Sync repository to database
      const response = await axios.post('/api/projects', {
        ...validationResponse.details,
        lastSynced: new Date(),
        token:repositoryData.accessToken
      });

      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRepository = async (repositoryData: BaseRepository) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate repository before update
      const validationResponse = await validateRepository(repositoryData);

      if (!validationResponse.isValid) {
        throw new Error(validationResponse.error || 'Repository validation failed');
      }

      // Update repository in database
      const response = await axios.put(`/api/repositories/${repositoryData.id}`, {
        ...repositoryData,
        lastUpdated: new Date()
      });

      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const validateRepository = async (repository: BaseRepository) => {
    try {
      // Provider-specific validation logic
      switch (repository.provider) {
        case RepositoryProvider.GITHUB:
          return await validateGitHubRepository(repository);
        case RepositoryProvider.GITLAB:
          return await validateGitLabRepository(repository);
        default:
          return { 
            isValid: false, 
            error: 'Unsupported repository provider' 
          };
      }
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Validation failed' 
      };
    }
  };

  const validateGitHubRepository = async (repository: BaseRepository) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${repository.fullName}`, {
        headers: repository.accessToken 
          ? { Authorization: `token ${repository.accessToken}` } 
          : {}
      });

      return {
        isValid: true,
        details: response.data
      };
    } catch (error) {
      return { 
        isValid: false, 
        error: 'Failed to validate GitHub repository' 
      };
    }
  };

  const validateGitLabRepository = async (repository: BaseRepository) => {
    try {
      const response = await axios.get(`https://gitlab.com/api/v4/projects/${repository.fullName}`, {
        headers: repository.accessToken 
          ? { Authorization: `Bearer ${repository.accessToken}` } 
          : {}
      });

      return {
        isValid: true,
        details: response.data
      };
    } catch (error) {
      return { 
        isValid: false, 
        error: 'Failed to validate GitLab repository' 
      };
    }
  };

  return { 
    syncRepository, 
    updateRepository,
    validateRepository, 
    isLoading, 
    error 
  };
}
