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

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: "The prompts have been copied to your clipboard.",
    });
  };

  return (
    <Card className="p-4 h-full flex flex-col bg-card border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Prompts</h2>
        <div className="text-sm text-muted-foreground">
          {promptCount} prompt{promptCount !== 1 ? "s" : ""}
        </div>
      </div>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your prompts here, one per line..."
        className="flex-1 font-mono text-sm min-h-[300px] mb-4 resize-none bg-background text-foreground"
      />
      
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!value.trim()}
          className="gap-2 bg-background hover:bg-accent"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isLoading || !value.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
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