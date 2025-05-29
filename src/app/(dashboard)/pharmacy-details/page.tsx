
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FlaskConical, Search, PlusCircle, Package, ListOrdered, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { MedicalRecord } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Mock inventory data remains for the inventory section
const mockInventory = [
  { id: 'med001', name: 'Paracetamol 500mg', stock: 1500, lowStockThreshold: 200, category: 'Pain Relief' },
  { id: 'med002', name: 'Amoxicillin 250mg', stock: 80, lowStockThreshold: 100, category: 'Antibiotic' },
  { id: 'med003', name: 'Lisinopril 10mg', stock: 500, lowStockThreshold: 50, category: 'Antihypertensive' },
  { id: 'med004', name: 'Metformin 500mg', stock: 300, lowStockThreshold: 75, category: 'Antidiabetic' },
];

export default function PharmacyDetailsPage() {
    const [inventorySearchTerm, setInventorySearchTerm] = React.useState('');
    const { toast } = useToast();

    const [medicalRecords, setMedicalRecords] = React.useState<MedicalRecord[]>([]);
    const [isLoadingRecords, setIsLoadingRecords] = React.useState(true);
    const [recordsError, setRecordsError] = React.useState<string | null>(null);

    React.useEffect(() => {
      async function fetchMedicalRecords() {
        setIsLoadingRecords(true);
        setRecordsError(null);
        try {
          const response = await fetch('http://localhost:5223/api/MedicalRecords', {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          });
          if (!response.ok) {
            const errorText = await response.text().catch(() => `HTTP error! status: ${response.status}`);
             throw new Error(`Failed to fetch medical records. Status: ${response.status}. Response: ${errorText.substring(0,200)}...`);
          }
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const responseText = await response.text().catch(() => "Could not read response text.");
            throw new Error(`Expected JSON response for medical records, but got ${contentType || 'unknown'}. Response: ${responseText.substring(0,200)}...`);
          }
          const data: MedicalRecord[] = await response.json();
          setMedicalRecords(data);
        } catch (e: any) {
          console.error("Failed to fetch medical records:", e);
          setRecordsError(e.message || "An unexpected error occurred while fetching medical records.");
        } finally {
          setIsLoadingRecords(false);
        }
      }
      fetchMedicalRecords();
    }, []);


    const filteredInventory = mockInventory.filter(item =>
        item.name.toLowerCase().includes(inventorySearchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(inventorySearchTerm.toLowerCase()))
    );

    const handleAction = (action: string, details?: any) => {
        console.log("Pharmacy Action:", action, "Details:", details);
        toast({ title: `Action: ${action}`, description: `Details: ${JSON.stringify(details)} (Logged to console)` });
    };

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
           <div className="flex flex-wrap gap-2">
                 <Button onClick={() => handleAction('New Manual Prescription Entry')}>
                    <PlusCircle className="mr-2 h-4 w-4"/> New Prescription
                 </Button>
                 <Button variant="outline" onClick={() => handleAction('Restock Inventory Process')}>
                    <Package className="mr-2 h-4 w-4"/> Restock Inventory
                 </Button>
                 <Button variant="outline" onClick={() => handleAction('Generate Pharmacy Report')}>
                     <ListOrdered className="mr-2 h-4 w-4"/> Generate Report
                 </Button>
            </div>

           <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary/80" />
                    Prescriptions from Medical Records
                </CardTitle>
                <CardDescription>View prescriptions derived from patient medical records.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                   <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Record ID</TableHead>
                          <TableHead>Patient ID</TableHead>
                          <TableHead>Doctor ID</TableHead>
                          <TableHead>Diagnosis</TableHead>
                          <TableHead>Prescription</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingRecords ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={`skel-rx-${i}`}>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                </TableRow>
                            ))
                        ) : recordsError ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Error Fetching Prescriptions</AlertTitle>
                                        <AlertDescription>{recordsError}</AlertDescription>
                                    </Alert>
                                </TableCell>
                            </TableRow>
                        ) : medicalRecords.length > 0 ? (
                            medicalRecords.map((record) => (
                            <TableRow key={record.recordID}>
                                <TableCell><Badge variant="outline">{record.recordID}</Badge></TableCell>
                                <TableCell>{record.patientID}</TableCell>
                                <TableCell>{record.doctorID}</TableCell>
                                <TableCell>{record.diagnosis || 'N/A'}</TableCell>
                                <TableCell className="font-medium">{record.prescription || 'N/A'}</TableCell>
                                <TableCell>
                                    <Button variant="link" size="sm" onClick={() => handleAction('Dispense Prescription', { recordID: record.recordID, prescription: record.prescription })}>
                                        Dispense
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                No prescriptions found.
                                </TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                 </ScrollArea>
              </CardContent>
           </Card>

           <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Inventory Overview</CardTitle>
                 <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search inventory (name, category)..."
                        value={inventorySearchTerm}
                        onChange={(e) => setInventorySearchTerm(e.target.value)}
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
                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100/80">In Stock</Badge>
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
