import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Shield, LogOut, FileText } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
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

import { getVisitorsApi } from "../../api/visitor";
import type { VisitorResponse } from "../../api/visitor";
import { clearAuthUser } from "@/utils/auth";

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [visitors, setVisitors] = useState<VisitorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navItems = [
    { label: "Visitor In", path: "/security/visitor-in", icon: Shield },
    { label: "Visitor Out", path: "/security/visitor-out", icon: LogOut },
    { label: "Reports", path: "/security/report", icon: FileText },
  ];

  const handleDownload = () => {
    console.log("Downloading report...");
  };

 const handleLogout = () => {
    clearAuthUser(); 
    navigate("/", { replace: true }); 
  };

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setIsLoading(true);

        const res = await getVisitorsApi(); 
        setVisitors(res.data);              

      } catch (error) {
        console.error("Failed to fetch visitors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  // ✅ null + undefined safe type
  const formatDateTime = (value: string | null | undefined): string => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  };

  // ✅ null + undefined safe type
  const getTotalTime = (
    inTime: string | null | undefined,
    outTime: string | null | undefined
  ): string => {
    if (!inTime || !outTime) return "-";

    const start = new Date(inTime).getTime();
    const end = new Date(outTime).getTime();

    if (isNaN(start) || isNaN(end) || end < start) return "-";

    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background flex">
        {/* Left sidebar navigation */}
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
                  <h1 className="text-xl font-bold">Visitor Reports</h1>
                  <p className="text-sm text-muted-foreground">
                    Download visitor data
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8 flex-1">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Report</CardTitle>
                <CardDescription>
                  View and download visitor records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Export visitor data for compliance and auditing purposes.
                  </p>
                  <Button onClick={handleDownload}>
                    <FileText className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Visitor #</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>In Time</TableHead>
                        <TableHead>Out Time</TableHead>
                        <TableHead>Total Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            Loading visitors...
                          </TableCell>
                        </TableRow>
                      ) : visitors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            No visitors found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        visitors.map((visitor) => (
                          <TableRow key={visitor._id}>
                            <TableCell className="font-medium">
                              {visitor.visitorNumber}
                            </TableCell>
                            <TableCell>{visitor.name}</TableCell>
                            <TableCell>
                              {formatDateTime(visitor.inTime)}
                            </TableCell>
                            <TableCell>
                              {formatDateTime(visitor.outTime)}
                            </TableCell>
                            <TableCell>
                              {getTotalTime(visitor.inTime, visitor.outTime)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Report;
