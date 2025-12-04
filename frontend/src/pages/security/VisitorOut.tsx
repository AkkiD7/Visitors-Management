import { useState, useEffect } from "react";
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
import { Shield, LogOut, FileText } from "lucide-react";
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
import {
  getVisitorsApi,
  updateVisitorOutApi,
} from "@/api/visitor";
import type { VisitorResponse } from "@/api/visitor";
import { clearAuthUser } from "@/utils/auth";

type VisitorFormConfig = {
  visitorNumber: boolean;
};

const defaultConfig: VisitorFormConfig = {
  visitorNumber: true,
};

const VisitorOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [selectedVisitorId, setSelectedVisitorId] = useState("");
  const [visitors, setVisitors] = useState<VisitorResponse[]>([]);
  const [isVisitorsLoading, setIsVisitorsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [config, setConfig] = useState<VisitorFormConfig>(defaultConfig);

  const navItems = [
    { label: "Visitor In", path: "/security/visitor-in", icon: Shield },
    { label: "Visitor Out", path: "/security/visitor-out", icon: LogOut },
    { label: "Reports", path: "/security/report", icon: FileText },
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem("visitorFormConfig");
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig((prev) => ({
          ...prev,
          visitorNumber:
            typeof parsed.visitorNumber === "boolean"
              ? parsed.visitorNumber
              : prev.visitorNumber,
        }));
      }
    } catch (error) {
      console.error("Failed to load visitor form config for VisitorOut", error);
    }
  }, []);

  const fetchVisitors = async () => {
    try {
      setIsVisitorsLoading(true);
      const res = await getVisitorsApi();

      if (res?.success && Array.isArray(res.data)) {
        const activeVisitors = res.data.filter(
          (v) => !v.outTime
        );
        setVisitors(activeVisitors);
      } else {
        toast.error(res?.message || "Failed to load visitors");
      }
    } catch (err: any) {
      console.error("Fetch visitors error:", err);
      const msg =
        err?.response?.data?.message || "Failed to load visitors";
      toast.error(msg);
    } finally {
      setIsVisitorsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (config.visitorNumber && !selectedVisitorId) {
      toast.error("Please select a visitor");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await updateVisitorOutApi(selectedVisitorId);

      if (res.success) {
        toast.success(res.message || "Visitor check-out recorded!");
        setSelectedVisitorId("");
        fetchVisitors();
      } else {
        toast.error(res.message || "Failed to update visitor out time");
      }
    } catch (err: any) {
      console.error("Update visitor out error:", err);
      const msg =
        err?.response?.data?.message || "Failed to update visitor out time";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

const handleLogout = () => {
    clearAuthUser(); 
    navigate("/", { replace: true }); 
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background flex">
        <Sidebar collapsible="icon" variant="sidebar" className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Security Navigation</SidebarGroupLabel>
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

        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="mr-1" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Security - Visitor Out</h1>
                  <p className="text-sm text-muted-foreground">
                    Record visitor exit
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
                <CardTitle>Visitor Check-Out</CardTitle>
                <CardDescription>
                  Select a visitor to mark them as checked-out. Out time will be
                  set to the current time automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {config.visitorNumber && (
                    <div className="space-y-2">
                      <Label htmlFor="visitorNumber">
                        Visitor (by Visitor Number)
                      </Label>

                      {isVisitorsLoading ? (
                        <Input
                          disabled
                          placeholder="Loading visitors..."
                        />
                      ) : visitors.length === 0 ? (
                        <Input
                          disabled
                          placeholder="No active visitors to check out"
                        />
                      ) : (
                        <select
                          id="visitorNumber"
                          className="w-full border rounded-md p-2 bg-background text-sm"
                          value={selectedVisitorId}
                          onChange={(e) =>
                            setSelectedVisitorId(e.target.value)
                          }
                        >
                          <option value="">Select visitor</option>
                          {visitors.map((v) => (
                            <option key={v._id} value={v._id}>
                              {v.visitorNumber} – {v.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Out Time will be recorded on the server as the{" "}
                    <b>current time</b> when you submit this form.
                  </p>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || visitors.length === 0}
                  >
                    {isSubmitting ? "Recording..." : "Record Check-Out"}
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

export default VisitorOut;
