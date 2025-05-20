import React, { useEffect, useState } from "react";
import { useOrganization } from "@/contexts/OrganizationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/Sidebar";

interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: "assistant" | "user";
  created_at: string;
}

interface Conversation {
  id: string;
  user_id: string | null;
  anonymous_id: string;
  org_id: string;
  created_at: string;
  messages: Message[];
}

interface DashboardAnalytics {
  totalQueries: string;
  totalUsers: string;
  averageConversationLength: number;
}

const DashboardPage: React.FC = () => {
  const { currentOrg } = useOrganization();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [showConversationDetail, setShowConversationDetail] = useState(false);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentOrg) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/conversations/${currentOrg.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [currentOrg]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/dashboard/${currentOrg?.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    if (currentOrg) {
      fetchAnalytics();
    }
  }, [currentOrg]);

  const getFirstUserMessage = (conversation: Conversation) => {
    return (
      conversation.messages.find((m) => m.role === "user")?.content ||
      "No message content"
    );
  };

  const getLastMessage = (conversation: Conversation) => {
    return conversation.messages[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageCount = (conversation: Conversation) => {
    const userMessages = conversation.messages.filter(
      (m) => m.role === "user"
    ).length;
    const assistantMessages = conversation.messages.filter(
      (m) => m.role === "assistant"
    ).length;
    return { userMessages, assistantMessages };
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              {currentOrg?.name || "Dashboard"}
            </h1>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Total Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analytics?.totalQueries || "0"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Across all sources
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analytics?.totalUsers || "0"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Active users this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Average Conversation Length
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {analytics?.averageConversationLength || "0"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Messages per conversation
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 p-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>
                  View and manage your recent chat interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Initial Query</TableHead>
                      <TableHead>Last Response</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversations.map((conversation) => {
                      const { userMessages, assistantMessages } =
                        getMessageCount(conversation);
                      const lastMessage = getLastMessage(conversation);

                      return (
                        <TableRow
                          key={conversation.id}
                          className="cursor-pointer hover:bg-slate-50"
                          onClick={() => {
                            setSelectedConversation(conversation);
                            setShowConversationDetail(true);
                          }}
                        >
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {getFirstUserMessage(conversation)}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {lastMessage.content}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Badge variant="secondary">
                                👤 {userMessages}
                              </Badge>
                              <Badge variant="secondary">
                                🤖 {assistantMessages}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(conversation.created_at)}
                          </TableCell>
                          <TableCell>
                            {formatDate(lastMessage.created_at)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog
              open={showConversationDetail}
              onOpenChange={setShowConversationDetail}
            >
              <DialogContent className="max-w-3xl max-h-[80vh] bg-white">
                <DialogHeader>
                  <DialogTitle>Conversation Detail</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4">
                    {selectedConversation?.messages
                      .slice()
                      .reverse()
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === "assistant"
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          <div
                            className={`rounded-lg p-4 max-w-[80%] ${
                              message.role === "assistant"
                                ? "bg-white border border-slate-200"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs opacity-70">
                                {message.role === "assistant"
                                  ? "🤖 Assistant"
                                  : "👤 User"}
                              </span>
                              <span className="text-xs opacity-70">
                                {formatDate(message.created_at)}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
