import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, MessageSquare, Zap } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useOrganization } from "@/contexts/OrganizationContext";

interface OutputChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "available" | "coming_soon";
  details: {
    title: string;
    description: string;
    features: string[];
    setupSteps: string[];
    documentation: string;
  };
}

const outputChannels: OutputChannel[] = [
  {
    id: "rest-api",
    name: "REST API",
    description:
      "Integrate AI responses directly into your applications via REST API",
    icon: <Globe className="h-6 w-6" />,
    status: "available",
    details: {
      title: "REST API Integration",
      description: "Simple HTTP endpoint to query your AI assistant.",
      features: [],
      setupSteps: [
        "Make a POST request to http://localhost:3000/api/query",
        "Get your orgId from the bottom left corner of the page",
        `Include your query and orgId in the request body:
        {
            "query": "your question here",
            "orgId": "your-org-id"
        }`,
        `Your response will be a JSON object with the following fields:
        {
            "response": "AI-generated response",
            "conversationId": "conversation-id"
        }`,
        "Optionally include conversationId in the next request's body to continue the existing chat thread",
        "Receive JSON response with AI-generated content",
      ],
      documentation: "https://comingsoon.ragnet.in",
    },
  },
  {
    id: "discord",
    name: "Discord Bot",
    description: "Deploy an AI assistant directly in your Discord server",
    icon: <MessageSquare className="h-6 w-6" />,
    status: "available",
    details: {
      title: "Discord Bot Integration",
      description: "Chat with your AI assistant directly in Discord.",
      features: [],
      setupSteps: [
        "Add Ragnet bot to your Discord server",
        "Mention @ragnet in any channel to start chatting",
        "The bot will maintain conversation context within the channel",
      ],
      documentation: "https://comingsoon.ragnet.in",
    },
  },
];

const OutputsPage: React.FC = () => {
  const { currentOrg } = useOrganization();
  const [selectedChannel, setSelectedChannel] = useState<OutputChannel | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Output Channels
            </h1>
            <p className="text-slate-500 mt-2">
              Configure how your AI assistant communicates with your users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {outputChannels.map((channel) => (
              <Card
                key={channel.id}
                className="relative hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedChannel(channel);
                  setShowDetails(true);
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {channel.icon}
                    </div>
                    <Badge
                      variant={
                        channel.status === "available" ? "default" : "secondary"
                      }
                    >
                      {channel.status === "available"
                        ? "Available"
                        : "Coming Soon"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{channel.name}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full justify-between group"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-indigo-50 rounded-lg">
                {selectedChannel?.icon}
              </div>
              <span className="text-slate-900">{selectedChannel?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-base">
              {selectedChannel?.details.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 pt-4">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-slate-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-500" />
                How to Use
              </h3>
              <div className="space-y-4">
                {selectedChannel?.details.setupSteps.map((step, index) => (
                  <div
                    key={index}
                    className="font-mono text-sm bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>{step}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OutputsPage;
