import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { getMyVisitorsApi, updateVisitorMeeting } from "@/api/visitor";
import type { VisitorResponse } from "@/api/visitor";
import { clearAuthUser } from "@/utils/auth";

const VisitorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [visitorId, setVisitorId] = useState<string>("");
  const [meetingStatus, setMeetingStatus] = useState<
    "Pending" | "Completed" | "Cancelled" | "No Show" | ""
  >("");
  const [timeOut, setTimeOut] = useState("");
  const [visitors, setVisitors] = useState<VisitorResponse[]>([]);
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(false);

  const navItems = [
    { label: "Visitor Form", path: "/manager/visitor-form", icon: Shield },
    { label: "Visitor List", path: "/manager/visitor-list", icon: Users },
  ];

  const handleLogout = () => {
    clearAuthUser();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const fetchMyVisitors = async () => {
      try {
        setIsLoadingVisitors(true);
        const res = await getMyVisitorsApi(); 
        setVisitors(res.data || []);
      } catch (error) {
        console.error("Failed to fetch my visitors:", error);
        toast.error("Failed to load visitors");
      } finally {
        setIsLoadingVisitors(false);
      }
    };

    fetchMyVisitors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitorId || !meetingStatus || !timeOut) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const payload = {
        meetingStatus: meetingStatus as
          | "Pending"
          | "Completed"
          | "Cancelled"
          | "No Show",
        outTime: timeOut,
      };

      const res = await updateVisitorMeeting(visitorId, payload);

      toast.success(res.message || "Meeting details updated");

      if (res.data) {
        setVisitors((prev) =>
          prev.map((v) => (v._id === visitorId ? res.data : v))
        );
      }

      setVisitorId("");
      setMeetingStatus("");
      setTimeOut("");
    } catch (error: any) {
      console.error("Update meeting error:", error);
      const msg = error?.response?.data?.message || "Update failed";
      toast.error(msg);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background flex">
        {/* Left sidebar navigation */}
        <Sidebar collapsible="icon" variant="sidebar" className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Manager Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        isActive={currentPath === item.path}
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="mr-1" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    Manager/HR - Visitor Form
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Update meeting details
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8 flex-1">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Update Visitor Meeting Details</CardTitle>
                <CardDescription>
                  Record meeting status and exit time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="visitorName">Visitor</Label>
                    <Select
                      value={visitorId}
                      onValueChange={setVisitorId}
                      disabled={isLoadingVisitors || visitors.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingVisitors
                              ? "Loading visitors..."
                              : visitors.length === 0
                              ? "No visitors found"
                              : "Select visitor"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {visitors.map((v) => (
                          <SelectItem key={v._id} value={v._id}>
                            {v.name} ({v.visitorNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meetingStatus">Meeting Status</Label>
                    <Select
                      value={meetingStatus}
                      onValueChange={(
                        value: "Pending" | "Completed" | "Cancelled" | "No Show"
                      ) => setMeetingStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="No Show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeOut">Time Out</Label>
                    <Input
                      id="timeOut"
                      type="datetime-local"
                      value={timeOut}
                      onChange={(e) => setTimeOut(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoadingVisitors || visitors.length === 0}
                  >
                    Update Meeting Details
                  </Button>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default VisitorForm;
