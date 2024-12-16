"use client";
import Header from "@/components/common/header/header";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import ProjectFormDialog from "./create/create_dialog";
import { Search } from "lucide-react";
import ConfirmationDialog from "@/components/common/dialog/confirmation";
import { GitHubProjectType } from "@/mongodb/model/github";
import { ProjectCreateEdit } from "./create/tabs_form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RepositoryBrowserDialog } from "./files_viewer/file_viewer";
import { RepositoryProvider } from "@/types/repository";

export default function ProjectSection({
  projects,
}: {
  projects: GitHubProjectType[];
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="min-h-0 flex flex-col">
      <Header
        title="Projects"
        actionType="add"
        onActionClick={() => setOpen(true)}
      />
      <div className="flex-1 min-h-0">
        <SearchableDropdown
          options={projects}
          onSelect={() => console.log("select")}
        />
      </div>
      <ProjectCreateEdit open={open} setOpen={setOpen} />
    </div>
  );
}

interface ContextMenuProps {
  children: React.ReactNode;
  isParentLevel: boolean;
  isShared?: boolean;
  isMain?: boolean;
  onMarkAsShared?: () => void;
  onMarkAsMain?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  OnViewFiles?: () => void;
}

const ProjectContextMenu: React.FC<ContextMenuProps> = ({
  children,
  isParentLevel,
  isShared,
  isMain,
  onMarkAsShared,
  onMarkAsMain,
  onDelete,
  onEdit,
  OnViewFiles,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isParentLevel) {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setShowMenu(true);
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    setShowDeleteConfirmation(true);
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>
      <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
        <DropdownMenuContent
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
          }}
          className="w-48"
          onClick={() => setShowMenu(false)}
        >
          <DropdownMenuItem onSelect={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onMarkAsShared} disabled={isShared}>
            Mark as shared
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onMarkAsMain} disabled={isMain}>
            Mark as main
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={OnViewFiles}>View Files</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleDelete}
            className="text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        onConfirm={() => {
          onDelete?.();
          setShowDeleteConfirmation(false);
        }}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
};

interface SearchableDropdownProps {
  options: GitHubProjectType[];
  onSelect: (value: string) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ options }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewFiles, setViewFiles] = useState<GitHubProjectType | null>(null);
  const [edit, setEdit] = useState<GitHubProjectType | null>();
  const [filteredOptions, setFilteredOptions] =
    useState<GitHubProjectType[]>(options);
  const router = useRouter();
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredOptions(options);
      return;
    }

    const filterOptions = (opts: GitHubProjectType[]): GitHubProjectType[] => {
      return opts
        .map((opt) => ({
          ...opt,
          children: opt.children ? filterOptions(opt.children) : [],
        }))
        .filter(
          (opt) =>
            opt.name.toLowerCase().includes(term.toLowerCase()) ||
            (opt.children && opt.children.length > 0)
        ) as GitHubProjectType[];
    };

    const filtered = filterOptions(options);
    setFilteredOptions(filtered);
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/projects?id=${id}`);

      if (response) {
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setTimeout(() => {
        router.refresh();
      }, 1000);
    }
  };

  const handleEdit = (option: GitHubProjectType) => {
    if (option) {
      setEdit(option);
    }
  };
  const renderOptions = (opts: GitHubProjectType[], childIndex: number = 1) =>
    opts?.map((opt) => (
      <AccordionItem key={opt.id} value={opt.name}>
        <ProjectContextMenu
          isParentLevel={childIndex === 1}
          isShared={opt.isShared}
          isMain={!opt.isShared}
          onEdit={() => handleEdit(opt)}
          onMarkAsShared={() => console.log("mark as shared", opt.name)}
          onMarkAsMain={() => console.log("mark as main", opt.name)}
          onDelete={() => handleDelete(opt._id?.toString() ?? "")}
          OnViewFiles={() => {
            setViewFiles(opt);
            console.log(opt,"what");
            
          }}
          
        >
          <AccordionTrigger
            hasChildren={opt && opt.children && opt.children.length > 0}
            className={
              "flex items-center justify-between" +
              " " +
              (childIndex > 1 ? "text-muted-foreground" : "")
            }
          >
            <span
              style={{
                paddingLeft: `calc(12px * ${childIndex})`,
                display: "flex",
              }}
              className="whitespace-nowrap overflow-clip"
            >
              <Image
                style={{ marginRight: "4px" }}
                src={`/assets/${
                  opt.isShared == true ? "folder_shared" : "folder_main_shared"
                }.svg`}
                alt={"folder icon"}
                width={20}
                height={20}
              />
              {opt.name}
              {opt.isShared ? (
                <span className="ml-2 text-sm text-gray-500">(Shared)</span>
              ) : (
                <span className="ml-2 text-sm text-primary">(Main)</span>
              )}
            </span>
          </AccordionTrigger>
        </ProjectContextMenu>
        {opt.children && opt.children.length > 0 && (
          <AccordionContent>
            <div className="">
              {opt&&renderOptions(opt.children, childIndex + 1)}
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    ));

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 flex-shrink-0">
        <Input
          placeholder="Search and select..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          startIcon={<Search size={16} />}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <Accordion
          type="multiple"
          className="h-full overflow-y-auto overflow-x-hidden"
        >
          {renderOptions(filteredOptions)}
        </Accordion>
      </div>
        <RepositoryBrowserDialog
          isOpen={viewFiles!=null}
          onOpenChange={()=>setViewFiles(null)}
          repository={{
            provider: RepositoryProvider.GITHUB,
            fullName: (viewFiles?.owner??"")+"/"+(viewFiles?.name ??""),
            accessToken: viewFiles?.token,
          }}
        />
      {/* <ProjectFormDialog
        open={edit != null}
        setOpen={(open) => {
          if (open) {
          } else {
            setEdit(null);
          }
        }}
        project={edit}
      /> */}
    </div>
  );
};

// export default SearchableDropdown;
