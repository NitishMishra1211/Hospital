
'use client';

import * as React from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import type { MedicalRecord, Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, User, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function PatientMedicalHistoryPage() {
  const params = useParams();
  const patientId = params.patientId as string;

  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = React.useState<MedicalRecord[]>([]);
  const [isLoadingPatient, setIsLoadingPatient] = React.useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = React.useState(true);
  const [patientError, setPatientError] = React.useState<string | null>(null);
  const [recordsError, setRecordsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!patientId) return;

    async function fetchPatientDetails() {
      setIsLoadingPatient(true);
      setPatientError(null);
      try {
        const response = await fetch(`http://localhost:5223/api/Patients/${patientId}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          const errorData = await response.json().catch(() => ({ message: `Failed to fetch patient details. Status: ${response.status}` }));
          throw new Error(errorData.message);
        }
        const data: Patient = await response.json();
        setPatient(data);
      } catch (e: any) {
        setPatientError(e.message || 'An unexpected error occurred while fetching patient details.');
      } finally {
        setIsLoadingPatient(false);
      }
    }

    async function fetchMedicalRecords() {
      setIsLoadingRecords(true);
      setRecordsError(null);
      try {
        // Assuming the API endpoint for a specific patient's records is /api/MedicalRecords/{patientId}
        // Adjust if your API uses a different pattern (e.g., /api/MedicalRecords?patientId={patientId})
        const response = await fetch(`http://localhost:5223/api/MedicalRecords/${patientId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Failed to fetch medical records. Status: ${response.status}` }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data: MedicalRecord[] = await response.json();
        setMedicalRecords(data);
      } catch (e: any) {
        setRecordsError(e.message || 'An unexpected error occurred while fetching medical records.');
      } finally {
        setIsLoadingRecords(false);
      }
    }

    fetchPatientDetails();
    fetchMedicalRecords();
  }, [patientId]);

  if (isLoadingPatient) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (patientError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Patient Details</AlertTitle>
        <AlertDescription>{patientError}</AlertDescription>
      </Alert>
    );
  }

  if (!patient) {
     // Should be caught by notFound earlier if API 404s for patient
    return <p>Patient not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/patient-details/${patientId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patient Details
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">
              Medical History for {patient.name} (PID: {patient.pid})
            </CardTitle>
          </div>
          <CardDescription>
            A summary of all medical records for this patient.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingRecords && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-md space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          )}
          {recordsError && !isLoadingRecords && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Medical Records</AlertTitle>
              <AlertDescription>{recordsError}</AlertDescription>
            </Alert>
          )}
          {!isLoadingRecords && !recordsError && medicalRecords.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No medical records found for this patient.
            </p>
          )}
          {!isLoadingRecords && !recordsError && medicalRecords.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Appointment ID</TableHead>
                  <TableHead>Doctor ID</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Prescription</TableHead>
                  <TableHead>Test Results</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicalRecords.map((record) => (
                  <TableRow key={record.recordID}>
                    <TableCell><Badge variant="outline">{record.recordID}</Badge></TableCell>
                    <TableCell>{record.appointmentID || 'N/A'}</TableCell>
                    <TableCell>{record.doctorID || 'N/A'}</TableCell>
                    <TableCell>{record.diagnosis || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{record.prescription || 'N/A'}</TableCell>
                    <TableCell>{record.testResults || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
