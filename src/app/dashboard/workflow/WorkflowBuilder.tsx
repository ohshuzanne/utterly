'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MessageSquare, HelpCircle, Clock, PlayCircle, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkflowItem {
  id: string;
  type: 'message' | 'question' | 'delay' | 'end';
  content?: string;
  delay?: number;
}

export default function WorkflowBuilder() {
  const [selectedApi, setSelectedApi] = useState('');
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(workflowItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWorkflowItems(items);
  };

  const addItem = (type: WorkflowItem['type']) => {
    const newItem: WorkflowItem = {
      id: Date.now().toString(),
      type,
      content: type === 'delay' ? '2 hours' : '',
    };
    setWorkflowItems([...workflowItems, newItem]);
  };

  const updateItemContent = (id: string, content: string) => {
    setWorkflowItems(
      workflowItems.map(item =>
        item.id === id ? { ...item, content } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setWorkflowItems(prev => prev.filter(item => item.id !== id));
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2)); // Max zoom: 200%
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5)); // Min zoom: 50%
  };

  const getItemIcon = (type: WorkflowItem['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-6 h-6" />;
      case 'question':
        return <HelpCircle className="w-6 h-6" />;
      case 'delay':
        return <Clock className="w-6 h-6" />;
      case 'end':
        return <PlayCircle className="w-6 h-6" />;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Node Types */}
      <div className="w-[240px] bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#c0ff99] rounded flex items-center justify-center">
            ⚡
          </div>
          <Select value={selectedApi} onValueChange={setSelectedApi}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select API" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apu">APU Customer Support Chat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div 
            className="p-4 bg-gray-50 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-100"
            onClick={() => addItem('message')}
          >
            <MessageSquare className="w-6 h-6" />
            <span>Message</span>
          </div>
          <div 
            className="p-4 bg-gray-50 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-100"
            onClick={() => addItem('question')}
          >
            <HelpCircle className="w-6 h-6" />
            <span>Question</span>
          </div>
          <div 
            className="p-4 bg-gray-50 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-100"
            onClick={() => addItem('delay')}
          >
            <Clock className="w-6 h-6" />
            <span>Wait/Set Delay</span>
          </div>
          <div 
            className="p-4 bg-gray-50 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-100"
            onClick={() => addItem('end')}
          >
            <PlayCircle className="w-6 h-6" />
            <span>End Conversation</span>
          </div>
        </div>
      </div>

      {/* Main Workflow Area */}
      <div className="flex-1 relative">
        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            <PlayCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Workflow Canvas */}
        <div 
          className="h-full w-full overflow-auto p-8"
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="workflow">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4 flex flex-col items-center min-h-[200px] origin-top"
                  style={{
                    transform: `scale(${zoom})`,
                    transition: 'transform 0.2s ease-out'
                  }}
                >
                  {workflowItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <>
                          {index > 0 && (
                            <div className="w-px h-8 bg-gray-300" />
                          )}
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-[400px] rounded-lg p-4 flex items-start gap-4 group ${
                              item.type === 'question' ? 'bg-[#c0ff99]' : 'bg-[#f3e8ff]'
                            }`}
                          >
                            <div className="text-gray-700">
                              {getItemIcon(item.type)}
                            </div>
                            <div className="flex-1">
                              {isEditing === item.id ? (
                                <textarea
                                  className="w-full p-2 border rounded-md bg-white/80"
                                  value={item.content}
                                  onChange={(e) => updateItemContent(item.id, e.target.value)}
                                  onBlur={() => setIsEditing(null)}
                                  autoFocus
                                />
                              ) : (
                                <div
                                  onClick={() => setIsEditing(item.id)}
                                  className="cursor-text"
                                >
                                  {item.content || `Click to add ${item.type} content`}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                            </button>
                          </div>
                        </>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
} 