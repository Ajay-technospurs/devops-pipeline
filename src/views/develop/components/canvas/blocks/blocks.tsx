// Blocks.tsx
import React from 'react';
import Image from "next/image";
import { InfoTooltip } from '@/components/common/info_tooltip/info_tooltip';
import { BlockOption, blockCategories } from './types';
import { useFlow } from '@/provider/canvas_provider';

interface BlockCardProps {
  block: BlockOption;
}

const BlockCardComp: React.FC<BlockCardProps> = ({ block }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // event.preventDefault()
    setType("blocks");
    const dragData = JSON.stringify({
      type: block.type,
      variant: block.variant,
      label: block.label,
      value: block.value
    });
    event.dataTransfer.setData("application/reactflow", dragData);
    event.dataTransfer.effectAllowed = "move";
  };
  const { setType} = useFlow();
  return (
    <div 
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={event=>event.preventDefault()}
      className="group cursor-move flex flex-col border items-center justify-center h-[100px] min-w-[100px] p-4 relative hover:border-primary/50 transition-colors duration-200"
    >
      <div className=""> 
        {block.customIcon ? (
          <div className="p-2 rounded-md text-primary">
            {block.customIcon}
          </div>
        ) : (
          <div className="relative w-10 h-10"> 
            <Image
              src={block.icon || '/assets/palette_child.svg'}
              alt={`${block.label} icon`}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>
      <div className="pointer-events-none text-xs text-center mt-2">
        {block.label}
      </div>
      <div className="absolute top-1 right-2">
        <InfoTooltip content={block.description || block.label} />
      </div>
    </div>
  );
};
const BlockCard = React.memo(BlockCardComp);
interface CategorySectionProps {
  category: typeof blockCategories[0];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium">{category.label}</h3>
        {category.description && (
          <InfoTooltip content={category.description} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {category.blocks.map((block) => (
          <BlockCard key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
};

const Blocks: React.FC = () => {
  return (
    <div className="p-4 space-y-6 flex flex-col h-full min-h-0 overflow-y-auto">
      {blockCategories.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
};

export default Blocks;