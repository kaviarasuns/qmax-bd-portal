"use client";

import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CompanyProspectsTable } from "./company-prospects-table";
import { DashboardCards } from "./dashboard-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the Company interface
interface Company {
  id: Id<"companyProspects">; // Update to use Convex ID type
  name: string;
  website: string;
  status: "Pending" | "Approved" | "Rejected";
  notes: string; // Add this field
  submitterName: string; // Add this field
  createdAt: number;
}
export function ExecutiveDashboardContent() {
  // Fetch companies from Convex
  const companyProspects =
    useQuery(api.myFunctions.listAllCompanyProspects, {}) || [];

  // Map Convex data to Company interface
  const companies: Company[] = companyProspects.map((prospect) => ({
    id: prospect._id,
    name: prospect.companyName,
    website: prospect.website,
    status: prospect.status as "Pending" | "Approved" | "Rejected",
    notes: prospect.notes || "", // Add this field
    submitterName: prospect.submitterName || "Unknown", // Add this field
    createdAt: prospect.createdAt,
  }));

  // Get the addCompanyProspect mutation

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">Executive Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCards />

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Submission Stats</CardTitle>
              <CardDescription>
                Overview of your prospect submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <StatCard value={companies.length} label="Total" />
                <StatCard
                  value={companies.filter((c) => c.status === "Pending").length}
                  label="Pending"
                />
                <StatCard
                  value={
                    companies.filter((c) => c.status === "Approved").length
                  }
                  label="Approved"
                />
                <StatCard
                  value={
                    companies.filter((c) => c.status === "Rejected").length
                  }
                  label="Rejected"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Companies</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <CompanyProspectsTable companies={companies} />
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                <CompanyProspectsTable
                  companies={companies.filter((c) => c.status === "Pending")}
                />
              </TabsContent>
              <TabsContent value="approved" className="mt-4">
                <CompanyProspectsTable
                  companies={companies.filter((c) => c.status === "Approved")}
                />
              </TabsContent>
              <TabsContent value="rejected" className="mt-4">
                <CompanyProspectsTable
                  companies={companies.filter((c) => c.status === "Rejected")}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border p-4">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

// function CompanyTable({ companies }: { companies: Company[] }) {
//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Company Name</TableHead>
//             <TableHead>Website</TableHead>
//             <TableHead>Status</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {companies.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={3} className="text-center py-4 text-gray-500">
//                 No companies found
//               </TableCell>
//             </TableRow>
//           ) : (
//             companies.map((company) => (
//               <TableRow key={company.id}>
//                 <TableCell>{company.name}</TableCell>
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
//                 <TableCell>
//                   <span
//                     className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                       company.status === "Approved"
//                         ? "bg-green-100 text-green-800"
//                         : company.status === "Rejected"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {company.status}
//                   </span>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
