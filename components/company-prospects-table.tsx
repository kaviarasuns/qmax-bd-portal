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
  itemsPerPage: initialItemsPerPage = 5,
}: ManagerCompanyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const totalPages = Math.ceil(companies.length / itemsPerPage);

  // Sorting logic
  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page on sort
  }

  function getSortIndicator(column: string) {
    const baseClass = "ml-1 text-xs";
    const inactiveClass = "text-gray-300";
    const activeClass = "text-gray-700 font-bold";
    if (sortColumn === column) {
      return (
        <span className={baseClass}>
          <span
            className={sortDirection === "asc" ? activeClass : inactiveClass}
          >
            ▲
          </span>
          <span
            className={sortDirection === "desc" ? activeClass : inactiveClass}
          >
            ▼
          </span>
        </span>
      );
    }
    // Not sorted: both arrows faint
    return <span className={baseClass + " " + inactiveClass}>▲▼</span>;
  }

  function sortCompanies(companies: Company[]) {
    if (!sortColumn) return companies;
    return [...companies].sort((a, b) => {
      let aValue = a[sortColumn as keyof Company];
      let bValue = b[sortColumn as keyof Company];
      // Handle undefined/null
      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";
      // Special handling for createdAt (date)
      if (sortColumn === "createdAt") {
        return sortDirection === "asc"
          ? new Date(aValue as string).getTime() -
              new Date(bValue as string).getTime()
          : new Date(bValue as string).getTime() -
              new Date(aValue as string).getTime();
      }
      // String comparison (case-insensitive)
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      // Fallback
      return 0;
    });
  }

  const sortedCompanies = sortCompanies(companies);

  // Calculate current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedCompanies.slice(startIndex, endIndex);

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
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("name")}
            >
              Company Name {getSortIndicator("name")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("website")}
            >
              Website {getSortIndicator("website")}
            </TableHead>
            {showStatus && (
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                Status {getSortIndicator("status")}
              </TableHead>
            )}
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("notes")}
            >
              Notes {getSortIndicator("notes")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("submitterName")}
            >
              Submitted By {getSortIndicator("submitterName")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("createdAt")}
            >
              Submitted At {getSortIndicator("createdAt")}
            </TableHead>
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
              <TableRow key={company.id} className="tr-hover-extra-dark">
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
      {/* Always show pagination controls, regardless of itemsPerPage vs companies.length */}
      <div className="flex items-center justify-between space-x-2 py-4 px-4 border-t">
        {/* Entries per page selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={itemsPerPage}
            onChange={(e) => {
              setCurrentPage(1);
              setItemsPerPage(Number(e.target.value));
            }}
            style={{ minWidth: 60 }}
          >
            {[5, 15, 20, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {/* Condensed pagination with ellipsis for large page counts */}
          <div className="flex items-center space-x-1">
            {(() => {
              const pages = [];
              // Always show first page
              if (totalPages <= 10) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                pages.push(1);
                // Show left ellipsis if needed
                if (currentPage > 4) {
                  pages.push("left-ellipsis");
                }
                // Show up to 2 pages before current
                for (
                  let i = Math.max(2, currentPage - 1);
                  i < currentPage;
                  i++
                ) {
                  pages.push(i);
                }
                // Show current page
                if (currentPage !== 1 && currentPage !== totalPages) {
                  pages.push(currentPage);
                }
                // Show up to 2 pages after current
                for (
                  let i = currentPage + 1;
                  i <= Math.min(totalPages - 1, currentPage + 1);
                  i++
                ) {
                  pages.push(i);
                }
                // Show right ellipsis if needed
                if (currentPage < totalPages - 3) {
                  pages.push("right-ellipsis");
                }
                // Always show last page
                if (totalPages > 1) {
                  pages.push(totalPages);
                }
              }
              return pages.map((page, idx) => {
                if (page === "left-ellipsis" || page === "right-ellipsis") {
                  return (
                    <span
                      key={page + idx}
                      className="px-1 text-gray-400 select-none"
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className={
                      page === currentPage
                        ? "font-bold bg-gray-200 text-black cursor-default"
                        : ""
                    }
                    onClick={() => setCurrentPage(page as number)}
                    disabled={page === currentPage}
                  >
                    {page}
                  </Button>
                );
              });
            })()}
          </div>
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
      </div>
    </div>
  );
}
