"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const TestPage = () => {
  // function to submit the form data
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // construct the form body
    const formData = new FormData(event.currentTarget);
    const chatbotData = {
      name: formData.get("name"),
      apiLink: formData.get("apiLink"),
      apiKey: formData.get("apiKey"),
      modelName: formData.get("modelName"),
      question: formData.get("question"),
      expectedAnswer: formData.get("expectedAnswer"),
    };

    try {
      // Send POST request to the API
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatbotData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  // actual UI
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chatbot Configuration</CardTitle>
          <CardDescription>Enter your chatbot details below</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Chatbot Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter chatbot name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiLink">API Link</Label>
              <Input
                id="apiLink"
                name="apiLink"
                placeholder="https://api.example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                name="apiKey"
                type="password"
                placeholder="Enter your API key"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                name="modelName"
                placeholder="e.g. gpt-4"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                name="question"
                placeholder="Enter a sample question"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedAnswer">Expected Answer</Label>
              <Textarea
                id="expectedAnswer"
                name="expectedAnswer"
                placeholder="Enter the expected answer"
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full mt-4">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TestPage;
