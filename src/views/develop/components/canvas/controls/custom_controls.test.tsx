import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomControls from "./custom_controls";
import { useReactFlow } from "@xyflow/react";
import { usePanelRefs } from "../../../../../provider/layout_provider";
import { useFlow } from "../../../../../provider/canvas_provider";
import { GitHubProjectType } from "@/mongodb/model/github";

jest.mock("@xyflow/react", () => ({
  useReactFlow: jest.fn(),
}));

jest.mock("../../../../../provider/layout_provider", () => ({
  usePanelRefs: jest.fn(),
}));

jest.mock("../../../../../provider/canvas_provider", () => ({
  useFlow: jest.fn(),
}));

describe("CustomControls", () => {
  const mockZoomIn = jest.fn();
  const mockZoomOut = jest.fn();
  const mockFitView = jest.fn();
  const mockTogglePanel = jest.fn();
  const mockExpandPanel = jest.fn();
  const mockCollapsePanel = jest.fn();

  const mockDispatch = jest.fn();
  const mockState = {
    selectedNode: {
      data: { label: "Test Node" },
    },
    nodes: [],
    edges: [],
  };

  const mockProject = {
    owner: "testOwner",
    repo: "testRepo",
    _id: "12345",
    name: "testProject",
    isPrivate: true,
    token: "testToken",
  } as GitHubProjectType;

  beforeEach(() => {
    (useReactFlow as jest.Mock).mockReturnValue({
      zoomIn: mockZoomIn,
      zoomOut: mockZoomOut,
      fitView: mockFitView,
    });

    (usePanelRefs as jest.Mock).mockReturnValue({
      getPanelRef: jest.fn(() => ({ current: { isCollapsed: jest.fn(() => true) } })),
      togglePanel: mockTogglePanel,
      expandPanel: mockExpandPanel,
      collapsePanel: mockCollapsePanel,
    });

    (useFlow as jest.Mock).mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all controls", () => {
    render(<CustomControls project={mockProject} />);

    expect(screen.getByTestId("toggle-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("search")).toBeInTheDocument();
    expect(screen.getByTestId("fit-view")).toBeInTheDocument();
    expect(screen.getByTestId("maximize")).toBeInTheDocument();
    expect(screen.getByTestId("zoom-out")).toBeInTheDocument();
    expect(screen.getByTestId("zoom-in")).toBeInTheDocument();
  });

  it("calls togglePanel on sidebar button click", async () => {
    render(<CustomControls project={mockProject} />);

    const sidebarButton = screen.getByTestId("toggle-sidebar");
    await userEvent.click(sidebarButton);

    expect(mockTogglePanel).toHaveBeenCalledWith("sidebar");
  });

  it("calls zoomIn and zoomOut on respective button clicks", async () => {
    render(<CustomControls project={mockProject} />);

    const zoomInButton = screen.getByTestId("zoom-in");
    const zoomOutButton = screen.getByTestId("zoom-out");

    await userEvent.click(zoomInButton);
    expect(mockZoomIn).toHaveBeenCalled();

    await userEvent.click(zoomOutButton);
    expect(mockZoomOut).toHaveBeenCalled();
  });

  it("calls fitView on fullscreen button click", async () => {
    render(<CustomControls project={mockProject} />);

    const fitViewButton = screen.getByTestId("fit-view");
    await userEvent.click(fitViewButton);

    expect(mockFitView).toHaveBeenCalledWith({ duration: 200 });
  });

  // it("handles panel expansion and collapsing correctly on maximize button click", async () => {
  //   render(<CustomControls project={mockProject} />);

  //   const maximizeButton = screen.getByTestId("maximize");
  //   await userEvent.click(maximizeButton);
  //   wa
  //   expect(mockCollapsePanel).toHaveBeenCalledWith("sidebar");
  //   expect(mockCollapsePanel).toHaveBeenCalledWith("config-panel");
  // });
});
