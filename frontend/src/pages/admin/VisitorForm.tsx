import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VisitorForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    visitorNumber: "",
    visitorName: "",
    mobileNumber: "",
    contactPerson: "",
    purpose: "",
    numberOfPersons: "",
    vehicleNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Visitor form template created!");
    setFormData({
      visitorNumber: "",
      visitorName: "",
      mobileNumber: "",
      contactPerson: "",
      purpose: "",
      numberOfPersons: "",
      vehicleNumber: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Create Visitor Form Template</CardTitle>
            <CardDescription>Configure fields for visitor registration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="visitorNumber">Visitor Number (Unique)</Label>
                  <Input
                    id="visitorNumber"
                    placeholder="e.g., VN101"
                    value={formData.visitorNumber}
                    onChange={(e) => handleChange("visitorNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitorName">Visitor Name</Label>
                  <Input
                    id="visitorName"
                    placeholder="Enter visitor name"
                    value={formData.visitorName}
                    onChange={(e) => handleChange("visitorName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    placeholder="Enter mobile number"
                    value={formData.mobileNumber}
                    onChange={(e) => handleChange("mobileNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Manager/HR name"
                    value={formData.contactPerson}
                    onChange={(e) => handleChange("contactPerson", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input
                    id="purpose"
                    placeholder="Reason for visit"
                    value={formData.purpose}
                    onChange={(e) => handleChange("purpose", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfPersons">Number of Persons</Label>
                  <Input
                    id="numberOfPersons"
                    type="number"
                    placeholder="Enter number"
                    value={formData.numberOfPersons}
                    onChange={(e) => handleChange("numberOfPersons", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="Enter vehicle number"
                    value={formData.vehicleNumber}
                    onChange={(e) => handleChange("vehicleNumber", e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Save Form Template
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VisitorForm;
