"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

type Contact = {
  email: string;
  linkedIn: string;
};

type CompanyData = {
  id: string;
  companyName: string;
  website: string;
  linkedIn: string;
  country: string;
  headquarters: string;
  companyType: string;
  industry: string;
  endProduct: string;
  employees: string;
  ceoName: string;
  ceoLinkedIn: string;
  ceoEmail: string;
  phoneNumber: string;
  fundingStage: string;
  rdLocations: string;
  potentialNeeds: string;
  contacts: Contact[];
  notes: string;
  dateTime: string | Date;
};

// Dummy data for multiple companies
const dummyCompanies: CompanyData[] = [
  {
    id: "1",
    companyName: "TechInnovate Solutions",
    website: "https://techinnovate.example.com",
    linkedIn: "https://linkedin.com/company/techinnovate",
    country: "United States",
    headquarters: "San Francisco, CA, USA",
    companyType: "Private",
    industry: "Software Development & IoT",
    endProduct:
      "Enterprise software solutions and IoT devices for smart manufacturing",
    employees: "250-500",
    ceoName: "Alexandra Chen",
    ceoLinkedIn: "https://linkedin.com/in/alexandra-chen",
    ceoEmail: "alexandra.chen@techinnovate.example.com",
    phoneNumber: "+1 (415) 555-7890",
    fundingStage: "Series B",
    rdLocations: "San Francisco (HQ), Boston, Singapore",
    potentialNeeds: "Hardware Design, Firmware Development, Manufacturing",
    contacts: [
      {
        email: "michael.rodriguez@techinnovate.example.com",
        linkedIn: "https://linkedin.com/in/michael-rodriguez",
      },
      {
        email: "sarah.patel@techinnovate.example.com",
        linkedIn: "https://linkedin.com/in/sarah-patel",
      },
      {
        email: "david.kim@techinnovate.example.com",
        linkedIn: "https://linkedin.com/in/david-kim",
      },
    ],
    notes:
      "Company is rapidly expanding into Asian markets. Looking for hardware partners for their next generation of IoT devices. Potential for long-term collaboration on multiple product lines.",
    dateTime: new Date("2023-11-15T14:30:00"),
  },
  {
    id: "2",
    companyName: "MediHealth Innovations",
    website: "https://medihealth.example.org",
    linkedIn: "https://linkedin.com/company/medihealth-innovations",
    country: "Germany",
    headquarters: "Munich, Germany",
    companyType: "Public",
    industry: "Medical Devices & Healthcare",
    endProduct: "Advanced diagnostic equipment and patient monitoring systems",
    employees: "1000-2000",
    ceoName: "Hans Mueller",
    ceoLinkedIn: "https://linkedin.com/in/hans-mueller",
    ceoEmail: "hans.mueller@medihealth.example.org",
    phoneNumber: "+49 89 1234567",
    fundingStage: "Public (Listed on Frankfurt Stock Exchange)",
    rdLocations: "Munich (HQ), Berlin, Zurich, Boston",
    potentialNeeds: "PCB Design, Firmware, Hardware Testing",
    contacts: [
      {
        email: "julia.schmidt@medihealth.example.org",
        linkedIn: "https://linkedin.com/in/julia-schmidt",
      },
      {
        email: "thomas.weber@medihealth.example.org",
        linkedIn: "https://linkedin.com/in/thomas-weber",
      },
      {
        email: "anna.fischer@medihealth.example.org",
        linkedIn: "https://anna-fischer",
      },
      {
        email: "markus.bauer@medihealth.example.org",
        linkedIn: "https://linkedin.com/in/markus-bauer",
      },
    ],
    notes:
      "Looking to expand their product line with more portable diagnostic devices. Interested in miniaturization technologies and low-power solutions.",
    dateTime: new Date("2023-10-22T09:15:00"),
  },
  {
    id: "3",
    companyName: "GreenEarth Robotics",
    website: "https://greenearth-robotics.example.net",
    linkedIn: "https://linkedin.com/company/greenearth-robotics",
    country: "Japan",
    headquarters: "Tokyo, Japan",
    companyType: "Startup",
    industry: "Agricultural Technology & Robotics",
    endProduct:
      "Autonomous farming robots and environmental monitoring systems",
    employees: "50-100",
    ceoName: "Haruki Tanaka",
    ceoLinkedIn: "https://linkedin.com/in/haruki-tanaka",
    ceoEmail: "h.tanaka@greenearth-robotics.example.net",
    phoneNumber: "+81 3 1234 5678",
    fundingStage: "Series A",
    rdLocations: "Tokyo (HQ), Osaka, Silicon Valley",
    potentialNeeds: "Mechanical Design, ID, PCB Design, Manufacturing",
    contacts: [
      {
        email: "yuki.sato@greenearth-robotics.example.net",
        linkedIn: "https://linkedin.com/in/yuki-sato",
      },
      {
        email: "kenji.watanabe@greenearth-robotics.example.net",
        linkedIn: "https://linkedin.com/in/kenji-watanabe",
      },
    ],
    notes:
      "Focused on sustainable agriculture solutions. Currently developing next-gen robots that can work in various weather conditions. Seeking partners for ruggedized electronics design.",
    dateTime: new Date("2023-12-05T16:45:00"),
  },
];

enum ViewMode {
  LIST = 0,
  DETAIL = 1,
}

export default function ViewProspects() {
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        // Convert date string back to formatted date
        if (parsedData.dateTime) {
          parsedData.dateTime = new Date(parsedData.dateTime);
        }
        // Add the new submission to our dummy data with a unique ID
        const newCompany = {
          ...parsedData,
          id: `new-${Date.now()}`,
        };
        const allCompanies = [...dummyCompanies, newCompany];
        setCompanies(allCompanies);
        setFilteredCompanies(allCompanies);
        // Select the newly added company
        setSelectedCompanyId(newCompany.id);
        setViewMode(ViewMode.DETAIL);
      } catch (error) {
        console.error("Error parsing data:", error);
        setCompanies(dummyCompanies);
        setFilteredCompanies(dummyCompanies);
      }
    } else {
      // If no data is provided, use dummy data
      setCompanies(dummyCompanies);
      setFilteredCompanies(dummyCompanies);
    }
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = companies.filter(
        (company) =>
          company.companyName.toLowerCase().includes(query) ||
          company.industry.toLowerCase().includes(query) ||
          company.country.toLowerCase().includes(query) ||
          company.ceoName.toLowerCase().includes(query),
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  const selectedCompany = selectedCompanyId
    ? companies.find((company) => company.id === selectedCompanyId)
    : null;

  const handleCompanySelect = (id: string) => {
    setSelectedCompanyId(id);
    setViewMode(ViewMode.DETAIL);
  };

  const navigateToNextCompany = () => {
    if (!selectedCompanyId) return;

    const currentIndex = companies.findIndex(
      (company) => company.id === selectedCompanyId,
    );
    if (currentIndex < companies.length - 1) {
      setSelectedCompanyId(companies[currentIndex + 1].id);
    }
  };

  const navigateToPreviousCompany = () => {
    if (!selectedCompanyId) return;

    const currentIndex = companies.findIndex(
      (company) => company.id === selectedCompanyId,
    );
    if (currentIndex > 0) {
      setSelectedCompanyId(companies[currentIndex - 1].id);
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
                        <TableRow key={company.id}>
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
                          <TableCell>
                            {company.dateTime instanceof Date
                              ? format(company.dateTime, "MMM d, yyyy")
                              : format(
                                  new Date(company.dateTime),
                                  "MMM d, yyyy",
                                )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompanySelect(company.id)}
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
                  companies.findIndex((c) => c.id === selectedCompanyId) === 0
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Company{" "}
                {companies.findIndex((c) => c.id === selectedCompanyId) + 1} of{" "}
                {companies.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={navigateToNextCompany}
                disabled={
                  companies.findIndex((c) => c.id === selectedCompanyId) ===
                  companies.length - 1
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Submitted on{" "}
              {selectedCompany.dateTime instanceof Date
                ? format(selectedCompany.dateTime, "MMMM d, yyyy 'at' h:mm a")
                : format(
                    new Date(selectedCompany.dateTime),
                    "MMMM d, yyyy 'at' h:mm a",
                  )}
            </div>
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
                        {index < selectedCompany.contacts.length - 1 && (
                          <Separator className="my-3" />
                        )}
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
