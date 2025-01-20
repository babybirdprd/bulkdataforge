import { useState, useEffect } from "react";
import { Settings, Save, Upload } from "lucide-react";
import { PromptEditor } from "@/components/PromptEditor";
import { ResponseViewer } from "@/components/ResponseViewer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [prompts, setPrompts] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState("0.7");
  const [batchSize, setBatchSize] = useState("5");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem("openai_base_url") || "");
  const { toast } = useToast();

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSavePrompts = () => {
    const blob = new Blob([prompts], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompts.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Prompts Saved",
      description: "Your prompts have been saved to a text file.",
    });
  };

  const handleLoadPrompts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setPrompts(text);
          toast({
            title: "Prompts Loaded",
            description: "Your prompts have been loaded successfully.",
          });
        }
      };
      reader.readAsText(file);
    }
  };

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
    setProgress(0);
    const batchSizeNum = parseInt(batchSize);
    const results: string[] = [];

    try {
      for (let i = 0; i < promptList.length; i += batchSizeNum) {
        const batch = promptList.slice(i, i + batchSizeNum);
        // Simulate API call for now - replace with actual OpenAI integration
        const batchResponses = batch.map(prompt => 
          `Generated response for: ${prompt}\n\nThis is a placeholder response that would normally come from an AI model.`
        );
        results.push(...batchResponses);
        setProgress(Math.min(((i + batchSizeNum) / promptList.length) * 100, 100));
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      }
      
      setResponses(results);
      toast({
        title: "Generation Complete",
        description: `Successfully generated ${results.length} responses.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating responses.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
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
    <div className="min-h-screen bg-[#1A1F2C] text-gray-100">
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Bulk Data Generator
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="model" className="text-sm font-medium text-gray-200">Model:</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-[200px] bg-[#2A2F3C] border-gray-700 text-gray-200"
                placeholder="Enter model name..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="batchSize" className="text-sm font-medium text-gray-200">Batch Size:</Label>
              <Input
                id="batchSize"
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                className="w-[80px] bg-[#2A2F3C] border-gray-700 text-gray-200"
                min="1"
                max="50"
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="bg-[#2A2F3C] hover:bg-[#3A3F4C] border-gray-700">
                  <Settings className="h-4 w-4 text-gray-200" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#2A2F3C] border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-200">OpenAI Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey" className="text-gray-200">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-[#1A1F2C] border-gray-700 text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl" className="text-gray-200">Base URL (Optional)</Label>
                    <Input
                      id="baseUrl"
                      placeholder="https://api.openai.com/v1"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      className="bg-[#1A1F2C] border-gray-700 text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature" className="text-gray-200">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="bg-[#1A1F2C] border-gray-700 text-gray-200"
                    />
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => saveSettings(apiKey, baseUrl)}
                  >
                    Save Settings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleSavePrompts}
            className="bg-[#2A2F3C] hover:bg-[#3A3F4C] border-gray-700 text-gray-200 gap-2"
          >
            <Save className="h-4 w-4" />
            Save Prompts
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".txt"
              onChange={handleLoadPrompts}
              className="hidden"
              id="load-prompts"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('load-prompts')?.click()}
              className="bg-[#2A2F3C] hover:bg-[#3A3F4C] border-gray-700 text-gray-200 gap-2"
            >
              <Upload className="h-4 w-4" />
              Load Prompts
            </Button>
          </div>
        </div>
        
        {isLoading && (
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-400 mt-2">Processing prompts... {Math.round(progress)}% complete</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
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