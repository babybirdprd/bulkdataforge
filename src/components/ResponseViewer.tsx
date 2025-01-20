import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Download } from "lucide-react";

interface ResponseViewerProps {
  responses: string[];
  onDownload: () => void;
}

export const ResponseViewer = ({ responses, onDownload }: ResponseViewerProps) => {
  const { toast } = useToast();

  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard.",
    });
  };

  return (
    <Card className="p-4 h-full flex flex-col bg-card border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Responses</h2>
        {responses.length > 0 && (
          <Button variant="outline" onClick={onDownload} className="gap-2 bg-background hover:bg-accent">
            <Download className="h-4 w-4" />
            Download JSON
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {responses.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Generated responses will appear here
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response, index) => (
              <Card key={index} className="p-4 relative group bg-background border-border">
                <pre className="font-mono text-sm whitespace-pre-wrap text-foreground">{response}</pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity gap-2"
                  onClick={() => handleCopyResponse(response)}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};