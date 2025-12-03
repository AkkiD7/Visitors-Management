import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import RoleCreation from "./RoleCreation";
import VisitorDetails from "./VisitorDetails";
import VisitorForm from "./VisitorForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"overview" | "roles" | "visitor-form" |"visitor-details">("overview");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background flex">
        <Sidebar collapsible="icon" variant="sidebar" className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Admin Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === "overview"}
                      onClick={() => setActiveSection("overview")}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === "roles"}
                      onClick={() => setActiveSection("roles")}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Role Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === "visitor-form"}
                      onClick={() => setActiveSection("visitor-form")}
                    >
                      <Users className="h-4 w-4" />
                      <span>Visitor Form</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === "visitor-details"}
                      onClick={() => setActiveSection("visitor-details")}
                    >
                      <Users className="h-4 w-4" />
                      <span>Visitor Details</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

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
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Visitors Management System</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8 flex-1">
            {activeSection === "overview" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-primary" />
                      Role Creation
                    </CardTitle>
                    <CardDescription>
                      Create and manage user roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveSection("roles")}
                    >
                      Manage Roles
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-secondary" />
                      Visitor Form
                    </CardTitle>
                    <CardDescription>
                      Create visitor registration forms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveSection("visitor-form")}
                    >
                      Create Form
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-accent" />
                      Visitor Details
                    </CardTitle>
                    <CardDescription>
                      View all visitor records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveSection("visitor-details")}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "roles" && (
              <RoleCreation />
            )}

            {activeSection === "visitor-form" && (
              <VisitorForm />)}

              {activeSection === "visitor-details" && (
              <VisitorDetails />)}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
