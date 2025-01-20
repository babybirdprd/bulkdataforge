import { useState } from "react";
import { PromptEditor } from "@/components/PromptEditor";
import { ResponseViewer } from "@/components/ResponseViewer";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [prompts, setPrompts] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    const promptList = prompts.split("\n").filter(p => p.trim());
    if (promptList.length === 0) return;

    setIsLoading(true);
    try {
      // Simulate API call for now
      const generatedResponses = promptList.map(prompt => 
        `Generated response for: ${prompt}\n\nThis is a placeholder response that would normally come from an AI model.`
      );
      setResponses(generatedResponses);
      toast({
        title: "Generation complete",
        description: `Successfully generated ${generatedResponses.length} responses.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating responses.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const data = prompts.split("\n")
      .filter(p => p.trim())
      .map((prompt, index) => ({
        prompt,
        response: responses[index] || "",
      }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
          Bulk Data Generator
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          <PromptEditor
            value={prompts}
            onChange={setPrompts}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <ResponseViewer
            responses={responses}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;