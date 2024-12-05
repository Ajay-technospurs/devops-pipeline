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
import { PaletteType } from "@/types";
import { InfoTooltip } from "@/components/common/info_tooltip/info_tooltip";
interface NestedPaletteOption {
  label: string;
  value: string;
  icon: string; // Icon for the item
  children?: NestedPaletteOption[]; // Supports nesting
}
interface PaletteDropdownProps {
  options: NestedPaletteOption[];
  onSelect: (value: string) => void;
}

const PaletteDropdown: React.FC<PaletteDropdownProps> = ({
  options,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<NestedPaletteOption[]>(options);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredOptions(options);
      return;
    }

    const filterOptions = (
      opts: NestedPaletteOption[]
    ): NestedPaletteOption[] => {
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
  
  const renderOptions = (opts: NestedPaletteOption[], level: number = 1) =>
    opts.map((opt) => (
      <AccordionItem key={opt.value} value={opt.value}>
        <AccordionTrigger
          hasChildren={opt && opt.children && opt.children.length>0}
          className={`flex items-center justify-between ${
            level > 1 ? "text-muted-foreground" : ""
          }`}
        >
          <span
            style={{
              paddingLeft: `calc(12px * ${level})`,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              style={{ marginRight: "4px" }}
              src={`/assets/palette_title.svg`}
              alt={`${opt.label} icon`}
              width={20}
              height={20}
            />
            {opt.label}
          </span>
        </AccordionTrigger>
        {opt.children && opt.children.length > 0 && (
          <AccordionContent>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,102px))] ">
              {opt.children?.map((ele, index) => {
                return (
                  PaletteCard( ele)
                );
              })}
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    ));

  return (
    <div className="min-h-0 flex flex-col flex-1">
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

function PaletteCard( ele: NestedPaletteOption): React.JSX.Element {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    console.log(ele,"ele");
    
    const dragData = JSON.stringify(ele); // Convert item to JSON
    event.dataTransfer.setData("application/reactflow", dragData);
    event.dataTransfer.effectAllowed = "move";
  };
  return <div key={ele.label} draggable // Make the item draggable
    onDragStart={onDragStart} className="flex flex-col border items-center justify-center h-[100px] min-w-[100px] p-4 relative">
    <Image
      style={{ marginRight: "4px" }}
      src={`/assets/palette_child.svg`}
      alt={`${ele.label} icon`}
      width={40}
      height={40} />
    <div className="text-xs text-center">
      {ele.label}
    </div>
    <div className="absolute top-1 right-2">
    <InfoTooltip content={ele.label} /> 
    </div>
  </div>;
}

export default function PaletteSection({palettes}:{palettes:PaletteType[]}) {
  const [open, setOpen] = useState<boolean>(false);
  const handleSelect = (value: string) => {
    console.log("Selected Palette Item:", value);
  };
  return (
    <div className="h-full min-h-0 flex flex-col">
      <Header
        title="Palettes"
        actionType="info"
        // onActionClick={() => setOpen(true)}
      />
      <PaletteDropdown options={palettes} onSelect={handleSelect} />
      <NewProjectDialog open={open} setOpen={setOpen} />
    </div>
  );
}

