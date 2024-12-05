import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Info } from 'lucide-react';
import Image from "next/image"
interface HeaderProps {
  title: string;
  actionType?: 'add' | 'close' | 'info';
  onActionClick?: () => void;
}

const Header = ({ title, actionType, onActionClick }: HeaderProps) => {
  const getActionIcon = () => {
    switch (actionType) {
      case 'add':
        return <><Image src={"/assets/add_filled.svg"} alt={"add_filled_icon"} height={14} width={14} /><span className='pt-[1.5px]'>Add</span> </>;
      case 'close':
        return <X size={18} />;
      case 'info':
        return <Info size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between w-full bg-primary text-white px-[8px] py-[4px]">
      <h1 className="text-sm font-bold">{title}</h1>
      {actionType &&actionType !=="info" && (
        <Button
          variant="ghost"
          size="xs"
          onClick={onActionClick}
          className="text-white hover:bg-primary"
          data-testid="header-action-button"
        
        >
          {getActionIcon()}
        </Button>
      )}
    </div>
  );
};

export default Header;