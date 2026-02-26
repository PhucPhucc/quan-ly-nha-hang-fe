import React from "react";

const LoadingSpinner = ({ label }: { label?: string }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      {label && <span className="ml-3 font-bold text-muted-foreground">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
