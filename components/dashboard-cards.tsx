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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Company } from "./manager-dashboard";

export function DashboardCards() {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  // Fetch companies from Convex
  const companyProspects =
    useQuery(api.myFunctions.listAllCompanyProspects, {}) || [];
  const addCompanyProspect = useMutation(api.myFunctions.addCompanyProspect);

  // Map Convex data to Company interface
  const companies: Company[] = companyProspects.map((prospect) => ({
    id: prospect._id,
    name: prospect.companyName,
    website: prospect.website,
    status: prospect.status as "Pending" | "Approved" | "Rejected",
    notes: prospect.notes || "",
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addCompanyProspect({
        companyName: companyName,
        website: companyWebsite,
        notes: "",
      });

      setCompanyName("");
      setCompanyWebsite("");
    } catch (error) {
      console.error("Failed to add company prospect:", error);
    }
  };

  return (
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
          <div className="grid grid-cols-2 gap-3">
            <StatCard value={companies.length} label="Total" />
            <StatCard
              value={companies.filter((c) => c.status === "Pending").length}
              label="Pending"
            />
            <StatCard
              value={companies.filter((c) => c.status === "Approved").length}
              label="Approved"
            />
            <StatCard
              value={companies.filter((c) => c.status === "Rejected").length}
              label="Rejected"
            />
          </div>
        </CardContent>
      </Card>
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
