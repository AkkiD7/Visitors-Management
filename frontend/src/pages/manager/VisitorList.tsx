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
import { Shield, Users } from "lucide-react";
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

import { getMyVisitorsApi } from "@/api/visitor";
import type { VisitorResponse } from "@/api/visitor";
import { clearAuthUser } from "@/utils/auth";

const VisitorList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [visitors, setVisitors] = useState<VisitorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        const res = await getMyVisitorsApi(); // ApiResponse<VisitorResponse[]>
        setVisitors(res.data || []);
      } catch (error) {
        console.error("Failed to fetch my visitors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyVisitors();
  }, []);

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString();
  };

  const getMeetingStatus = (v: VisitorResponse) => {
    if (v.outTime) return "Completed";
    return "In Progress";
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
                  <h1 className="text-xl font-bold">Past Visitors</h1>
                  <p className="text-sm text-muted-foreground">
                    View visitor history
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
                <CardTitle>Visitor History</CardTitle>
                <CardDescription>All past visitor records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Visitor #</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Visit Date</TableHead>
                        <TableHead>Meeting Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            Loading visitors...
                          </TableCell>
                        </TableRow>
                      ) : visitors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
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
                              {visitor.contactPersonId?.username}
                            </TableCell>
                            <TableCell>{visitor.purpose}</TableCell>
                            <TableCell>
                              {formatDate(visitor.createdAt)}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                {getMeetingStatus(visitor)}
                              </span>
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

export default VisitorList;
