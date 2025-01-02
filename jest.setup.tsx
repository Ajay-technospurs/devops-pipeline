import '@testing-library/jest-dom';
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))
jest.mock("next/navigation", () => {
    return {
      __esModule: true,
      usePathname: () => ({
        pathname: "",
      }),
      useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back:jest.fn()
      }),
      useSearchParams: () => ({
        get: () => {},
      }),
    };
  });
  jest.mock("@octokit/rest", () => {
    return {
      Octokit: jest.fn().mockImplementation(() => {
        return {
          repos: {
            listForAuthenticatedUser: jest.fn().mockResolvedValue({ data: [] }),
          },
          issues: {
            create: jest.fn().mockResolvedValue({}),
          },
        };
      }),
    };
  });
  
  jest.mock("next/image", () => ({
    __esModule: true,
    default: ({ src, alt }: { src: string; alt: string }) => (
      <img src={src} alt={alt} />
    ),
  }));
  // Ensure window.fetch is available
global.fetch = jest.fn();