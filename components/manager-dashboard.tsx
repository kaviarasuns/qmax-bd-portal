"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { CompanyProspectsTable } from "./company-prospects-table";
import { DashboardCards } from "./dashboard-cards";

// Define the Company interface
export interface Company {
  id: Id<"companyProspects">;
  name: string;
  website: string;
  status: CompanyStatus;
  notes: string;
}

// Use a type for valid status values
type CompanyStatus = "Pending" | "Approved" | "Rejected" | "Submitted";

export function ManagerDashboardContent() {
  // Fetch companies from Convex
  const companyProspects =
    useQuery(api.myFunctions.listAllCompanyProspects, {}) || [];

  // const searchParams = useSearchParams();
  // const currentTab = searchParams.get("tab");

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
    name: prospect.companyName,
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

      <DashboardCards />

      <Tabs defaultValue="all" className="mt-8">
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
            showActions={true} // Show actions for all companies
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <CompanyProspectsTable
            companies={companies.filter((c) => c.status === "Pending")}
            onReview={handleReview}
            showStatus={true}
            showActions={true} // Show actions for pending companies
          />
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <CompanyProspectsTable
            companies={companies.filter((c) => c.status === "Approved")}
            onReview={handleReview}
            showStatus={true}
            showActions={true} // Show actions for approved companies
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <CompanyProspectsTable
            companies={companies.filter((c) => c.status === "Rejected")}
            onReview={handleReview}
            showStatus={true}
            showActions={true} // Show actions for rejected companies
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
                  <span className="block">
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

// function ManagerCompanyTable({
//   companies,
//   onReview,
//   showStatus = true,
//   showActions = true, // Add default value
// }: ManagerCompanyTableProps) {
//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Company Name</TableHead>
//             <TableHead>Website</TableHead>
//             {showStatus && <TableHead>Status</TableHead>}
//             <TableHead>Notes</TableHead>
//             {showActions && (
//               <TableHead className="text-right">Actions</TableHead>
//             )}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {companies.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={
//                   (showStatus ? 1 : 0) + (showActions ? 1 : 0) + 3 // Dynamically calculate colspan
//                 }
//                 className="text-center py-4 text-gray-500"
//               >
//                 No companies found
//               </TableCell>
//             </TableRow>
//           ) : (
//             companies.map((company) => (
//               <TableRow key={company.id}>
//                 <TableCell className="font-medium">{company.name}</TableCell>
//                 <TableCell>
//                   <a
//                     href={company.website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     {company.website}
//                   </a>
//                 </TableCell>
//                 {showStatus && (
//                   <TableCell>
//                     <span
//                       className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                         company.status === "Approved"
//                           ? "bg-green-100 text-green-800"
//                           : company.status === "Rejected"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {company.status}
//                     </span>
//                   </TableCell>
//                 )}
//                 <TableCell>
//                   {company.notes ? (
//                     <span className="line-clamp-1">{company.notes}</span>
//                   ) : (
//                     <span className="text-gray-400 italic">No notes</span>
//                   )}
//                 </TableCell>
//                 {showActions && (
//                   <TableCell className="text-right">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => onReview(company)}
//                     >
//                       {company.status === "Pending" ? "Review" : "View Details"}
//                     </Button>
//                   </TableCell>
//                 )}
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

{
  /* <div className="grid gap-6 md:grid-cols-3 mb-8">
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
</div> */
}
