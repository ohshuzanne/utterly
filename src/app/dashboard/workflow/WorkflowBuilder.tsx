'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MessageSquare, HelpCircle, Clock, PlayCircle, Plus, Minus, Trash2, Loader2, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from '@/app/components/layout/Header';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface WorkflowItem {
  id: string;
  type: 'intent' | 'question' | 'delay' | 'end';
  content?: string;
  expectedAnswer?: string;
  utteranceCount?: number;
  delay?: number;
}

interface Chatbot {
  id: string;
  name: string;
}

interface WorkflowBuilderProps {
  firstName: string;
}

export default function WorkflowBuilder({ firstName }: WorkflowBuilderProps) {
  const { toast } = useToast();
  const [selectedApi, setSelectedApi] = useState('');
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WorkflowItem | null>(null);
  const [zoom, setZoom] = useState(1);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await fetch('/api/chatbots');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch chatbots');
        }

        setChatbots(data.chatbots);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch chatbots",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatbots();
  }, [toast]);

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
      utteranceCount: type === 'question' ? 10 : undefined,
    };
    setWorkflowItems([...workflowItems, newItem]);
  };

  const updateItemContent = (id: string, content: string) => {
    setWorkflowItems(
      workflowItems.map(item =>
        item.id === id ? { ...item, content } : item
      )
    );
    
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({...selectedItem, content});
    }
  };
  
  const updateItemExpectedAnswer = (id: string, expectedAnswer: string) => {
    setWorkflowItems(
      workflowItems.map(item =>
        item.id === id ? { ...item, expectedAnswer } : item
      )
    );
    
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({...selectedItem, expectedAnswer});
    }
  };

  const updateUtteranceCount = (id: string, count: number) => {
    const validCount = Math.min(Math.max(1, count), 30);
    
    setWorkflowItems(
      workflowItems.map(item =>
        item.id === id ? { ...item, utteranceCount: validCount } : item
      )
    );
    
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({...selectedItem, utteranceCount: validCount});
    }
  };

  const deleteItem = (id: string) => {
    setWorkflowItems(prev => prev.filter(item => item.id !== id));
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
    }
  };

  const handleCardClick = (item: WorkflowItem) => {
    setSelectedItem(item);
  };

  const closeRightSidebar = () => {
    setSelectedItem(null);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2)); // Max zoom: 200%
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5)); // Min zoom: 50%
  };

  const getItemIcon = (type: WorkflowItem['type']) => {
    switch (type) {
      case 'intent':
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
    <div className="h-screen flex flex-col">
      <Header userName={firstName} />
      <div className="flex flex-1">
        {/* Left Sidebar - Node Types */}
        <div className="w-[240px] bg-white border-r border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#c0ff99] rounded flex items-center justify-center">
              ⚡
            </div>
            <Select 
              value={selectedApi} 
              onValueChange={setSelectedApi}
              disabled={isLoading || chatbots.length === 0}
            >
              <SelectTrigger className="w-full">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading chatbots...</span>
                  </div>
                ) : chatbots.length === 0 ? (
                  <span className="text-gray-500">No chatbots available</span>
                ) : (
                  <SelectValue placeholder="Select a chatbot" />
                )}
              </SelectTrigger>
              <SelectContent>
                {chatbots.map((chatbot) => (
                  <SelectItem key={chatbot.id} value={chatbot.id}>
                    {chatbot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div 
              className="p-4 bg-gray-50 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-100"
              onClick={() => addItem('intent')}
            >
              <MessageSquare className="w-6 h-6" />
              <span>Intent</span>
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
                              } ${selectedItem?.id === item.id ? 'ring-1 ring-purple-400' : ''}`}
                              onClick={() => handleCardClick(item)}
                            >
                              <div className="text-gray-700">
                                {getItemIcon(item.type)}
                              </div>
                              <div className="flex-1">
                                <div className="cursor-pointer">
                                  {item.content || `Click to add ${item.type} content`}
                                </div>
                                {item.type === 'question' && (
                                  <div className="mt-2 text-sm text-gray-600 flex flex-wrap items-center gap-2">
                                    {item.expectedAnswer && (
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Expected answer added</span>
                                      </div>
                                    )}
                                    {item.utteranceCount && (
                                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                                        <span>{item.utteranceCount} utterances</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteItem(item.id);
                                }}
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
        
        {/* Right Sidebar */}
        {selectedItem && (
          <div className="w-[350px] border-l border-gray-200 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium text-lg">
                {selectedItem.type === 'intent' ? 'Define Intent' : 
                 selectedItem.type === 'question' ? 'Create Question' :
                 selectedItem.type === 'delay' ? 'Set Delay' : 'End Conversation'}
              </h3>
              <button 
                onClick={closeRightSidebar}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {selectedItem.type === 'intent' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intent Description
                  </label>
                  <Textarea
                    value={selectedItem.content || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateItemContent(selectedItem.id, e.target.value)}
                    placeholder="Describe what the bot should understand or handle..."
                    className="w-full min-h-[120px]"
                  />
                </div>
              </div>
            )}
            
            {selectedItem.type === 'question' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <Textarea
                    value={selectedItem.content || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateItemContent(selectedItem.id, e.target.value)}
                    placeholder="Enter your question..."
                    className="w-full min-h-[100px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Answer
                  </label>
                  <Textarea
                    value={selectedItem.expectedAnswer || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateItemExpectedAnswer(selectedItem.id, e.target.value)}
                    placeholder="What is the expected response to this question?"
                    className="w-full min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This will be used to evaluate the chatbot&apos;s response accuracy.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Utterances to Generate
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={selectedItem.utteranceCount || 10}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          updateUtteranceCount(selectedItem.id, value);
                        }
                      }}
                      className="w-24"
                    />
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Min: 1</span> | <span className="font-medium">Max: 30</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Number of different variations to test for this question.
                  </p>
                </div>
              </div>
            )}
            
            {selectedItem.type === 'delay' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay Duration
                </label>
                <Input
                  value={selectedItem.content || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateItemContent(selectedItem.id, e.target.value)}
                  placeholder="e.g., 2 hours, 30 minutes, etc."
                />
              </div>
            )}
            
            {selectedItem.type === 'end' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Message (Optional)
                </label>
                <Textarea
                  value={selectedItem.content || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateItemContent(selectedItem.id, e.target.value)}
                  placeholder="Add a final message or summary..."
                  className="w-full min-h-[120px]"
                />
              </div>
            )}
            
            <div className="mt-8">
              <Button 
                onClick={closeRightSidebar}
                className="w-full"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 