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

interface ManagerCompanyTableProps {
  companies: Company[];
  onReview?: (company: Company) => void;
  showStatus?: boolean;
  showActions?: boolean; // Add this new prop
}

export function CompanyProspectsTable({
  companies,
  onReview = () => {},
  showStatus = true,
  showActions = false, // Add default value
}: ManagerCompanyTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Website</TableHead>
            {showStatus && <TableHead>Status</TableHead>}
            <TableHead>Notes</TableHead>
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
                  (showStatus ? 1 : 0) + (showActions ? 1 : 0) + 3 // Dynamically calculate colspan
                }
                className="text-center py-4 text-gray-500"
              >
                No companies found
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
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
                {showActions && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
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
    </div>
  );
}
