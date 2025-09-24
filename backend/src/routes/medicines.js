const express = require('express');
const router = express.Router();

// Sample medicines data (in production, this would come from database)
const medicines = [
  {
    id: 1,
    name: 'Paracetamol',
    brand: 'Crocin',
    generic: 'Paracetamol',
    strength: '500mg',
    form: 'Tablet',
    price: 2.50,
    stock: 100,
    category: 'Pain Relief',
    prescription_required: false,
    barcode: '1234567890123',
    expiry_date: '2025-12-31',
    manufacturer: 'GSK',
    side_effects: 'Nausea, dizziness, skin rash',
    contraindications: 'Liver disease, alcohol dependency'
  },
  {
    id: 2,
    name: 'Amoxicillin',
    brand: 'Augmentin',
    generic: 'Amoxicillin',
    strength: '250mg',
    form: 'Capsule',
    price: 15.75,
    stock: 50,
    category: 'Antibiotic',
    prescription_required: true,
    barcode: '2345678901234',
    expiry_date: '2025-08-15',
    manufacturer: 'Pfizer',
    side_effects: 'Stomach upset, diarrhea, allergic reactions',
    contraindications: 'Penicillin allergy, kidney disease'
  }
];

// GET /api/medicines - Get all medicines
router.get('/', (req, res) => {
  const { search, category, prescription_required } = req.query;
  
  let filteredMedicines = medicines;
  
  if (search) {
    filteredMedicines = filteredMedicines.filter(med => 
      med.name.toLowerCase().includes(search.toLowerCase()) ||
      med.brand.toLowerCase().includes(search.toLowerCase()) ||
      med.generic.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filteredMedicines = filteredMedicines.filter(med => 
      med.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (prescription_required !== undefined) {
    filteredMedicines = filteredMedicines.filter(med => 
      med.prescription_required === (prescription_required === 'true')
    );
  }
  
  res.json({
    success: true,
    count: filteredMedicines.length,
    data: filteredMedicines
  });
});

// GET /api/medicines/:id - Get medicine by ID
router.get('/:id', (req, res) => {
  const medicine = medicines.find(med => med.id === parseInt(req.params.id));
  
  if (!medicine) {
    return res.status(404).json({
      success: false,
      message: 'Medicine not found'
    });
  }
  
  res.json({
    success: true,
    data: medicine
  });
});

// GET /api/medicines/barcode/:barcode - Get medicine by barcode
router.get('/barcode/:barcode', (req, res) => {
  const medicine = medicines.find(med => med.barcode === req.params.barcode);
  
  if (!medicine) {
    return res.status(404).json({
      success: false,
      message: 'Medicine not found with this barcode'
    });
  }
  
  res.json({
    success: true,
    data: medicine
  });
});

// POST /api/medicines/check-interactions - Check drug interactions
router.post('/check-interactions', (req, res) => {
  const { medicineIds } = req.body;
  
  // Simplified interaction check (in production, use proper drug interaction database)
  const interactions = [];
  
  if (medicineIds.includes(1) && medicineIds.includes(2)) {
    interactions.push({
      severity: 'moderate',
      description: 'Paracetamol and Amoxicillin may cause increased risk of liver toxicity',
      recommendation: 'Monitor liver function, consider alternative pain relief'
    });
  }
  
  res.json({
    success: true,
    interactions: interactions,
    safe: interactions.length === 0
  });
});

// GET /api/medicines/alternatives/:id - Get alternative medicines
router.get('/alternatives/:id', (req, res) => {
  const medicineId = parseInt(req.params.id);
  const medicine = medicines.find(med => med.id === medicineId);
  
  if (!medicine) {
    return res.status(404).json({
      success: false,
      message: 'Medicine not found'
    });
  }
  
  // Find alternatives with same generic name or category
  const alternatives = medicines.filter(med => 
    med.id !== medicineId && 
    (med.generic === medicine.generic || med.category === medicine.category)
  );
  
  res.json({
    success: true,
    original: medicine,
    alternatives: alternatives
  });
});

module.exports = router;