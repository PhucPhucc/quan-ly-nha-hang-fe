"use client";

import { ArrowLeft, LogOut, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";

const UnauthorizedPage = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleGoBack = () => {
    router.back();
  };

  const handleLoginOther = () => {
    logout();
    router.push("/login"); // Assuming /login is the path
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card shadow-xl rounded-2xl border border-border p-8 text-center animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-danger/10 rounded-full animate-float">
            <ShieldAlert className="size-16 text-danger" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-foreground mb-3 tracking-tight">
          {UI_TEXT.UNAUTHORIZED.TITLE}
        </h1>
        <p className="text-muted-foreground mb-8 text-balance">
          {UI_TEXT.UNAUTHORIZED.DESCRIPTION}
        </p>

        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            size="lg"
            className="w-full font-bold h-12 hover:shadow-glow hover:shadow-primary/20 transition-all"
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-2 size-5" />
            {UI_TEXT.UNAUTHORIZED.GO_BACK}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full font-bold h-12 hover:bg-secondary transition-all"
            onClick={handleLoginOther}
          >
            <LogOut className="mr-2 size-5" />
            {UI_TEXT.UNAUTHORIZED.LOGIN_OTHER}
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground italic">{UI_TEXT.COMMON.COPYRIGHT}</p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
