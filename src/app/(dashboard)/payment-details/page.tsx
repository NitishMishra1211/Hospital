
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreditCard, Search, Download, FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockPayments = [
  { id: 'pay001', patientName: 'Alice Johnson', invoiceId: 'INV-123', amount: 150.00, date: '2024-08-10', status: 'Paid' },
  { id: 'pay002', patientName: 'Bob Williams', invoiceId: 'INV-124', amount: 75.50, date: '2024-08-11', status: 'Pending' },
  { id: 'pay003', patientName: 'Charlie Brown', invoiceId: 'INV-125', amount: 220.00, date: '2024-08-12', status: 'Paid' },
  { id: 'pay004', patientName: 'Diana Prince', invoiceId: 'INV-126', amount: 50.00, date: '2024-08-13', status: 'Overdue' },
  { id: 'pay005', patientName: 'Ethan Hunt', invoiceId: 'INV-127', amount: 300.00, date: '2024-08-14', status: 'Paid' },
];

export default function PaymentDetailsPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const { toast } = useToast();

    const filteredPayments = mockPayments.filter(payment =>
        payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

     const handleAction = (action: string, details?: string) => {
         toast({
            title: `Action: ${action}`,
            description: `${details ? `Details: ${details}` : ''} (Simulation)`,
        });
    }

    // Function to determine badge variant based on status
    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status.toLowerCase()) {
        case 'paid':
            return 'secondary'; // Using secondary for paid, often green-ish
        case 'pending':
            return 'outline'; // Outline for pending, often blue/yellow
        case 'overdue':
            return 'destructive'; // Destructive for overdue, typically red
        default:
            return 'default';
        }
    };

     const getStatusBadgeClass = (status: string): string => {
        switch (status.toLowerCase()) {
        case 'paid':
            return 'bg-green-100 text-green-800 hover:bg-green-100/80';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80';
        case 'overdue':
             return 'bg-red-100 text-red-800 hover:bg-red-100/80'; // No need for destructive variant class here
        default:
            return '';
        }
    };

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10 p-6">
           <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Payment Details</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground pt-2">
              View and manage patient payments and invoices.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
                 <div className="relative flex-grow w-full sm:w-auto max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search payments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full"
                        aria-label="Search payments by patient, invoice, or status"
                    />
                </div>
                 <div className="flex gap-2 flex-wrap">
                     <Button onClick={() => handleAction('New Invoice Generation')}>
                        <FilePlus className="mr-2 h-4 w-4"/> Generate Invoice
                     </Button>
                     <Button variant="outline" onClick={() => handleAction('Download Payment Report')}>
                        <Download className="mr-2 h-4 w-4" /> Download Report
                    </Button>
                 </div>
            </div>

           {/* Payment History Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                 <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead className="text-right">Amount ($)</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayments.length > 0 ? filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.patientName}</TableCell>
                            <TableCell>{payment.invoiceId}</TableCell>
                            <TableCell className="text-right">{payment.amount.toFixed(2)}</TableCell>
                             <TableCell>{payment.date}</TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(payment.status)}
                                className={getStatusBadgeClass(payment.status)}
                              >
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                                <Button variant="link" size="sm" onClick={() => handleAction('View Details', `Invoice ${payment.invoiceId}`)}>
                                    Details
                                </Button>
                            </TableCell>
                          </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                No payment records found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                 </ScrollArea>
              </CardContent>
           </Card>

        </CardContent>
      </Card>
    </div>
  );
}
