import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const PromptEditor = ({ value, onChange, onGenerate, isLoading }: PromptEditorProps) => {
  const { toast } = useToast();
  const promptCount = value.split("\n").filter(line => line.trim()).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: "The prompts have been copied to your clipboard.",
    });
  };

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Prompts</h2>
        <div className="text-sm text-muted-foreground">
          {promptCount} prompt{promptCount !== 1 ? "s" : ""}
        </div>
      </div>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your prompts here, one per line..."
        className="flex-1 font-mono text-sm min-h-[300px] mb-4 resize-none"
      />
      
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!value.trim()}
        >
          Copy
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isLoading || !value.trim()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </Card>
  );
};