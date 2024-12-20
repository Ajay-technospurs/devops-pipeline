"use client"
import React from "react";
import { useReactFlow } from "@xyflow/react";
import {
  LayoutIcon,
  FullscreenIcon,
  Maximize,
  X,
  Download,
  SearchIcon,
} from "lucide-react";
import { usePanelRefs } from "@/provider/layout_provider";
import { useFlow } from "@/provider/canvas_provider";
import { GitHubFilePush } from "../upload/git/git_push";
import { RepositoryProvider } from "@/types/repository";
import { GitHubProjectType } from "@/mongodb/model/github";

const CustomControls = ({project}:{project:GitHubProjectType}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { getPanelRef, expandPanel, collapsePanel, togglePanel } =
    usePanelRefs();
  const { state, dispatch } = useFlow();
  const handleDownload = () => {
    const jsonData = JSON.stringify(state.nodes, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex gap-x-2 w-full">
      <button
        className="bg-[#27282E] hover:bg-primary/20 text-[#525358] font-bold aspect-square py-1 px-2 w-[36px] rounded"
        onClick={() => {
          togglePanel("sidebar");
        }}
      >
        <LayoutIcon className="w-5 h-5 foreground-dark" />
      </button>
      <div className="flex-1 bg-[#27282E] h-[36px] flex rounded text-primary-foreground text-xs items-center px-2 justify-between">
        <div className="">{state?.selectedNode?.data?.label as string}</div>
        {state?.selectedNode?.data?.label ? (
          <button
            className="bg-[#27282E] hover:bg-primary/20 text-[#525358] font-bold aspect-square py-1 px-2 w-[36px] rounded"
            onClick={() => dispatch({ type: "SELECT_NODE", payload: null })}
          >
            <X className="w-5 h-5 foreground-dark" />
          </button>
        ) : null}
      </div>
      <GitHubFilePush repository={{
        provider: RepositoryProvider.GITHUB,
        owner: project.owner,
        repo:project.repo,
        id:project._id?.toString()??"",
        fullName: (project?.owner??"")+"/"+(project?.name ??""),
        name: project.name,
        isPrivate:project.isPrivate,
        accessToken: project.token??undefined,
      }} data={{nodes:state.nodes,edges:state.edges}} />
      {/* <buttons
        className="bg-[#27282E] hover:bg-primary/20 text-[#525358] font-bold aspect-square py-1 px-2 w-[36px] rounded"
        onClick={() => {
          handleDownload();
        }}
      >
        <Download className="w-5 h-5 foreground-dark" />
      </button> */}
      <button
        className="bg-[#27282E] hover:bg-primary/20 text-[#525358] font-bold aspect-square py-1 px-2 w-[36px] rounded"
        onClick={() => {
          expandPanel("node-search",30)
        }}
      >
        <SearchIcon className="w-5 h-5 foreground-dark" />
      </button>
      <button
        className="bg-[#27282E] hover:bg-primary/20 text-[#525358] font-bold aspect-square py-1 px-2 w-[36px] rounded"
        onClick={() => fitView({duration:200})}
      >
                <FullscreenIcon className="w-5 h-5 foreground-dark" />

      </button>
      <button
        className="bg-[#27282E] hover:bg-primary/20 text-[#525358] font-bold aspect-square py-1 px-2 w-[36px] rounded"
        onClick={() => {
          if (
            getPanelRef("sidebar").current?.isCollapsed() &&
            getPanelRef("config-panel").current?.isCollapsed()
          ) {
            expandPanel("sidebar");
            expandPanel("config-panel");
          } else {
            expandPanel("develop-canvas");
            collapsePanel("sidebar");
            collapsePanel("config-panel");
          }
          setTimeout(() => {
            
            fitView({duration:200})
          }, 100);
        }}
      >
        <Maximize className="w-5 h-5 foreground-dark" />

      </button>
      <button
        className="bg-[#27282E] hover:bg-primary/20 text-xl text-[#525358] font-bold aspect-square py-1 px-2 w-[36px] rounded"
        onClick={() => zoomOut()}
      >
        -
      </button>
      <button
        className="bg-[#27282E] hover:bg-primary/20 text-xl text-[#525358] font-bold aspect-square py-1 px-2 w-[36px] rounded"
        onClick={() => zoomIn()}
      >
        +
      </button>
    </div>
  );
};

export default CustomControls;
