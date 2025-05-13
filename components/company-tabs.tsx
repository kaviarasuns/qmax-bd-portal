"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyProspectsTable } from "./company-prospects-table";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";

// Define the Company interface and status type
type CompanyStatus = "Pending" | "Approved" | "Rejected" | "Submitted";
interface Company {
  id: Id<"companyProspects">;
  name: string;
  website: string;
  status: CompanyStatus;
  notes: string;
  submitterName: string;
  approverName?: string;
  approverId?: string;
  approvedAt?: number;
}

export function CompanyTabs() {
  // Fetch companies from Convex
  const companyProspects =
    useQuery(api.myFunctions.listAllCompanyProspects, {}) || [];

  // Map Convex data to Company interface
  const companies: Company[] = companyProspects.map((prospect) => ({
    id: prospect._id,
    name: prospect.companyName,
    website: prospect.website,
    status: prospect.status as CompanyStatus,
    notes: prospect.notes || "",
    submitterName: prospect.submitterName || "Unknown",
    approverName: prospect.approverName,
    approverId: prospect.approverId,
    approvedAt: prospect.approvedAt,
  }));

  // Get current user information
  const currentUser = useQuery(api.myFunctions.getCurrentUserWithRoles);

  const updateCompanyProspectNotes = useMutation(
    api.myFunctions.updateCompanyProspectNotes,
  );

  // Get the update mutations from Convex
  const updateCompanyProspectStatus = useMutation(
    api.myFunctions.updateCompanyProspectStatus,
  );

  // Local state for review dialog
  const [notes, setNotes] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReview = (company: Company) => {
    setSelectedCompany(company);
    setIsDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedCompany) return;
    await updateCompanyProspectNotes({
      id: selectedCompany.id,
      notes: notes,
    });
    setIsDialogOpen(false);
  };

  const handleApprove = async () => {
    console.log("Current user:", currentUser);
    if (!selectedCompany || !currentUser?.user?._id || !currentUser.user.name)
      return;
    console.log("Approving company:", selectedCompany);
    await updateCompanyProspectStatus({
      id: selectedCompany.id,
      status: "Approved",
      notes: notes,
      approverName: currentUser.user.name,
      approverId: currentUser.user._id,
    });
    setIsDialogOpen(false);
  };

  const handleReject = async () => {
    if (!selectedCompany || !currentUser?.user?._id || !currentUser.user.name)
      return;
    await updateCompanyProspectStatus({
      id: selectedCompany.id,
      status: "Rejected",
      notes: notes,
      approverName: currentUser.user.name,
      approverId: currentUser.user._id,
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="mt-4">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Companies</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <CompanyProspectsTable
            companies={companies}
            onReview={handleReview}
            showStatus={true}
            showActions={true}
            itemsPerPage={15}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <CompanyProspectsTable
            companies={companies.filter((c) => c.status === "Pending")}
            onReview={handleReview}
            showStatus={true}
            showActions={true}
            itemsPerPage={15}
          />
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <CompanyProspectsTable
            companies={companies.filter((c) => c.status === "Approved")}
            onReview={handleReview}
            showStatus={true}
            showActions={true}
            itemsPerPage={15}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <CompanyProspectsTable
            companies={companies.filter((c) => c.status === "Rejected")}
            onReview={handleReview}
            showStatus={true}
            showActions={true}
            itemsPerPage={15}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Company</DialogTitle>
            <DialogDescription>
              {selectedCompany && (
                <span className="block mt-2">
                  <span className="block mb-1">
                    <strong>Company:</strong> {selectedCompany.name}
                  </span>
                  <span className="block mb-1">
                    <strong>Website:</strong>{" "}
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedCompany.website}
                    </a>
                  </span>
                  <span className="block mb-1">
                    <strong>Reviewed by:</strong>{" "}
                    {selectedCompany.approverName ? (
                      <>
                        {selectedCompany.approverName}
                        {selectedCompany.approvedAt && (
                          <span className="text-gray-500 text-sm ml-2">
                            (
                            {new Date(
                              selectedCompany.approvedAt,
                            ).toLocaleDateString()}
                            )
                          </span>
                        )}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </span>
                </span>
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
