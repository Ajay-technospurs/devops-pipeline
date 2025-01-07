import React from 'react';
import { 
  SeparatorHorizontalIcon, 
  Combine, 
  SplitSquareHorizontal,
  RotateCcw 
} from 'lucide-react';
import { InfoTooltip } from '@/components/common/info_tooltip/info_tooltip';
import Image from "next/image";

interface BlockOption {
  label: string;
  id: string;
  type?: 'branch' | 'converge' | 'simultaneous' | 'loop';
  value: string;
  icon?: string;
}

const blockOptions: BlockOption[] = [
  {
    label: 'Branch',
    id: 'branch-block',
    type: 'branch',
    value: 'branch-block',
    icon: '/assets/palette_child.svg'
  },
  {
    label: 'Converge',
    id: 'converge-block',
    type: 'converge',
    value: 'converge-block',
    icon: '/assets/palette_child.svg'
  },
  {
    label: 'Simultaneous',
    id: 'simultaneous-block',
    type: 'simultaneous',
    value: 'simultaneous-block',
    icon: '/assets/palette_child.svg'
  },
  {
    label: 'Loop',
    id: 'loop-block',
    type: 'loop',
    value: 'loop-block',
    icon: '/assets/palette_child.svg'
  }
];

function BlockCard(block: BlockOption): React.JSX.Element {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    console.log(block, "block");
    const dragData = JSON.stringify(block);
    event.dataTransfer.setData("application/reactflow", dragData);
    event.dataTransfer.effectAllowed = "move";
  };

  const getIconForType = (type: BlockOption['type']) => {
    switch (type) {
      case 'branch':
        return <SeparatorHorizontalIcon className="h-6 w-6" />;
      case 'converge':
        return <Combine className="h-6 w-6" />;
      case 'simultaneous':
        return <SplitSquareHorizontal className="h-6 w-6" />;
      case 'loop':
        return <RotateCcw className="h-6 w-6" />;
    }
  };

  return (
    <div 
      // key={block.label}
      draggable
      onDragStart={onDragStart}
      className="cursor-move flex flex-col border items-center justify-center h-[100px] min-w-[100px] p-4 relative"
    >
      {/* <div className="p-2 rounded-md">
        {getIconForType(block.type)}
      </div> */}
      <Image
            style={{ marginRight: "4px" }}
            src={`/assets/palette_child.svg`}
            alt={`${block.label} icon`}
            width={40}
            height={40} />
      <div className="text-xs text-center">
        {block.label}
      </div>
      <div className="absolute top-1 right-2">
        <InfoTooltip content={block.label} />
      </div>
    </div>
  );
}

const Blocks: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {blockOptions.map((block) => (
        <div className="" key={block.id}>
          {BlockCard(block)}
        </div>
      ))}
    </div>
  );
};

export default Blocks;