import { useState, useEffect } from "react";
import { z } from "zod";
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
import { Shield, Camera, LogOut, FileText } from "lucide-react";
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
  createVisitor,
  type CreateVisitorPayload,
} from "@/api/visitor";
import { getUsersApi, type IUser } from "@/api/user";

type VisitorFormConfig = {
  visitorNumber: boolean;
  name: boolean;
  mobile: boolean;
  contactPerson: boolean;
  purpose: boolean;
  numberOfPersons: boolean;
  vehicleNumber: boolean;
  inTime: boolean;
  outTime: boolean;
  totalTimeSpent: boolean;
};

const defaultConfig: VisitorFormConfig = {
  visitorNumber: true,
  name: true,
  mobile: true,
  contactPerson: true,
  purpose: true,
  numberOfPersons: true,
  vehicleNumber: true,
  inTime: true,
  outTime: true,
  totalTimeSpent: true,
};

// 🔹 Zod schema – basic format validation
const visitorSchema = z.object({
  visitorNumber: z.string().optional(),
  visitorName: z.string().optional(),
  mobileNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{10}$/.test(val),
      { message: "Mobile number must be 10 digits" }
    ),
  // contactPerson yaha optional hai, actual required check niche hoga
  contactPerson: z.string().optional(),
  purpose: z.string().optional(),
  numberOfPersons: z
    .string()
    .optional()
    .refine(
      (val) => !val || Number(val) > 0,
      { message: "Number of persons must be greater than 0" }
    ),
  vehicleNumber: z.string().optional(),
  inTime: z.string().optional(),
});

type VisitorFormData = {
  visitorNumber: string;
  visitorName: string;
  mobileNumber: string;
  contactPerson: string; // yaha hum _id store karenge
  purpose: string;
  numberOfPersons: string;
  vehicleNumber: string;
  inTime: string;
  outTime: string;
  totalTimeSpent: string;
  photo: File | null;
};

type FieldErrors = {
  visitorNumber?: string;
  visitorName?: string;
  mobileNumber?: string;
  contactPerson?: string;
  purpose?: string;
  numberOfPersons?: string;
};

const VisitorIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [formData, setFormData] = useState<VisitorFormData>({
    visitorNumber: "",
    visitorName: "",
    mobileNumber: "",
    contactPerson: "",
    purpose: "",
    numberOfPersons: "",
    vehicleNumber: "",
    inTime: "",
    outTime: "",
    totalTimeSpent: "",
    photo: null,
  });

  const [config, setConfig] = useState<VisitorFormConfig>(defaultConfig);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contacts, setContacts] = useState<IUser[]>([]);
  const [isContactsLoading, setIsContactsLoading] = useState(false);

  const navItems = [
    { label: "Visitor In", path: "/security/visitor-in", icon: Shield },
    { label: "Visitor Out", path: "/security/visitor-out", icon: LogOut },
    { label: "Reports", path: "/security/report", icon: FileText },
  ];

  // 🔹 Load admin config from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("visitorFormConfig");
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<VisitorFormConfig>;
        setConfig({ ...defaultConfig, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load visitor form config", error);
    }
  }, []);

  // 🔹 Fetch contact persons (Manager / HR)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsContactsLoading(true);
        const res = await getUsersApi(); // { success, message, data }
        if (res?.success && Array.isArray(res.data)) {
          const filtered = res.data.filter(
            (u: IUser) => u.role === "manager" || u.role === "hr"
          );
          setContacts(filtered);
        } else {
          toast.error(res?.message || "Failed to load contact persons");
        }
      } catch (err: any) {
        console.error("Fetch contacts error:", err);
        toast.error(
          err?.response?.data?.message || "Failed to load contact persons"
        );
      } finally {
        setIsContactsLoading(false);
      }
    };

    if (config.contactPerson) {
      fetchContacts();
    }
  }, [config.contactPerson]);

  const handleChange = (field: keyof VisitorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      toast.success("Photo uploaded (demo)");
    }
  };

  const handleSetCurrentInTime = () => {
    const now = new Date();
    const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16); // yyyy-MM-ddTHH:mm

    setFormData((prev) => ({ ...prev, inTime: iso }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1️⃣ Zod format validation
    const zodResult = visitorSchema.safeParse(formData);

    let fieldErrors: FieldErrors = {};

    if (!zodResult.success) {
      const flat = zodResult.error.flatten().fieldErrors;
      fieldErrors = {
        visitorNumber: flat.visitorNumber?.[0],
        visitorName: flat.visitorName?.[0],
        mobileNumber: flat.mobileNumber?.[0],
        contactPerson: flat.contactPerson?.[0],
        purpose: flat.purpose?.[0],
        numberOfPersons: flat.numberOfPersons?.[0],
      };
    }

    // 2️⃣ Required checks based on admin config
    if (config.visitorNumber && !formData.visitorNumber.trim()) {
      fieldErrors.visitorNumber =
        fieldErrors.visitorNumber || "Visitor Number is required";
    }

    if (config.name && !formData.visitorName.trim()) {
      fieldErrors.visitorName =
        fieldErrors.visitorName || "Visitor Name is required";
    }

    if (config.mobile && !formData.mobileNumber.trim()) {
      fieldErrors.mobileNumber =
        fieldErrors.mobileNumber || "Mobile Number is required";
    }

    if (config.contactPerson && !formData.contactPerson.trim()) {
      // yaha contactPerson me hum _id store kar rahe hai (dropdown value)
      fieldErrors.contactPerson =
        fieldErrors.contactPerson || "Contact Person is required";
    }

    if (config.purpose && !formData.purpose.trim()) {
      fieldErrors.purpose =
        fieldErrors.purpose || "Purpose is required";
    }

    // 3️⃣ Agar koi bhi error hai → sab field ke niche dikhayenge, toast generic
    const hasAnyError = Object.values(fieldErrors).some(Boolean);

    if (hasAnyError) {
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    // 4️⃣ Prepare payload (backend ko id chahiye)
    const payload: CreateVisitorPayload = {
      visitorNumber: formData.visitorNumber.trim(),
      name: formData.visitorName.trim(),
      mobile: formData.mobileNumber.trim(),
      contactPersonId: formData.contactPerson.trim(), // 👈 _id jaa raha hai
      purpose: formData.purpose.trim(),
      numberOfPersons: formData.numberOfPersons
        ? Number(formData.numberOfPersons)
        : 1,
      vehicleNumber: formData.vehicleNumber || undefined,
      inTime: formData.inTime
        ? new Date(formData.inTime).toISOString()
        : null,
      outTime: null,
      totalTimeSpent: null,
    };

    try {
      setIsSubmitting(true);

      const res = await createVisitor(payload);

      if (res.success) {
        toast.success(res.message || "Visitor check-in recorded!");

        setFormData({
          visitorNumber: "",
          visitorName: "",
          mobileNumber: "",
          contactPerson: "",
          purpose: "",
          numberOfPersons: "",
          vehicleNumber: "",
          inTime: "",
          outTime: "",
          totalTimeSpent: "",
          photo: null,
        });
      } else {
        toast.error(res.message || "Failed to create visitor");
      }
    } catch (error: any) {
      console.error("Create visitor error:", error);
      const msg =
        error?.response?.data?.message || "Failed to create visitor";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
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
                  <h1 className="text-xl font-bold">Security - Visitor In</h1>
                  <p className="text-sm text-muted-foreground">
                    Record visitor entry
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8 flex-1">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Visitor Check-In</CardTitle>
                <CardDescription>
                  Record visitor entry details (based on admin configuration)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Visitor Number */}
                    {config.visitorNumber && (
                      <div className="space-y-2">
                        <Label htmlFor="visitorNumber">Visitor Number</Label>
                        <Input
                          id="visitorNumber"
                          placeholder="VN101"
                          value={formData.visitorNumber}
                          onChange={(e) =>
                            handleChange("visitorNumber", e.target.value)
                          }
                        />
                        {errors.visitorNumber && (
                          <p className="text-xs text-red-500">
                            {errors.visitorNumber}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Visitor Name */}
                    {config.name && (
                      <div className="space-y-2">
                        <Label htmlFor="visitorName">Visitor Name</Label>
                        <Input
                          id="visitorName"
                          value={formData.visitorName}
                          onChange={(e) =>
                            handleChange("visitorName", e.target.value)
                          }
                        />
                        {errors.visitorName && (
                          <p className="text-xs text-red-500">
                            {errors.visitorName}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Mobile */}
                    {config.mobile && (
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={(e) =>
                            handleChange("mobileNumber", e.target.value)
                          }
                        />
                        {errors.mobileNumber && (
                          <p className="text-xs text-red-500">
                            {errors.mobileNumber}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Contact Person (Dropdown with Manager / HR) */}
                    {config.contactPerson && (
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">
                          Contact Person (Manager / HR)
                        </Label>

                        {isContactsLoading ? (
                          <Input
                            disabled
                            placeholder="Loading contact persons..."
                          />
                        ) : contacts.length === 0 ? (
                          <Input
                            disabled
                            placeholder="No Manager / HR users found"
                          />
                        ) : (
                          <select
                            id="contactPerson"
                            className="w-full border rounded-md p-2 bg-background text-sm"
                            value={formData.contactPerson}
                            onChange={(e) =>
                              handleChange("contactPerson", e.target.value)
                            }
                          >
                            <option value="">Select contact person</option>
                            {contacts.map((user) => (
                              <option key={user._id} value={user._id}>
                                {user.username} ({user.role})
                              </option>
                            ))}
                          </select>
                        )}

                        {errors.contactPerson && (
                          <p className="text-xs text-red-500">
                            {errors.contactPerson}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Purpose */}
                    {config.purpose && (
                      <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Input
                          id="purpose"
                          value={formData.purpose}
                          onChange={(e) =>
                            handleChange("purpose", e.target.value)
                          }
                        />
                        {errors.purpose && (
                          <p className="text-xs text-red-500">
                            {errors.purpose}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Number of Persons */}
                    {config.numberOfPersons && (
                      <div className="space-y-2">
                        <Label htmlFor="numberOfPersons">
                          Number of Persons
                        </Label>
                        <Input
                          id="numberOfPersons"
                          type="number"
                          value={formData.numberOfPersons}
                          onChange={(e) =>
                            handleChange("numberOfPersons", e.target.value)
                          }
                        />
                        {errors.numberOfPersons && (
                          <p className="text-xs text-red-500">
                            {errors.numberOfPersons}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Vehicle Number */}
                    {config.vehicleNumber && (
                      <div className="space-y-2">
                        <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                        <Input
                          id="vehicleNumber"
                          value={formData.vehicleNumber}
                          onChange={(e) =>
                            handleChange("vehicleNumber", e.target.value)
                          }
                        />
                      </div>
                    )}

                    {/* In Time */}
                    {config.inTime && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="inTime">
                          Visit In Time{" "}
                          <span className="text-xs text-muted-foreground">
                            (Security can set / adjust entry time)
                          </span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="inTime"
                            type="datetime-local"
                            value={formData.inTime}
                            onChange={(e) =>
                              handleChange("inTime", e.target.value)
                            }
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleSetCurrentInTime}
                          >
                            Set Now
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Total Time Spent – info only */}
                    {config.totalTimeSpent && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="totalTimeSpent">
                          Total Time Spent (minutes){" "}
                          <span className="text-xs text-muted-foreground">
                            (Auto-calculated after Out Time)
                          </span>
                        </Label>
                        <Input
                          id="totalTimeSpent"
                          placeholder="Will be calculated from In & Out time"
                          value={formData.totalTimeSpent}
                          disabled
                        />
                      </div>
                    )}

                    {/* Photo */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="photo">Visitor Photo</Label>
                      <div className="flex gap-2">
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="flex-1"
                        />
                        <Button type="button" size="icon" variant="outline">
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Record Check-In"}
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

export default VisitorIn;
