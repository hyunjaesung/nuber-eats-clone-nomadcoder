import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    className={` text-lg font-medium focus:outline-none text-white py-4  transition-colors ${
      canClick
        ? "bg-green-600 hover:bg-green-700"
        : "bg-gray-600 pointer-events-none "
    }`}>
    {loading ? "Loading..." : actionText}
  </button>
);
