import { useState } from "react";
import { Settings, Download, Copy, Loader2 } from "lucide-react";
import { PromptEditor } from "@/components/PromptEditor";
import { ResponseViewer } from "@/components/ResponseViewer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [prompts, setPrompts] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [temperature, setTemperature] = useState("0.7");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem("openai_base_url") || "");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key in settings",
        variant: "destructive",
      });
      return;
    }

    const promptList = prompts.split("\n").filter(p => p.trim());
    if (promptList.length === 0) return;

    setIsLoading(true);
    try {
      // Simulate API call for now - replace with actual OpenAI integration
      const generatedResponses = promptList.map(prompt => 
        `Generated response for: ${prompt}\n\nThis is a placeholder response that would normally come from an AI model.`
      );
      setResponses(generatedResponses);
      toast({
        title: "Generation Complete",
        description: `Successfully generated ${generatedResponses.length} responses.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
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

  const saveSettings = (newApiKey: string, newBaseUrl: string) => {
    localStorage.setItem("openai_api_key", newApiKey);
    localStorage.setItem("openai_base_url", newBaseUrl);
    setApiKey(newApiKey);
    setBaseUrl(newBaseUrl);
    toast({
      title: "Settings Saved",
      description: "Your OpenAI settings have been saved.",
    });
  };

  return (
    <div className="container py-8 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
            Bulk Data Generator
          </h1>
          
          <div className="flex items-center gap-4">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>OpenAI Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">Base URL (Optional)</Label>
                    <Input
                      id="baseUrl"
                      placeholder="https://api.openai.com/v1"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => saveSettings(apiKey, baseUrl)}
                  >
                    Save Settings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
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