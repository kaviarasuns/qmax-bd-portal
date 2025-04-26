"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchParams } from "next/navigation";

// Define the Company interface
interface Company {
  id: Id<"companyProspects">;
  name: string;
  website: string;
  status: CompanyStatus;
  notes: string;
}

// Use a type for valid status values
type CompanyStatus = "Pending" | "Approved" | "Rejected";

export function ManagerDashboardContent() {
  // Fetch companies from Convex
  const companyProspects =
    useQuery(api.myFunctions.listCompanyProspects, {}) || [];

  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  // Get the update mutations from Convex
  const updateCompanyProspectStatus = useMutation(
    api.myFunctions.updateCompanyProspectStatus,
  );
  const updateCompanyProspectNotes = useMutation(
    api.myFunctions.updateCompanyProspectNotes,
  );

  // Map Convex data to Company interface
  const companies: Company[] = companyProspects.map((prospect) => ({
    id: prospect._id,
    name: prospect.name,
    website: prospect.website,
    status: prospect.status as CompanyStatus,
    notes: prospect.notes || "",
  }));

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReview = (company: Company) => {
    setSelectedCompany(company);
    setNotes(company.notes);
    setIsDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedCompany) return;
    await updateCompanyProspectStatus({
      id: selectedCompany.id,
      status: "Approved",
      notes: notes,
    });
    setIsDialogOpen(false);
  };

  const handleReject = async () => {
    if (!selectedCompany) return;
    await updateCompanyProspectStatus({
      id: selectedCompany.id,
      status: "Rejected",
      notes: notes,
    });
    setIsDialogOpen(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedCompany) return;
    await updateCompanyProspectNotes({
      id: selectedCompany.id,
      notes: notes,
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Review</CardTitle>
            <CardDescription>Companies awaiting your decision</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {companies.filter((c) => c.status === "Pending").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Approved</CardTitle>
            <CardDescription>Companies youve approved</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {companies.filter((c) => c.status === "Approved").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Rejected</CardTitle>
            <CardDescription>Companies youve rejected</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {companies.filter((c) => c.status === "Rejected").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="detailedInfo">Detailed Info</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <ManagerCompanyTable
            companies={companies.filter((c) => c.status === "Pending")}
            onReview={handleReview}
          />
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <ManagerCompanyTable
            companies={companies.filter((c) => c.status === "Approved")}
            onReview={handleReview}
            showStatus={false}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <ManagerCompanyTable
            companies={companies.filter((c) => c.status === "Rejected")}
            onReview={handleReview}
            showStatus={false}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Company</DialogTitle>
            <DialogDescription>
              {selectedCompany && (
                <div className="mt-2">
                  <div className="mb-1">
                    <strong>Company:</strong> {selectedCompany.name}
                  </div>
                  <div>
                    <strong>Website:</strong>{" "}
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedCompany.website}
                    </a>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Research Notes
              </label>
              <Textarea
                id="notes"
                placeholder="Add your research notes about this company"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              {selectedCompany?.status === "Pending" && (
                <>
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={handleReject}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button type="button" onClick={handleApprove}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </>
              )}
              {selectedCompany?.status !== "Pending" && (
                <Button type="button" onClick={handleSaveNotes}>
                  Save Notes
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ManagerCompanyTableProps {
  companies: Company[];
  onReview: (company: Company) => void;
  showStatus?: boolean;
}

function ManagerCompanyTable({
  companies,
  onReview,
  showStatus = true,
}: ManagerCompanyTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Website</TableHead>
            {showStatus && <TableHead>Status</TableHead>}
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showStatus ? 5 : 4}
                className="text-center py-4 text-gray-500"
              >
                No companies found
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </TableCell>
                {showStatus && (
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        company.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : company.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {company.status}
                    </span>
                  </TableCell>
                )}
                <TableCell>
                  {company.notes ? (
                    <span className="line-clamp-1">{company.notes}</span>
                  ) : (
                    <span className="text-gray-400 italic">No notes</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReview(company)}
                  >
                    {company.status === "Pending" ? "Review" : "View Details"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
