
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
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});

    const filteredPayments = mockPayments.filter(payment =>
        payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = async (action: string, details?: any) => {
        const actionKey = `${action}-${details?.invoiceId || details?.patientName || 'general'}`;
        setIsLoading(prev => ({...prev, [actionKey]: true}));

        try {
            let endpoint = '';
            let method = 'POST';
            let body = {};

            if (action === 'New Invoice Generation') {
                endpoint = '/api/invoices'; // Placeholder
                method = 'POST';
                body = { patientId: 'somePatientId', amount: 0, items: [] }; // Example body
                // In a real app, you'd open a modal to collect invoice details
                 await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                toast({ title: "Invoice Generated", description: "New invoice created successfully."});

            } else if (action === 'Download Payment Report') {
                endpoint = '/api/payments/report'; // Placeholder
                method = 'GET';
                // This would typically trigger a file download
                // For now, just a toast.
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                toast({ title: "Report Downloaded", description: "Payment report is being downloaded."});
                setIsLoading(prev => ({...prev, [actionKey]: false}));
                return;
            } else if (action === 'View Details') {
                // This might navigate or fetch more details
                toast({ title: "Viewing Details", description: `Loading details for ${details}` });
                console.log("View Details for:", details);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
                setIsLoading(prev => ({...prev, [actionKey]: false}));
                return;
            } else {
                 toast({ title: `Action: ${action}`, description: "Action performed." });
                 setIsLoading(prev => ({...prev, [actionKey]: false}));
                 return;
            }
            
            // Conceptual API Call (Example for New Invoice)
            if (endpoint && (method === 'POST' || method === 'PUT')) {
                const response = await fetch(endpoint, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                if (response.ok) {
                    toast({ title: `${action} Successful`, description: data.message || `${action} completed.` });
                } else {
                    toast({ variant: "destructive", title: `${action} Failed`, description: data.message || "An error occurred." });
                }
            }
        } catch (error) {
            console.error(`${action} error:`, error);
            toast({ variant: "destructive", title: "Error", description: `Could not perform ${action}.` });
        } finally {
            setIsLoading(prev => ({...prev, [actionKey]: false}));
        }
    };

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status.toLowerCase()) {
        case 'paid': return 'secondary';
        case 'pending': return 'outline';
        case 'overdue': return 'destructive';
        default: return 'default';
        }
    };

     const getStatusBadgeClass = (status: string): string => {
        switch (status.toLowerCase()) {
        case 'paid': return 'bg-green-100 text-green-800 hover:bg-green-100/80';
        case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80';
        case 'overdue': return 'bg-red-100 text-red-800 hover:bg-red-100/80';
        default: return '';
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
                     <Button onClick={() => handleAction('New Invoice Generation')} disabled={isLoading['New Invoice Generation-general']}>
                        <FilePlus className="mr-2 h-4 w-4"/> {isLoading['New Invoice Generation-general'] ? 'Generating...' : 'Generate Invoice'}
                     </Button>
                     <Button variant="outline" onClick={() => handleAction('Download Payment Report')} disabled={isLoading['Download Payment Report-general']}>
                        <Download className="mr-2 h-4 w-4" /> {isLoading['Download Payment Report-general'] ? 'Downloading...' : 'Download Report'}
                    </Button>
                 </div>
            </div>

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
                                <Button variant="link" size="sm" onClick={() => handleAction('View Details', payment.invoiceId)} disabled={isLoading[`View Details-${payment.invoiceId}`]}>
                                    {isLoading[`View Details-${payment.invoiceId}`] ? 'Loading...' : 'Details'}
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
    