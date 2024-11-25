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
import { ProjectType } from "@/types";
import ConfirmationDialog from "@/components/common/dialog/confirmation";

export default function ProjectSection({
  projects,
}: {
  projects: ProjectType[];
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
      <ProjectFormDialog open={open} setOpen={setOpen} />
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
  options: ProjectType[];
  onSelect: (value: string) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ options }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [edit, setEdit] = useState<ProjectType | null>();
  const [filteredOptions, setFilteredOptions] =
    useState<ProjectType[]>(options);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredOptions(options);
      return;
    }

    const filterOptions = (opts: ProjectType[]): ProjectType[] => {
      return opts
        .map((opt) => ({
          ...opt,
          children: opt.children ? filterOptions(opt.children) : [],
        }))
        .filter(
          (opt) =>
            opt.label.toLowerCase().includes(term.toLowerCase()) ||
            (opt.children && opt.children.length > 0)
        );
    };

    const filtered = filterOptions(options);
    setFilteredOptions(filtered);
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      window.location.reload();
    }
  };

  const handleEdit = (option: ProjectType) => {
    if (option) {
      setEdit(option);
    }
  };
  const renderOptions = (opts: ProjectType[], childIndex: number = 1) =>
    opts.map((opt) => (
      <AccordionItem key={opt.value} value={opt.value}>
        <ProjectContextMenu
          isParentLevel={childIndex === 1}
          isShared={opt.shared}
          isMain={opt.main}
          onEdit={() => handleEdit(opt)}
          onMarkAsShared={() => console.log("mark as shared", opt.value)}
          onMarkAsMain={() => console.log("mark as main", opt.value)}
          onDelete={() => handleDelete(opt.id ?? "")}
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
                  opt.main == true && opt.shared == true
                    ? "folder_main_shared"
                    : opt.main
                    ? "folder_shared"
                    : opt.shared
                    ? "folder_shared"
                    : "folder"
                }.svg`}
                alt={"folder icon"}
                width={20}
                height={20}
              />
              {opt.label}
              {opt.shared && (
                <span className="ml-2 text-sm text-gray-500">(Shared)</span>
              )}
              {opt.main && (
                <span className="ml-2 text-sm text-primary">(Main)</span>
              )}
            </span>
          </AccordionTrigger>
        </ProjectContextMenu>
        {opt.children && opt.children.length > 0 && (
          <AccordionContent>
            <div className="">
              {renderOptions(opt.children, childIndex + 1)}
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
      <ProjectFormDialog
        open={edit != null}
        setOpen={(open) => {
          if (open) {
          } else {
            setEdit(null);
          }
        }}
        project={edit}
      />
    </div>
  );
};

// export default SearchableDropdown;
