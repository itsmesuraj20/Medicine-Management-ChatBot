import React, { useState, useEffect } from 'react';
import {
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface Drug {
    id: string;
    name: string;
    genericName: string;
    activeIngredient: string;
    strength: string;
    form: string;
}

interface Interaction {
    id: string;
    drug1: string;
    drug2: string;
    severity: 'minor' | 'moderate' | 'major' | 'severe';
    description: string;
    clinicalEffect: string;
    management: string;
    mechanism: string;
    references: string[];
}

interface Contraindication {
    condition: string;
    severity: 'warning' | 'contraindication';
    description: string;
}

const DrugInteractionChecker: React.FC = () => {
    const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Drug[]>([]);
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [contraindications, setContraindications] = useState<Contraindication[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock drug database - replace with real API
    const mockDrugs: Drug[] = [
        {
            id: '1',
            name: 'Warfarin',
            genericName: 'Warfarin Sodium',
            activeIngredient: 'Warfarin',
            strength: '5mg',
            form: 'Tablet'
        },
        {
            id: '2',
            name: 'Aspirin',
            genericName: 'Acetylsalicylic Acid',
            activeIngredient: 'Aspirin',
            strength: '81mg',
            form: 'Tablet'
        },
        {
            id: '3',
            name: 'Metformin',
            genericName: 'Metformin HCl',
            activeIngredient: 'Metformin',
            strength: '500mg',
            form: 'Tablet'
        },
        {
            id: '4',
            name: 'Ibuprofen',
            genericName: 'Ibuprofen',
            activeIngredient: 'Ibuprofen',
            strength: '400mg',
            form: 'Tablet'
        },
        {
            id: '5',
            name: 'Lisinopril',
            genericName: 'Lisinopril',
            activeIngredient: 'Lisinopril',
            strength: '10mg',
            form: 'Tablet'
        }
    ];

    // Mock interactions database
    const mockInteractions: Interaction[] = [
        {
            id: '1',
            drug1: 'Warfarin',
            drug2: 'Aspirin',
            severity: 'major',
            description: 'Concurrent use increases bleeding risk',
            clinicalEffect: 'Increased anticoagulation effect, risk of bleeding',
            management: 'Monitor INR closely, consider alternative antiplatelet if possible',
            mechanism: 'Additive anticoagulant effects and aspirin-induced platelet dysfunction',
            references: ['Chest. 2012;141(2 Suppl):e531S-e575S']
        },
        {
            id: '2',
            drug1: 'Ibuprofen',
            drug2: 'Lisinopril',
            severity: 'moderate',
            description: 'NSAIDs may reduce antihypertensive effect',
            clinicalEffect: 'Reduced blood pressure lowering effect of ACE inhibitors',
            management: 'Monitor blood pressure, consider alternative pain management',
            mechanism: 'NSAIDs inhibit prostaglandin synthesis, reducing vasodilation',
            references: ['Hypertension. 2011;57(1):11-17']
        }
    ];

    useEffect(() => {
        if (searchTerm.length > 2) {
            const filtered = mockDrugs.filter(drug =>
                drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                drug.genericName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        checkInteractions();
    }, [selectedDrugs]);

    const checkInteractions = async () => {
        setLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundInteractions: Interaction[] = [];
        const foundContraindications: Contraindication[] = [];

        // Check for interactions between selected drugs
        for (let i = 0; i < selectedDrugs.length; i++) {
            for (let j = i + 1; j < selectedDrugs.length; j++) {
                const interaction = mockInteractions.find(int =>
                    (int.drug1 === selectedDrugs[i].name && int.drug2 === selectedDrugs[j].name) ||
                    (int.drug1 === selectedDrugs[j].name && int.drug2 === selectedDrugs[i].name)
                );

                if (interaction) {
                    foundInteractions.push(interaction);
                }
            }
        }

        // Mock contraindications
        if (selectedDrugs.some(drug => drug.name === 'Warfarin')) {
            foundContraindications.push({
                condition: 'Pregnancy',
                severity: 'contraindication',
                description: 'Warfarin crosses the placenta and may cause fetal hemorrhage'
            });
        }

        setInteractions(foundInteractions);
        setContraindications(foundContraindications);
        setLoading(false);
    };

    const addDrug = (drug: Drug) => {
        if (!selectedDrugs.find(d => d.id === drug.id)) {
            setSelectedDrugs([...selectedDrugs, drug]);
        }
        setSearchTerm('');
        setSearchResults([]);
    };

    const removeDrug = (drugId: string) => {
        setSelectedDrugs(selectedDrugs.filter(d => d.id !== drugId));
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'severe':
                return 'text-red-800 bg-red-100 border-red-300';
            case 'major':
                return 'text-red-700 bg-red-50 border-red-200';
            case 'moderate':
                return 'text-yellow-700 bg-yellow-50 border-yellow-200';
            case 'minor':
                return 'text-blue-700 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'severe':
            case 'major':
                return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
            case 'moderate':
                return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-3" />
                        Drug Interaction Checker
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Check for potential interactions between medications
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Drug Search */}
                    <div className="relative">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for medications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Search Results */}
                        <AnimatePresence>
                            {searchResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
                                >
                                    {searchResults.map((drug) => (
                                        <button
                                            key={drug.id}
                                            onClick={() => addDrug(drug)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="font-medium text-gray-900">{drug.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {drug.genericName} - {drug.strength} {drug.form}
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Selected Drugs */}
                    {selectedDrugs.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Medications</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedDrugs.map((drug) => (
                                    <motion.div
                                        key={drug.id}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full"
                                    >
                                        <span className="mr-2">{drug.name} ({drug.strength})</span>
                                        <button
                                            onClick={() => removeDrug(drug.id)}
                                            className="hover:bg-blue-200 rounded-full p-1"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Checking interactions...</span>
                        </div>
                    )}

                    {/* Interactions Results */}
                    {!loading && selectedDrugs.length > 1 && (
                        <div className="space-y-4">
                            {interactions.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShieldCheckIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">No Interactions Found</h3>
                                    <p className="text-gray-600">The selected medications appear to be safe together.</p>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Drug Interactions Found</h3>
                                    <div className="space-y-4">
                                        {interactions.map((interaction) => (
                                            <motion.div
                                                key={interaction.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`p-4 border rounded-lg ${getSeverityColor(interaction.severity)}`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    {getSeverityIcon(interaction.severity)}
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <h4 className="font-medium">
                                                                {interaction.drug1} + {interaction.drug2}
                                                            </h4>
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-white bg-opacity-50">
                                                                {interaction.severity.toUpperCase()}
                                                            </span>
                                                        </div>

                                                        <p className="mb-3">{interaction.description}</p>

                                                        <div className="space-y-2 text-sm">
                                                            <div>
                                                                <span className="font-medium">Clinical Effect:</span> {interaction.clinicalEffect}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Management:</span> {interaction.management}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Mechanism:</span> {interaction.mechanism}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contraindications */}
                            {contraindications.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contraindications & Warnings</h3>
                                    <div className="space-y-2">
                                        {contraindications.map((contraindication, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 border rounded-lg ${contraindication.severity === 'contraindication'
                                                        ? 'bg-red-50 border-red-200 text-red-800'
                                                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <ExclamationTriangleIcon className="h-5 w-5" />
                                                    <span className="font-medium">{contraindication.condition}</span>
                                                </div>
                                                <p className="mt-1 text-sm">{contraindication.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Help Text */}
                    {selectedDrugs.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <MagnifyingGlassIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p>Start by searching and selecting medications to check for interactions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DrugInteractionChecker;