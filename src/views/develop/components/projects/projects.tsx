"use client"
import Header from "@/components/common/header/header";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<NestedOption[]>(options);

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
  

  const renderOptions = (opts: NestedOption[]) =>
    opts.map((opt) => (
      <AccordionItem  key={opt.value} value={opt.value}>
        <AccordionTrigger className="flex items-center justify-between">
          <span>
            {opt.label}
            {opt.shared && <span className="ml-2 text-sm text-gray-500">(Shared)</span>}
            {opt.main && <span className="ml-2 text-sm text-primary">(Main)</span>}
          </span>
        </AccordionTrigger>
        {opt.children && opt.children.length > 0 && (
          <AccordionContent>
            <div className="ml-4">{renderOptions(opt.children)}</div>
          </AccordionContent>
        )}
      </AccordionItem>
    ));

  return (
    <div className="relative w-full">
      {/* Search Bar */}
      <Input
        placeholder="Search and select..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-2"
      />
      {/* Nested List */}
      <Accordion type="multiple" className="border rounded-md">
        {renderOptions(filteredOptions)}
      </Accordion>
    </div>
  );
};




export default function ProjectSection() {
  return (
    <div>
      <Header
        title="Projects"
        actionType="add"
        onActionClick={() => console.log("Add clicked")}
      />
      <SearchableDropdown options={data} onSelect={()=>console.log("select")} />
    </div>
  );
}
const data = [
  {
    "label": "Random Name 01",
    "value": "random_name_01",
    "shared": true,
    "children": []
  },
  {
    "label": "Random Name 02",
    "value": "random_name_02",
    "main": true,
    "shared": true,
    "children": [
      {
        "label": "Random Name 01",
        "value": "random_name_01_sub",
        "children": []
      },
      {
        "label": "Random Name 02",
        "value": "random_name_02_sub",
        "children": []
      }
    ]
  },
  {
    "label": "Random Name 03",
    "value": "random_name_03",
    "children": []
  },
  {
    "label": "Random Name 04",
    "value": "random_name_04",
    "children": []
  },
  {
    "label": "Random Name 05",
    "value": "random_name_05",
    "children": []
  },
  {
    "label": "Random Name 06",
    "value": "random_name_06",
    "children": []
  }
]
