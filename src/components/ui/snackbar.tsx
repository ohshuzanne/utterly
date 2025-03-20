"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { DroppableProvided, DroppableStateSnapshot } from "@hello-pangea/dnd"

interface SnackbarProps {
  show: boolean;
  onCancel: () => void;
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
}

export function Snackbar({ 
  show, 
  onCancel,
  provided,
  snapshot,
}: SnackbarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 flex items-center justify-center transition-transform duration-300 ease-in-out transform z-50",
        show ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={cn(
          "mb-6 flex items-center gap-4 rounded-lg px-4 py-3 text-white shadow-lg transition-colors min-h-[60px]",
          snapshot.isDraggingOver ? "bg-red-600" : "bg-gray-900"
        )}
      >
        <div className="flex items-center gap-4">
          <Trash2 className="h-5 w-5 text-red-400" />
          <span>Drop here to delete</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="ml-4 rounded-md bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
        {provided.placeholder}
      </div>
    </div>
  );
} 