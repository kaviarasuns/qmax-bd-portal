import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Company } from "./manager-dashboard";
import { Button } from "./ui/button";
import { useState } from "react";

interface ManagerCompanyTableProps {
  companies: Company[];
  onReview?: (company: Company) => void;
  showStatus?: boolean;
  showActions?: boolean;
  itemsPerPage?: number;
}

export function CompanyProspectsTable({
  companies,
  onReview = () => {},
  showStatus = true,
  showActions = false,
  itemsPerPage = 5,
}: ManagerCompanyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(companies.length / itemsPerPage);

  // Calculate current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = companies.slice(startIndex, endIndex);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Website</TableHead>
            {showStatus && <TableHead>Status</TableHead>}
            <TableHead>Notes</TableHead>
            <TableHead>Submitted By</TableHead>
            {showStatus && <TableHead>Reviewed By</TableHead>}
            {showActions && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  (showStatus ? 2 : 0) + (showActions ? 1 : 0) + 4 // Updated colspan to include reviewer column
                }
                className="text-center py-4 text-gray-500"
              >
                No companies found
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((company) => (
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
                            : company.status === "Submitted"
                              ? "bg-blue-100 text-blue-800"
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
                <TableCell>{company.submitterName || "Unknown"}</TableCell>
                {showStatus && (
                  <TableCell>
                    {(company.status === "Approved" ||
                      company.status === "Rejected") &&
                    company.approverName ? (
                      company.approverName
                    ) : (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </TableCell>
                )}
                {showActions && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5"
                      onClick={() => onReview(company)}
                    >
                      {company.status === "Pending" ? "Review" : "View Details"}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {companies.length > itemsPerPage && (
        <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
