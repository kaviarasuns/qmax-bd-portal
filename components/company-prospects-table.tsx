import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useState } from "react";
import { Company } from "./company-tabs";
import { CheckCircle, XCircle, Eye, FileEdit } from "lucide-react";

interface ManagerCompanyTableProps {
  companies: Company[];
  onReview?: (company: Company) => void;
  onApprove?: (company: Company) => void;
  onReject?: (company: Company) => void;
  showStatus?: boolean;
  showActions?: boolean;
  itemsPerPage?: number;
}

export function CompanyProspectsTable({
  companies,
  onReview = () => {},
  onApprove,
  onReject,
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

  function getFullUrl(website: string): string {
    if (!website) return "#";
    return website.startsWith("http://") || website.startsWith("https://")
      ? website
      : `https://${website}`;
  }

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
            <TableHead>Submitted At</TableHead>
            {showActions && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={(showStatus ? 2 : 0) + (showActions ? 1 : 0) + 4}
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
                    href={getFullUrl(company.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline max-w-[200px] inline-block truncate"
                    title={company.website}
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
                    <span
                      className="block max-w-[150px] truncate"
                      title={company.notes}
                    >
                      {company.notes}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">No notes</span>
                  )}
                </TableCell>

                <TableCell>{company.submitterName || "Unknown"}</TableCell>
                <TableCell>
                  {" "}
                  {company.createdAt
                    ? new Date(company.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7"
                        onClick={() => onReview(company)}
                        title={
                          company.status === "Pending"
                            ? "Review"
                            : "View Details"
                        }
                      >
                        {company.status === "Pending" ? (
                          <FileEdit className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>

                      {onApprove && (
                        <Button
                          variant={
                            company.status === "Approved"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className={`h-7 ${
                            company.status === "Approved"
                              ? "bg-green-600 hover:bg-green-700"
                              : "text-green-600 border-green-600 hover:bg-green-50"
                          }`}
                          onClick={() => onApprove(company)}
                          title={
                            company.status === "Approved"
                              ? "Already Approved"
                              : "Approve"
                          }
                          disabled={company.status === "Approved"}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}

                      {onReject && (
                        <Button
                          variant={
                            company.status === "Rejected"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className={`h-7 ${
                            company.status === "Rejected"
                              ? "bg-red-600 hover:bg-red-700"
                              : "text-red-600 border-red-600 hover:bg-red-50"
                          }`}
                          onClick={() => onReject(company)}
                          title={
                            company.status === "Rejected"
                              ? "Already Rejected"
                              : "Reject"
                          }
                          disabled={company.status === "Rejected"}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
