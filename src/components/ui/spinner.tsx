import React from "react";

const Spinner: React.FC<{ size?: string; color?: string }> = ({
  size = "h-6 w-6",
  color = "text-primary",
}) => {
  return (
    <div className={`flex justify-center items-center`}>
      <div
        className={`${size} ${color} border-4 border-t-transparent rounded-full animate-spin`}
        style={{ borderWidth: "4px" }}
      />
    </div>
  );
};

export default Spinner;
