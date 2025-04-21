'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MessageSquare, HelpCircle, Clock, PlayCircle, Plus, Minus, Trash2, Loader2, X, CheckCircle, Save, Sparkles } from 'lucide-react';
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
import { Sidebar } from '@/app/components/layout/Sidebar';

interface WorkflowItem {
  id: string;
  type: 'intent' | 'question' | 'delay' | 'end';
  content?: string;
  expectedAnswer?: string;
  utteranceCount?: number;
  delay?: number;
  validated?: boolean;
  validationResponse?: string;
}

interface Chatbot {
  id: string;
  name: string;
}

interface WorkflowBuilderProps {
  firstName: string;
  projectId?: string;
  projectName?: string;
}

export default function WorkflowBuilder({ firstName, projectId, projectName }: WorkflowBuilderProps) {
  const { toast } = useToast();
  const [selectedApi, setSelectedApi] = useState('');
  const [workflowItems, setWorkflowItems] = useState<WorkflowItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WorkflowItem | null>(null);
  const [zoom, setZoom] = useState(1);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

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

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!projectId) return;
      
      setIsLoadingWorkflow(true);
      try {
        const response = await fetch(`/api/projects/${projectId}/workflows`);
        if (!response.ok) {
          throw new Error('Failed to fetch workflow');
        }
        
        const data = await response.json();
        if (data.workflows && data.workflows.length > 0) {
          // load existing workflow items
          const workflow = data.workflows[0];
          if (workflow.items) {
            setWorkflowItems(workflow.items as WorkflowItem[]);
            setWorkflowId(workflow.id);
            setWorkflowName(workflow.name || 'New Workflow');
            if (workflow.chatbotId) {
              setSelectedApi(workflow.chatbotId);
            }
          }
        }
      } catch (error) {
        console.error('Error loading workflow:', error);
        toast({
          title: "Error",
          description: "Failed to load workflow data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingWorkflow(false);
      }
    };

    fetchWorkflow();
  }, [projectId, toast]);

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
    // Check if trying to add an end node when one already exists
    if (type === 'end' && workflowItems.some(item => item.type === 'end')) {
      toast({
        title: "Error",
        description: "Only one end node is allowed in a workflow",
        variant: "destructive",
      });
      return;
    }

    const newItem: WorkflowItem = {
      id: Date.now().toString(),
      type,
      content: type === 'delay' ? '10 minutes' : '',
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
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5)); 
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

  const enhanceContent = async (type: 'question' | 'answer', content: string) => {
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance content');
      }

      const data = await response.json();
      return data.enhancedContent;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance content. Please try again.",
        variant: "destructive",
      });
      return content;
    }
  };

  const handleEnhanceQuestion = async (item: WorkflowItem) => {
    if (!item.content) {
      toast({
        title: "Error",
        description: "Please enter a question first",
        variant: "destructive",
      });
      return;
    }

    const enhancedContent = await enhanceContent('question', item.content);
    updateItemContent(item.id, enhancedContent);
  };

  const handleEnhanceAnswer = async (item: WorkflowItem) => {
    if (!item.expectedAnswer) {
      toast({
        title: "Error",
        description: "Please enter an expected answer first",
        variant: "destructive",
      });
      return;
    }

    const enhancedContent = await enhanceContent('answer', item.expectedAnswer);
    updateItemExpectedAnswer(item.id, enhancedContent);
  };

  const validateWorkflow = () => {
    const hasEmptyQuestions = workflowItems.some(
      item => item.type === 'question' && (!item.content || !item.expectedAnswer)
    );

    const hasInvalidDelays = workflowItems.some(
      item => item.type === 'delay' && (!item.content || isNaN(parseInt(item.content)) || parseInt(item.content) < 1 || parseInt(item.content) > 30)
    );

    const hasUnvalidatedIntents = workflowItems.some(
      item => item.type === 'intent' && !item.validated
    );

    const endIndex = workflowItems.findIndex(item => item.type === 'end');
    const hasEnd = endIndex !== -1;
    const isEndLast = hasEnd && endIndex === workflowItems.length - 1;

    if (hasEmptyQuestions) {
      toast({
        title: "Cannot Save",
        description: "Please ensure all questions have both content and expected answers",
        variant: "destructive",
      });
      return false;
    }

    if (hasInvalidDelays) {
      toast({
        title: "Cannot Save",
        description: "Please ensure all delays are between 1-30 minutes",
        variant: "destructive",
      });
      return false;
    }

    if (hasUnvalidatedIntents) {
      toast({
        title: "Cannot Save",
        description: "Please validate all intents before saving",
        variant: "destructive",
      });
      return false;
    }

    if (!hasEnd) {
      toast({
        title: "Cannot Save",
        description: "Please add an End Conversation node at the end of the workflow",
        variant: "destructive",
      });
      return false;
    }

    if (!isEndLast) {
      toast({
        title: "Cannot Save",
        description: "End Conversation node must be the last node in the workflow",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateIntent = async (item: WorkflowItem) => {
    if (!item.content) {
      toast({
        title: "Error",
        description: "Please enter intent content first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/validate-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: item.content,
          chatbotId: selectedApi
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate intent');
      }

      const data = await response.json();
      
      setWorkflowItems(prevItems => 
        prevItems.map(prevItem => 
          prevItem.id === item.id 
            ? { 
                ...prevItem, 
                validated: data.isValid,
                validationResponse: data.message
              } 
            : prevItem
        )
      );

      if (data.isValid) {
        toast({
          title: "Success",
          description: "Intent validated successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Validation Failed",
          description: data.message || "The chatbot could not understand this intent",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error('Error validating intent:', error);
      toast({
        title: "Error",
        description: "Failed to validate intent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveWorkflow = async () => {
    if (!projectId || !selectedApi) {
      toast({
        title: "Cannot Save",
        description: "Please select a chatbot before saving",
        variant: "destructive",
      });
      return;
    }

    if (!validateWorkflow()) {
      return;
    }

    setIsSaving(true);
    try {
      const endpoint = `/api/projects/${projectId}/workflows`;
      const method = workflowId ? 'PUT' : 'POST';
      const url = workflowId ? `${endpoint}/${workflowId}` : endpoint;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workflowName,
          items: workflowItems,
          chatbotId: selectedApi
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save workflow');
      }

      const data = await response.json();
      
      if (!workflowId) {
        setWorkflowId(data.workflow.id);
      }

      toast({
        title: "Success",
        description: "Workflow saved successfully",
        variant: "default",
      });
    } catch (error: unknown) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save workflow",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const executeWorkflow = async () => {
    if (!selectedApi || !workflowId) {
      toast({
        title: "Cannot Execute",
        description: "Please select a chatbot and save the workflow before executing",
        variant: "destructive",
      });
      return;
    }

    // checks  if end conversation exists and is at the end
    const endIndex = workflowItems.findIndex(item => item.type === 'end');
    const hasEnd = endIndex !== -1;
    const isEndLast = hasEnd && endIndex === workflowItems.length - 1;

    if (!hasEnd || !isEndLast) {
      toast({
        title: "Cannot Execute",
        description: "Please add an End Conversation node at the end of the workflow before executing",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    try {
      const response = await fetch(`/api/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId: selectedApi,
          items: workflowItems.map(item => ({
            ...item,
            // converts delay content to minutes for the backend
            delay: item.type === 'delay' ? parseInt(item.content || '0') : undefined
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to execute workflow');
      }

      const { reportId } = await response.json();
      
      toast({
        title: "Success!",
        description: "Workflow executed successfully. Generating report...",
        variant: "default",
      });

      // waits a moment to show the success message
      await new Promise(resolve => setTimeout(resolve, 2000));

      // redirects to results page with the report ID
      window.location.href = `/dashboard/workflow/${workflowId}/results?reportId=${reportId}`;
    } catch (error: unknown) {
      console.error('Error executing workflow:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to execute workflow",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="ml-[60px] flex flex-col flex-1 overflow-hidden">
      <Header userName={firstName} />
      <div className="flex flex-1">
        
        
        {/* Left Sidebar - Node Types */}
        <div className="w-[240px] bg-white border-r border-gray-200 p-4 flex flex-col">
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

          <div className="space-y-4 flex-1">
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
          
          {/* save workflow button */}
          <div className="mt-6">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workflow Name
              </label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
              />
            </div>
            <Button 
              className="w-full flex items-center justify-center gap-2" 
              onClick={saveWorkflow}
              disabled={isSaving || !selectedApi}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Workflow</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* main workflow area */}
        <div className="flex-1 relative">
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
              onClick={executeWorkflow}
              disabled={isExecuting}
              title="Execute Workflow"
            >
              {isExecuting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlayCircle className="w-4 h-4" />
              )}
            </Button>
          </div>

          {projectName && (
            <div className="absolute top-4 left-4 z-10">
              <h2 className="text-xl font-bold">{projectName}</h2>
            </div>
          )}

          <div 
            className="h-full w-full overflow-auto p-8"
            style={{
              backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            {isLoadingWorkflow ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
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
            )}
          </div>
        </div>
        
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
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => validateIntent(selectedItem)}
                      disabled={!selectedItem.content}
                    >
                      Validate Intent
                    </Button>
                    {selectedItem.validated && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Validated</span>
                      </div>
                    )}
                  </div>
                  {selectedItem.validationResponse && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Chatbot Response:</h4>
                      <p className="text-sm text-gray-700">{selectedItem.validationResponse}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedItem.type === 'question' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <div className="relative">
                    <Textarea
                      value={selectedItem.content || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateItemContent(selectedItem.id, e.target.value)}
                      placeholder="Enter your question..."
                      className="w-full min-h-[100px] pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => handleEnhanceQuestion(selectedItem)}
                      disabled={!selectedItem.content}
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Answer
                  </label>
                  <div className="relative">
                    <Textarea
                      value={selectedItem.expectedAnswer || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateItemExpectedAnswer(selectedItem.id, e.target.value)}
                      placeholder="What is the expected response to this question?"
                      className="w-full min-h-[100px] pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => handleEnhanceAnswer(selectedItem)}
                      disabled={!selectedItem.expectedAnswer}
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
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
                  Delay Duration (1-30 minutes)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={selectedItem.content || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 1 && parseInt(value) <= 30)) {
                        updateItemContent(selectedItem.id, value);
                      }
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  The workflow will pause for this duration before continuing to the next step.
                </p>
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
    </div>
  );
} 