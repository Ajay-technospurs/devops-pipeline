"use client";
import Header from "@/components/common/header/header";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Image from "next/image";
import NewProjectDialog from "./create/create_dialog";
import { Search } from "lucide-react";
import { ProjectType } from "@/types";

export default function ProjectSection({projects}:{projects:ProjectType[]}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="h-[55%] min-h-0 flex flex-col">
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
      <NewProjectDialog open={open} setOpen={setOpen} />
    </div>
  );
}



interface SearchableDropdownProps {
  options: ProjectType[];
  onSelect: (value: string) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<ProjectType[]>(options);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      // Reset to original options if the search term is empty
      setFilteredOptions(options);
      return;
    }

    const filterOptions = (opts: ProjectType[]): ProjectType[] => {
      return opts
        .map((opt) => ({
          ...opt,
          children: opt.children ? filterOptions(opt.children) : [], // Recursively filter children
        }))
        .filter(
          (opt) =>
            opt.label.toLowerCase().includes(term.toLowerCase()) || // Match on label
            (opt.children && opt.children.length > 0) // Include parent if children match
        );
    };

    const filtered = filterOptions(options);
    setFilteredOptions(filtered);
  };

  const renderOptions = (opts: ProjectType[], childIndex: number = 1) =>
    opts.map((opt) => (
      <AccordionItem key={opt.value} value={opt.value}>
        <AccordionTrigger
          hasChildren={opt.children && opt.children.length > 0}
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
      {/* Changed from w-full flex-1 to h-full */}
      {/* Search Bar */}
      <div className="p-2 flex-shrink-0">
        <Input
          placeholder="Search and select..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          startIcon={<Search size={16} />}
        />
      </div>
      {/* Nested List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {/* Added wrapper with min-h-0 and overflow-hidden */}
        <Accordion type="multiple" className="h-full overflow-y-auto">
          {renderOptions(filteredOptions)}
        </Accordion>
      </div>
    </div>
  );
};

