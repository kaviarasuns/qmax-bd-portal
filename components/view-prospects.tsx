"use client";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building,
  ChevronLeft,
  ChevronRight,
  Globe,
  Linkedin,
  Mail,
  Phone,
  Search,
  Filter,
  Calendar,
  MapPin,
  Briefcase,
  ArrowLeft,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";

enum ViewMode {
  LIST = 0,
  DETAIL = 1,
}

const formatDate = (dateTime: number | undefined) => {
  if (!dateTime) return "N/A";
  return format(new Date(dateTime), "MMM d, yyyy");
};

// const formatDateTime = (dateTime: number | undefined) => {
//   if (!dateTime) return "N/A";
//   return format(new Date(dateTime), "MMMM d, yyyy 'at' h:mm a");
// };

export default function ViewProspects() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Replace the dummy data with Convex query
  const companies =
    useQuery(api.myFunctions.listCompanyProspects, {
      limit: 50,
    }) || [];

  // Filter companies based on search query
  const filteredCompanies = companies;

  // Update loading state to use Convex query status
  const loading = companies === undefined;

  const selectedCompany = selectedCompanyId
    ? companies.find((company) => company._id === selectedCompanyId)
    : null;

  const handleCompanySelect = (id: string) => {
    setSelectedCompanyId(id);
    setViewMode(ViewMode.DETAIL);
  };

  const navigateToNextCompany = () => {
    if (!selectedCompanyId) return;

    const currentIndex = companies.findIndex(
      (company) => company._id === selectedCompanyId,
    );
    if (currentIndex < companies.length - 1) {
      setSelectedCompanyId(companies[currentIndex + 1]._id);
    }
  };

  const navigateToPreviousCompany = () => {
    if (!selectedCompanyId) return;

    const currentIndex = companies.findIndex(
      (company) => company._id === selectedCompanyId,
    );
    if (currentIndex > 0) {
      setSelectedCompanyId(companies[currentIndex - 1]._id);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Fetching company information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Company Submissions</h1>
          <p className="text-muted-foreground mt-1">
            {filteredCompanies.length}{" "}
            {filteredCompanies.length === 1 ? "company" : "companies"} in
            database
          </p>
        </div>
        <div className="flex gap-2">
          {viewMode === ViewMode.DETAIL && (
            <Button
              variant="outline"
              onClick={() => {
                setViewMode(ViewMode.LIST);
                setSelectedCompanyId(null);
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
          )}
        </div>
      </div>

      {viewMode === ViewMode.LIST ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Company Type</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map((company) => (
                        <TableRow key={company._id}>
                          <TableCell className="font-medium">
                            {company.companyName}
                          </TableCell>
                          <TableCell>{company.industry}</TableCell>
                          <TableCell>{company.country}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {company.companyType}
                            </Badge>
                          </TableCell>
                          <TableCell>{company.employees}</TableCell>
                          <TableCell>{formatDate(company.dateTime)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompanySelect(company._id)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No companies found matching your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredCompanies.length} of {companies.length}{" "}
                companies
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled={true}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled={true}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </>
      ) : selectedCompany ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={navigateToPreviousCompany}
                disabled={
                  companies.findIndex((c) => c._id === selectedCompanyId) === 0
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Company{" "}
                {companies.findIndex((c) => c._id === selectedCompanyId) + 1} of{" "}
                {companies.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={navigateToNextCompany}
                disabled={
                  companies.findIndex((c) => c._id === selectedCompanyId) ===
                  companies.length - 1
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {/* <div className="text-sm text-muted-foreground">
              Submitted on {formatDateTime(selectedCompany.dateTime)}
            </div> */}
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {selectedCompany.companyName}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {selectedCompany.companyType}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {selectedCompany.country}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {selectedCompany.employees} Employees
              </Badge>
              {selectedCompany.fundingStage && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {selectedCompany.fundingStage}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Website
                  </h3>
                  <p className="text-lg">
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-4 w-4" />
                      {selectedCompany.website}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    LinkedIn URL
                  </h3>
                  <p className="text-lg">
                    <a
                      href={selectedCompany.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Linkedin className="h-4 w-4" />
                      Company Profile
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Headquarters
                  </h3>
                  <p className="text-lg">{selectedCompany.headquarters}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Industry / Sector
                  </h3>
                  <p className="text-lg">{selectedCompany.industry}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    End Product / Services
                  </h3>
                  <p className="text-lg">{selectedCompany.endProduct}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    R&D / Design Locations
                  </h3>
                  <p className="text-lg">
                    {selectedCompany.rdLocations || "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Potential Needs
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedCompany.potentialNeeds
                      ? selectedCompany.potentialNeeds
                          .split(/[,/]/)
                          .map((need, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-sm"
                            >
                              {need.trim()}
                            </Badge>
                          ))
                      : "N/A"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CEO Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    CEO Name
                  </h3>
                  <p className="text-lg font-medium">
                    {selectedCompany.ceoName}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    CEO LinkedIn
                  </h3>
                  <p className="text-lg">
                    <a
                      href={selectedCompany.ceoLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Linkedin className="h-4 w-4" />
                      View Profile
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    CEO Email
                  </h3>
                  <p className="text-lg flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {selectedCompany.ceoEmail}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Phone Number
                  </h3>
                  <p className="text-lg flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {selectedCompany.phoneNumber}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-md">
                  <p className="whitespace-pre-line">
                    {selectedCompany.notes || "No additional notes provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedCompany.contacts &&
                  selectedCompany.contacts.length > 0 ? (
                    selectedCompany.contacts.map((contact, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="font-medium">Contact {index + 1}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{contact.email}</span>
                        </div>
                        <div>
                          <a
                            href={contact.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                          >
                            <Linkedin className="h-3 w-3" />
                            LinkedIn Profile
                          </a>
                        </div>
                        {/* {index < selectedCompany.contacts.length - 1 && (
                          <Separator className="my-3" />
                        )} */}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No contacts provided
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Follow-up
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Export as PDF</Button>
              <Button variant="default">Edit Information</Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">No company selected</h2>
          <p className="text-muted-foreground mb-4">
            Please select a company from the list to view details
          </p>
          <Button onClick={() => setViewMode(ViewMode.LIST)}>
            View Company List
          </Button>
        </div>
      )}
    </div>
  );
}

// useEffect(() => {
//   const data = searchParams.get("data");

//   if (data) {
//     try {
//       const parsedData = JSON.parse(decodeURIComponent(data));

//       // Convert date string back to formatted date

//       if (parsedData.dateTime) {
//         parsedData.dateTime = new Date(parsedData.dateTime);
//       }

//       // Add the new submission to our dummy data with a unique ID

//       const newCompany = {
//         ...parsedData,

//         id: `new-${Date.now()}`,
//       };

//       const allCompanies = [...dummyCompanies, newCompany];

//       setCompanies(allCompanies);

//       setFilteredCompanies(allCompanies);

//       // Select the newly added company

//       setSelectedCompanyId(newCompany.id);

//       setViewMode(ViewMode.DETAIL);
//     } catch (error) {
//       console.error("Error parsing data:", error);

//       setCompanies(dummyCompanies);

//       setFilteredCompanies(dummyCompanies);
//     }
//   } else {
//     // If no data is provided, use dummy data

//     setCompanies(dummyCompanies);

//     setFilteredCompanies(dummyCompanies);
//   }

//   setLoading(false);
// }, [searchParams]);
