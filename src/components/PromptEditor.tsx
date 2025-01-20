import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Loader2, Send } from "lucide-react";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const PromptEditor = ({ value, onChange, onGenerate, isLoading }: PromptEditorProps) => {
  const { toast } = useToast();
  const promptCount = value.split("\n").filter(line => line.trim()).length;
  const charCount = value.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: "The prompts have been copied to your clipboard.",
    });
  };

  return (
    <Card className="p-4 h-full flex flex-col bg-[#2A2F3C] border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Prompts</h2>
        <div className="text-sm text-gray-400">
          {promptCount} prompt{promptCount !== 1 ? "s" : ""} • {charCount} characters
        </div>
      </div>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your prompts here, one per line..."
        className="flex-1 font-mono text-sm min-h-[300px] mb-4 resize-none bg-[#1A1F2C] border-gray-700 text-gray-200 placeholder:text-gray-500"
      />
      
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!value.trim()}
          className="gap-2 bg-[#1A1F2C] hover:bg-[#2A2F3C] border-gray-700 text-gray-200"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isLoading || !value.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};