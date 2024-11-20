"use client";
import Header from "@/components/common/header/header";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
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

export default function ProjectSection() {
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
          options={data}
          onSelect={() => console.log("select")}
        />
      </div>
      <NewProjectDialog open={open} setOpen={setOpen} />
    </div>
  );
}

interface NestedOption {
  label: string;
  value: string;
  shared?: boolean;
  main?: boolean;
  children?: NestedOption[];
}

interface SearchableDropdownProps {
  options: NestedOption[];
  onSelect: (value: string) => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<NestedOption[]>(options);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      // Reset to original options if the search term is empty
      setFilteredOptions(options);
      return;
    }

    const filterOptions = (opts: NestedOption[]): NestedOption[] => {
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

  const renderOptions = (opts: NestedOption[], childIndex: number = 1) =>
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
const data = [
  {
    label: "Random Name 01",
    value: "random_name_01",
    shared: true,
    children: [],
  },
  {
    label: "Random Name 02",
    value: "random_name_02",
    main: true,
    shared: true,
    children: [
      {
        label: "Random Name 01",
        value: "random_name_01_sub",
        children: [],
      },
      {
        label: "Random Name 02",
        value: "random_name_02_sub",
        children: [],
      },
      {
        label: "Random Name 03",
        value: "random_name_03_sub",
        children: [],
      },
    ],
  },
  {
    label: "Random Name 03",
    value: "random_name_03",
    children: [],
  },
  {
    label: "Random Name 04",
    value: "random_name_04",
    children: [],
  },
  {
    label: "Random Name 05",
    value: "random_name_05",
    children: [],
  },
  {
    label: "Random Name 06",
    value: "random_name_06",
    children: [],
  },
];
