import { z } from 'zod';

// Enum for repository providers
export enum RepositoryProvider {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  BITBUCKET = 'bitbucket',
  AZURE_DEVOPS = 'azure_devops'
}

// Base validation schema for all repository providers
export const BaseRepositorySchema = z.object({
  id: z.string().optional(), // Database ID
  provider: z.nativeEnum(RepositoryProvider),
  name: z.string().min(2, { message: "Repository name must be at least 2 characters" }),
  fullName: z.string(), // owner/repo format
  url: z.string().url(),
  isPrivate: z.boolean().default(false),
  accessToken: z.string().optional(),
  description: z.string().optional(),
  lastSynced: z.date().optional()
});

// Provider-specific extended schemas can be added here
export const GitHubRepositorySchema = BaseRepositorySchema.extend({
  provider: z.literal(RepositoryProvider.GITHUB),
  // GitHub-specific fields
  stars: z.number().optional(),
  forks: z.number().optional()
});

export const GitLabRepositorySchema = BaseRepositorySchema.extend({
  provider: z.literal(RepositoryProvider.GITLAB),
  // GitLab-specific fields
  namespaceId: z.number().optional(),
  visibility: z.enum(['private', 'internal', 'public']).optional()
});

// Typescript types derived from schemas
export type BaseRepository = z.infer<typeof BaseRepositorySchema>;
export type GitHubRepository = z.infer<typeof GitHubRepositorySchema>;
export type GitLabRepository = z.infer<typeof GitLabRepositorySchema>;

// Union type for all repository types
export type AnyRepository = BaseRepository | GitHubRepository | GitLabRepository;

// Interface for repository service
export interface RepositoryService {
  fetchRepositories(accessToken: string): Promise<BaseRepository[]>;
  validateRepository(repository: BaseRepository): Promise<boolean>;
  syncRepositoryDetails(repository: BaseRepository): Promise<BaseRepository>;
}