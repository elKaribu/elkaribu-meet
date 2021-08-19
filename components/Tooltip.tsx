import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Slot } from "@radix-ui/react-slot";

export function Tooltip({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: {
  [x: string]: any;
  children: React.ReactNode;
  content: React.ReactNode;
  open: boolean;
  defaultOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <TooltipPrimitive.Root
      delayDuration={150}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}>
      <TooltipPrimitive.Trigger as={Slot}>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        className="-mt-2 px-1 py-0.5 text-white text-xs bg-black rounded-sm shadow-lg"
        side="top"
        align="center"
        {...props}>
        {content}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
