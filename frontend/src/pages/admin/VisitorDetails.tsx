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
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getVisitorsApi } from "@/api/visitor";
import type { VisitorResponse } from "@/api/visitor";

const VisitorDetails = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<VisitorResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await getVisitorsApi();

      if (!res.success) {
        toast.error(res.message || "Failed to fetch visitors");
        return;
      }

      setVisitors(res.data);
    } catch (error) {
      console.error("Fetch visitors error:", error);
      toast.error("Failed to fetch visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const formatDateTime = (value?: string | null) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  const formatTotalTime = (minutes?: number | null) => {
    if (minutes == null) return "-";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs && mins) return `${hrs}h ${mins}m`;
    if (hrs) return `${hrs}h`;
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Visitor Records</CardTitle>
              <CardDescription>
                View all visitor entries submitted by Security
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchVisitors}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
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
                  {visitors.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6">
                        No visitors found
                      </TableCell>
                    </TableRow>
                  )}

                  {visitors.map((visitor) => (
                    <TableRow key={visitor._id}>
                      <TableCell className="font-medium">
                        {visitor.visitorNumber}
                      </TableCell>
                      <TableCell>{visitor.name}</TableCell>
                      <TableCell>{visitor.mobile}</TableCell>
                      <TableCell>
                        {visitor.contactPersonId.username} (
                        {visitor.contactPersonId.role})
                      </TableCell>
                      <TableCell>{visitor.purpose}</TableCell>
                      <TableCell>{visitor.numberOfPersons}</TableCell>
                      <TableCell>{visitor.vehicleNumber || "-"}</TableCell>
                      <TableCell>{formatDateTime(visitor.inTime)}</TableCell>
                      <TableCell>{formatDateTime(visitor.outTime)}</TableCell>
                      <TableCell>
                        {formatTotalTime(visitor.totalTimeSpent)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {loading && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6">
                        Loading visitors...
                      </TableCell>
                    </TableRow>
                  )}
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
