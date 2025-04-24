"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Define the Company interface
interface Company {
  id: Id<"companyProspects">; // Update to use Convex ID type
  name: string;
  website: string;
  status: "Pending" | "Approved" | "Rejected";
}
export function ExecutiveDashboardContent() {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  // Fetch companies from Convex
  const companyProspects =
    useQuery(api.myFunctions.listCompanyProspects, {}) || [];

  // Map Convex data to Company interface
  const companies: Company[] = companyProspects.map((prospect) => ({
    id: prospect._id,
    name: prospect.name,
    website: prospect.website,
    status: prospect.status as "Pending" | "Approved" | "Rejected",
  }));

  // Get the addCompanyProspect mutation
  const addCompanyProspect = useMutation(api.myFunctions.addCompanyProspect);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the Convex mutation to add the company to the database
      await addCompanyProspect({
        name: companyName,
        website: companyWebsite,
        notes: "", // Optional field, can be added to form if needed
      });

      // No need to manually update state - Convex will refresh the data
      setCompanyName("");
      setCompanyWebsite("");
    } catch (error) {
      console.error("Failed to add company prospect:", error);
      // You could add error handling UI here
    }
  };

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">Executive Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Prospect</CardTitle>
            <CardDescription>
              Enter potential customer information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-website">Company Website</Label>
                <Input
                  id="company-website"
                  placeholder="https://example.com"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Add Company</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission Stats</CardTitle>
            <CardDescription>
              Overview of your prospect submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <span className="text-2xl font-bold">
                  {companies.filter((c) => c.status === "Pending").length}
                </span>
                <span className="text-sm text-gray-500">Pending</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <span className="text-2xl font-bold">
                  {companies.filter((c) => c.status === "Approved").length}
                </span>
                <span className="text-sm text-gray-500">Approved</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <span className="text-2xl font-bold">
                  {companies.filter((c) => c.status === "Rejected").length}
                </span>
                <span className="text-sm text-gray-500">Rejected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Companies</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <CompanyTable companies={companies} />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <CompanyTable
              companies={companies.filter((c) => c.status === "Pending")}
            />
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            <CompanyTable
              companies={companies.filter((c) => c.status === "Approved")}
            />
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            <CompanyTable
              companies={companies.filter((c) => c.status === "Rejected")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CompanyTable({ companies }: { companies: Company[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                No companies found
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
