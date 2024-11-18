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
        return <><Image src={"/assets/add_filled.svg"} alt={"add_filled_icon"} height={16} width={16} /> Add</>;
      case 'close':
        return <X size={18} />;
      case 'info':
        return <Info size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between w-full bg-primary text-white px-[20px] py-[2px]">
      <h1 className="text-lg font-semibold">{title}</h1>
      {actionType && (
        <Button
          variant="ghost"
          // size="icon"
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