import  { useState, useEffect} from "react";
import type{ReactNode} from "react"
import { Coins, FileText, PiggyBank, Banknote, CircleDollarSign } from "lucide-react";

interface LoanLoaderProps {
  message?: string;
  minDuration?: number;
  children?: ReactNode;
  isLoading?: boolean;
}

const LoanLoader = ({
  message = "Loading your loans...",
  minDuration = 1000,
  children,
  isLoading = true,
}: LoanLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  useEffect(() => {
    if (!isLoading && minTimeElapsed) {
      setShowLoader(false);
    }
  }, [isLoading, minTimeElapsed]);

  if (!showLoader && children) {
    return <>{children}</>;
  }

  if (!showLoader) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8">
        {/* Animated Icons Container */}
        <div className="relative h-32 w-32">
          {/* Center coin - main spinning element */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin-slow">
              <CircleDollarSign className="h-16 w-16 text-teal" strokeWidth={1.5} />
            </div>
          </div>

          {/* Orbiting icons */}
          <div className="absolute inset-0 animate-orbit">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <Coins className="h-8 w-8 text-teal-light animate-bounce-subtle" />
            </div>
          </div>

          <div className="absolute inset-0 animate-orbit-reverse">
            <div className="absolute top-1/2 -right-2 -translate-y-1/2">
              <FileText className="h-7 w-7 text-teal-dark animate-pulse" />
            </div>
          </div>

          <div className="absolute inset-0 animate-orbit" style={{ animationDelay: "0.5s" }}>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <PiggyBank className="h-8 w-8 text-teal animate-bounce-subtle" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>

          <div className="absolute inset-0 animate-orbit-reverse" style={{ animationDelay: "0.25s" }}>
            <div className="absolute top-1/2 -left-2 -translate-y-1/2">
              <Banknote className="h-7 w-7 text-teal-light animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-teal-light/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-light via-teal to-teal-light rounded-full animate-progress-bar" />
        </div>

        {/* Loading message */}
        <div className="text-center">
          <p className="text-lg font-medium text-teal-dark animate-pulse-subtle">
            {message}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please wait a moment
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanLoader;
