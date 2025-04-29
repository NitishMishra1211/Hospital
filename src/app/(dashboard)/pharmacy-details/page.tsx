
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FlaskConical, Search, PlusCircle, Package, ListOrdered } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


// Mock data for demonstration
const mockInventory = [
  { id: 'med001', name: 'Paracetamol 500mg', stock: 1500, lowStockThreshold: 200, category: 'Pain Relief' },
  { id: 'med002', name: 'Amoxicillin 250mg', stock: 80, lowStockThreshold: 100, category: 'Antibiotic' },
  { id: 'med003', name: 'Lisinopril 10mg', stock: 600, lowStockThreshold: 150, category: 'Cardiovascular' },
  { id: 'med004', name: 'Salbutamol Inhaler', stock: 250, lowStockThreshold: 50, category: 'Respiratory' },
  { id: 'med005', name: 'Metformin 500mg', stock: 950, lowStockThreshold: 300, category: 'Diabetes' },
];

const mockPrescriptions = [
    { id: 'rx001', patientName: 'Alice Johnson', medication: 'Lisinopril 10mg', status: 'Pending', date: '2024-08-20' },
    { id: 'rx002', patientName: 'Bob Williams', medication: 'Amoxicillin 250mg', status: 'Ready', date: '2024-08-20' },
    { id: 'rx003', patientName: 'Charlie Brown', medication: 'Salbutamol Inhaler', status: 'Pending', date: '2024-08-21' },
];


export default function PharmacyDetailsPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const { toast } = useToast();

    const filteredInventory = mockInventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (action: string, medName?: string) => {
         toast({
            title: `Action: ${action}`,
            description: `${medName ? `Medication: ${medName}` : ''} (Simulation)`,
        });
    }

  return (
    <div className="space-y-6 lg:space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10 p-6">
           <div className="flex items-center gap-3">
            <FlaskConical className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Pharmacy Management</CardTitle>
          </div>
           <CardDescription className="text-muted-foreground pt-2">
              Manage inventory, prescriptions, and pharmacy operations.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">

           {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
                 <Button onClick={() => handleAction('New Prescription Entry')}>
                    <PlusCircle className="mr-2 h-4 w-4"/> New Prescription
                 </Button>
                 <Button variant="outline" onClick={() => handleAction('Restock Inventory')}>
                    <Package className="mr-2 h-4 w-4"/> Restock Inventory
                 </Button>
                 <Button variant="outline" onClick={() => handleAction('Generate Report')}>
                     <ListOrdered className="mr-2 h-4 w-4"/> Generate Report
                 </Button>
            </div>


           {/* Prescription Queue */}
           <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Prescription Queue</CardTitle>
                <CardDescription>View and manage pending and ready prescriptions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                   <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Medication</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPrescriptions.map((rx) => (
                          <TableRow key={rx.id}>
                            <TableCell>{rx.patientName}</TableCell>
                            <TableCell>{rx.medication}</TableCell>
                            <TableCell>{rx.date}</TableCell>
                            <TableCell>
                              <Badge variant={rx.status === 'Pending' ? 'destructive' : 'secondary'} className={rx.status === 'Ready' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                {rx.status}
                              </Badge>
                            </TableCell>
                             <TableCell>
                                <Button variant="link" size="sm" onClick={() => handleAction(rx.status === 'Pending' ? 'Dispense' : 'Mark as Collected', rx.medication)}>
                                    {rx.status === 'Pending' ? 'Dispense' : 'Collect'}
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </ScrollArea>
              </CardContent>
           </Card>


           {/* Inventory Management */}
           <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Inventory Overview</CardTitle>
                 <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search inventory (name, category)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full md:w-1/2 lg:w-1/3"
                        aria-label="Search pharmacy inventory"
                    />
                </div>
              </CardHeader>
              <CardContent>
                 <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Stock Level</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInventory.length > 0 ? filteredInventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                             <TableCell>{item.category}</TableCell>
                            <TableCell className="text-right">{item.stock}</TableCell>
                            <TableCell>
                              {item.stock <= item.lowStockThreshold ? (
                                <Badge variant="destructive">Low Stock</Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">In Stock</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                No inventory items match your search.
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
