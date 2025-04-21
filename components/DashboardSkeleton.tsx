import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function ManagerDashboardSkeleton() {
  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      {/* Dashboard cards skeleton */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs skeleton */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" disabled>
            Pending Review
          </TabsTrigger>
          <TabsTrigger value="approved" disabled>
            Approved Companies
          </TabsTrigger>
          <TabsTrigger value="rejected" disabled>
            Rejected Companies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <ManagerCompanyTableSkeleton />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ManagerCompanyTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-20 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
