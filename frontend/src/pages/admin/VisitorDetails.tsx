import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VisitorDetails = () => {
  const navigate = useNavigate();

  const visitors = [
    {
      id: 1,
      visitorNumber: "VN101",
      name: "John Doe",
      mobile: "9876543210",
      contactPerson: "Manager Smith",
      purpose: "Business Meeting",
      persons: 2,
      vehicle: "KA01AB1234",
      inTime: "2024-12-02 10:00 AM",
      outTime: "2024-12-02 12:30 PM",
      totalTime: "2h 30m",
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Records</CardTitle>
            <CardDescription>View all visitor entries submitted by Security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Persons</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>In Time</TableHead>
                    <TableHead>Out Time</TableHead>
                    <TableHead>Total Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">{visitor.visitorNumber}</TableCell>
                      <TableCell>{visitor.name}</TableCell>
                      <TableCell>{visitor.mobile}</TableCell>
                      <TableCell>{visitor.contactPerson}</TableCell>
                      <TableCell>{visitor.purpose}</TableCell>
                      <TableCell>{visitor.persons}</TableCell>
                      <TableCell>{visitor.vehicle}</TableCell>
                      <TableCell>{visitor.inTime}</TableCell>
                      <TableCell>{visitor.outTime}</TableCell>
                      <TableCell>{visitor.totalTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VisitorDetails;
