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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DashboardCards() {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [employees, setEmployees] = useState("");
  const [potentialNeeds, setPotentialNeeds] = useState("");
  const [industry, setIndustry] = useState("");
  const [notes, setNotes] = useState("");

  const addCompanyProspect = useMutation(api.myFunctions.addCompanyProspect);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addCompanyProspect({
        companyName,
        website: companyWebsite,
        headquarters,
        employees,
        potentialNeeds,
        industry,
        notes,
      });

      // Reset all form fields
      setCompanyName("");
      setCompanyWebsite("");
      setHeadquarters("");
      setEmployees("");
      setPotentialNeeds("");
      setIndustry("");
      setNotes("");
    } catch (error) {
      console.error("Failed to add company prospect:", error);
    }
  };

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Prospect</CardTitle>
          <CardDescription>
            Enter potential customer information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="headquarters">Headquarters</Label>
                <Input
                  id="headquarters"
                  placeholder="Company headquarters"
                  value={headquarters}
                  onChange={(e) => setHeadquarters(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  placeholder="e.g. 100-500"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="Company industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="potential-needs">Potential Needs</Label>
                <Input
                  id="potential-needs"
                  placeholder="Potential needs"
                  value={potentialNeeds}
                  onChange={(e) => setPotentialNeeds(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Additional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="w-full">
                  Add Company
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
