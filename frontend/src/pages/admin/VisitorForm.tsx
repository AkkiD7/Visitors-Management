import { useState } from "react";
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
import { toast } from "sonner";

const VisitorForm = () => {
  const [fields, setFields] = useState({
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
  });

  const handleToggle = (field: keyof typeof fields, value: boolean) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  localStorage.setItem("visitorFormConfig", JSON.stringify(fields));
  toast.success("Visitor form configuration saved!");
};


  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Visitor Form Creation</CardTitle>
            <CardDescription>
              Admin can configure which fields will be available in the Security
              Visitor In / Out forms. Security will fill actual visitor data.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Enable / disable visitor form fields
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Visitor Number</p>
                      <p className="text-xs text-muted-foreground">
                        Unique ID like VN101 for each visitor.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.visitorNumber}
                      onChange={(e) =>
                        handleToggle("visitorNumber", e.target.checked)
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Visitor Name</p>
                      <p className="text-xs text-muted-foreground">
                        Full name of the visitor.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.name}
                      onChange={(e) =>
                        handleToggle("name", e.target.checked)
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Mobile Number</p>
                      <p className="text-xs text-muted-foreground">
                        Visitor contact number.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.mobile}
                      onChange={(e) =>
                        handleToggle("mobile", e.target.checked)
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Contact Person</p>
                      <p className="text-xs text-muted-foreground">
                        Manager / HR whom visitor will meet.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.contactPerson}
                      onChange={(e) =>
                        handleToggle("contactPerson", e.target.checked)
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Purpose</p>
                      <p className="text-xs text-muted-foreground">
                        Reason for the visit (meeting, interview, etc.).
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.purpose}
                      onChange={(e) =>
                        handleToggle("purpose", e.target.checked)
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Number of Persons</p>
                      <p className="text-xs text-muted-foreground">
                        Total people coming with the visitor.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.numberOfPersons}
                      onChange={(e) =>
                        handleToggle("numberOfPersons", e.target.checked)
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Vehicle Number</p>
                      <p className="text-xs text-muted-foreground">
                        Vehicle registration number (if applicable).
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.vehicleNumber}
                      onChange={(e) =>
                        handleToggle("vehicleNumber", e.target.checked)
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Visit In Time</p>
                      <p className="text-xs text-muted-foreground">
                        When visitor enters (filled by Security).
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.inTime}
                      onChange={(e) =>
                        handleToggle("inTime", e.target.checked)
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Visitor Out Time</p>
                      <p className="text-xs text-muted-foreground">
                        When visitor leaves (filled by Security).
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.outTime}
                      onChange={(e) =>
                        handleToggle("outTime", e.target.checked)
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">Total Time Spent</p>
                      <p className="text-xs text-muted-foreground">
                        Auto-calculated based on In &amp; Out time.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={fields.totalTimeSpent}
                      onChange={(e) =>
                        handleToggle("totalTimeSpent", e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Preview of Security Visitor In form
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {fields.visitorNumber && (
                    <div className="space-y-1">
                      <Label>Visitor Number</Label>
                      <Input placeholder="VN101" disabled />
                    </div>
                  )}

                  {fields.name && (
                    <div className="space-y-1">
                      <Label>Visitor Name</Label>
                      <Input placeholder="John Doe" disabled />
                    </div>
                  )}

                  {fields.mobile && (
                    <div className="space-y-1">
                      <Label>Mobile Number</Label>
                      <Input placeholder="9876543210" disabled />
                    </div>
                  )}

                  {fields.contactPerson && (
                    <div className="space-y-1">
                      <Label>Contact Person</Label>
                      <Input placeholder="Manager / HR" disabled />
                    </div>
                  )}

                  {fields.purpose && (
                    <div className="space-y-1">
                      <Label>Purpose</Label>
                      <Input placeholder="Business Meeting" disabled />
                    </div>
                  )}

                  {fields.numberOfPersons && (
                    <div className="space-y-1">
                      <Label>Number of Persons</Label>
                      <Input placeholder="2" disabled />
                    </div>
                  )}

                  {fields.vehicleNumber && (
                    <div className="space-y-1">
                      <Label>Vehicle Number</Label>
                      <Input placeholder="MH12AB1234" disabled />
                    </div>
                  )}

                  {fields.inTime && (
                    <div className="space-y-1">
                      <Label>Visit In Time</Label>
                      <Input type="datetime-local" disabled />
                    </div>
                  )}

                  {fields.outTime && (
                    <div className="space-y-1">
                      <Label>Visitor Out Time</Label>
                      <Input type="datetime-local" disabled />
                    </div>
                  )}

                  {fields.totalTimeSpent && (
                    <div className="space-y-1 md:col-span-2">
                      <Label>Total Time Spent (minutes)</Label>
                      <Input
                        placeholder="Auto-calculated from In & Out"
                        disabled
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Save Form Configuration
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VisitorForm;
