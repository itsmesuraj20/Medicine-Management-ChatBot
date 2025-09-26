import React, { useState, useCallback } from 'react';
import {
    DocumentTextIcon,
    CameraIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    PrinterIcon,
    QrCodeIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface Prescription {
    id: string;
    patientName: string;
    patientId: string;
    doctorName: string;
    doctorId: string;
    medications: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions: string;
        quantity: number;
    }[];
    dateIssued: Date;
    dateExpires: Date;
    status: 'pending' | 'processing' | 'ready' | 'dispensed' | 'expired';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    notes?: string;
    insuranceInfo?: {
        provider: string;
        policyNumber: string;
        copay: number;
    };
}

const SmartPrescriptionManager: React.FC = () => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([
        {
            id: 'RX001',
            patientName: 'John Doe',
            patientId: 'PT001',
            doctorName: 'Dr. Sarah Wilson',
            doctorId: 'DR001',
            medications: [
                {
                    name: 'Metformin 500mg',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    duration: '30 days',
                    instructions: 'Take with meals',
                    quantity: 60
                },
                {
                    name: 'Lisinopril 10mg',
                    dosage: '10mg',
                    frequency: 'Once daily',
                    duration: '30 days',
                    instructions: 'Take in the morning',
                    quantity: 30
                }
            ],
            dateIssued: new Date('2024-01-15'),
            dateExpires: new Date('2024-04-15'),
            status: 'ready',
            priority: 'normal',
            insuranceInfo: {
                provider: 'Blue Cross',
                policyNumber: 'BC123456789',
                copay: 15
            }
        },
        {
            id: 'RX002',
            patientName: 'Jane Smith',
            patientId: 'PT002',
            doctorName: 'Dr. Michael Brown',
            doctorId: 'DR002',
            medications: [
                {
                    name: 'Amoxicillin 500mg',
                    dosage: '500mg',
                    frequency: 'Three times daily',
                    duration: '7 days',
                    instructions: 'Take with food, complete full course',
                    quantity: 21
                }
            ],
            dateIssued: new Date(),
            dateExpires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            status: 'processing',
            priority: 'high',
            notes: 'Patient allergic to penicillin - confirmed amoxicillin is safe'
        }
    ]);

    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [scanMode, setScanMode] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'ready' | 'dispensed'>('all');

    const handleScanPrescription = useCallback(() => {
        setScanMode(true);
        // In real implementation, this would open camera/file picker for OCR scanning
        setTimeout(() => {
            setScanMode(false);
            // Mock adding a new scanned prescription
            const newPrescription: Prescription = {
                id: `RX${String(prescriptions.length + 1).padStart(3, '0')}`,
                patientName: 'Robert Johnson',
                patientId: 'PT003',
                doctorName: 'Dr. Emily Davis',
                doctorId: 'DR003',
                medications: [
                    {
                        name: 'Ibuprofen 400mg',
                        dosage: '400mg',
                        frequency: 'As needed',
                        duration: '10 days',
                        instructions: 'Take with food, maximum 3 times daily',
                        quantity: 30
                    }
                ],
                dateIssued: new Date(),
                dateExpires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                status: 'pending',
                priority: 'normal'
            };
            setPrescriptions(prev => [...prev, newPrescription]);
        }, 2000);
    }, [prescriptions.length]);

    const updatePrescriptionStatus = (id: string, newStatus: Prescription['status']) => {
        setPrescriptions(prev =>
            prev.map(prescription =>
                prescription.id === id ? { ...prescription, status: newStatus } : prescription
            )
        );
    };

    const getStatusColor = (status: Prescription['status']) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'processing':
                return 'text-blue-600 bg-blue-100';
            case 'ready':
                return 'text-green-600 bg-green-100';
            case 'dispensed':
                return 'text-gray-600 bg-gray-100';
            case 'expired':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityColor = (priority: Prescription['priority']) => {
        switch (priority) {
            case 'urgent':
                return 'border-red-500 bg-red-50';
            case 'high':
                return 'border-orange-500 bg-orange-50';
            case 'normal':
                return 'border-blue-500 bg-blue-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    const filteredPrescriptions = prescriptions.filter(prescription =>
        filter === 'all' || prescription.status === filter
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Smart Prescription Manager</h1>
                    <p className="text-gray-600">Manage and process prescriptions with AI-powered assistance</p>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleScanPrescription}
                        disabled={scanMode}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CameraIcon className="h-5 w-5 mr-2" />
                        {scanMode ? 'Scanning...' : 'Scan Prescription'}
                    </button>

                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Manual Entry
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prescription List */}
                <div className="lg:col-span-2">
                    {/* Filters */}
                    <div className="flex space-x-2 mb-4">
                        {['all', 'pending', 'ready', 'dispensed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status as typeof filter)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                {status !== 'all' && (
                                    <span className="ml-2 text-xs">
                                        ({prescriptions.filter(p => p.status === status).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Prescription Cards */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredPrescriptions.map((prescription) => (
                                <motion.div
                                    key={prescription.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`bg-white border-l-4 ${getPriorityColor(prescription.priority)} rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                                    onClick={() => setSelectedPrescription(prescription)}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {prescription.patientName}
                                                </h3>
                                                <p className="text-sm text-gray-600">ID: {prescription.id}</p>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                                                    {prescription.status}
                                                </span>
                                                {prescription.priority === 'urgent' && (
                                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-medium">Doctor:</span> {prescription.doctorName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Issued:</span> {format(prescription.dateIssued, 'MMM d, yyyy')}
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-medium text-gray-900 mb-2">Medications:</h4>
                                            {prescription.medications.map((med, index) => (
                                                <div key={index} className="text-sm text-gray-600 mb-1">
                                                    {med.name} - {med.frequency} for {med.duration}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex space-x-2">
                                                {prescription.status === 'pending' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updatePrescriptionStatus(prescription.id, 'processing');
                                                        }}
                                                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                                                    >
                                                        Start Processing
                                                    </button>
                                                )}
                                                {prescription.status === 'processing' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updatePrescriptionStatus(prescription.id, 'ready');
                                                        }}
                                                        className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                                                    >
                                                        Mark Ready
                                                    </button>
                                                )}
                                                {prescription.status === 'ready' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updatePrescriptionStatus(prescription.id, 'dispensed');
                                                        }}
                                                        className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                                                    >
                                                        Mark Dispensed
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                                    <PrinterIcon className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                                    <QrCodeIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Prescription Details Sidebar */}
                <div className="lg:col-span-1">
                    {selectedPrescription ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-lg shadow-lg p-6 sticky top-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Prescription Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-900">Patient Information</h4>
                                    <p className="text-sm text-gray-600">Name: {selectedPrescription.patientName}</p>
                                    <p className="text-sm text-gray-600">ID: {selectedPrescription.patientId}</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900">Prescriber</h4>
                                    <p className="text-sm text-gray-600">{selectedPrescription.doctorName}</p>
                                    <p className="text-sm text-gray-600">ID: {selectedPrescription.doctorId}</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900">Medications</h4>
                                    {selectedPrescription.medications.map((med, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-3 mb-2">
                                            <p className="font-medium text-sm">{med.name}</p>
                                            <p className="text-xs text-gray-600">Dosage: {med.dosage}</p>
                                            <p className="text-xs text-gray-600">Frequency: {med.frequency}</p>
                                            <p className="text-xs text-gray-600">Duration: {med.duration}</p>
                                            <p className="text-xs text-gray-600">Quantity: {med.quantity}</p>
                                            <p className="text-xs text-gray-600 mt-1 italic">{med.instructions}</p>
                                        </div>
                                    ))}
                                </div>

                                {selectedPrescription.insuranceInfo && (
                                    <div>
                                        <h4 className="font-medium text-gray-900">Insurance</h4>
                                        <p className="text-sm text-gray-600">{selectedPrescription.insuranceInfo.provider}</p>
                                        <p className="text-sm text-gray-600">Policy: {selectedPrescription.insuranceInfo.policyNumber}</p>
                                        <p className="text-sm text-gray-600">Copay: ${selectedPrescription.insuranceInfo.copay}</p>
                                    </div>
                                )}

                                {selectedPrescription.notes && (
                                    <div>
                                        <h4 className="font-medium text-gray-900">Notes</h4>
                                        <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                                            {selectedPrescription.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                        Process
                                    </button>
                                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                                        Print
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-12 text-center">
                            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Select a prescription to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Scanning Modal */}
            <AnimatePresence>
                {scanMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-white rounded-lg p-8 text-center"
                        >
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Scanning Prescription</h3>
                            <p className="text-gray-600">Using AI to extract prescription information...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SmartPrescriptionManager;