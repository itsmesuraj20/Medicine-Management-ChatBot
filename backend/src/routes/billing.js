const express = require('express');
const router = express.Router();

// Sample billing data storage (in production, use database)
let bills = [];
let billCounter = 1;

// POST /api/billing/create - Create new bill
router.post('/create', (req, res) => {
  const { 
    customerName, 
    customerPhone, 
    items, 
    discountType, 
    discountValue, 
    insuranceInfo,
    paymentMethod 
  } = req.body;
  
  // Calculate totals
  let subtotal = 0;
  let processedItems = [];
  
  items.forEach(item => {
    const itemTotal = item.quantity * item.price;
    subtotal += itemTotal;
    
    processedItems.push({
      ...item,
      total: itemTotal
    });
  });
  
  // Apply discount
  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (subtotal * discountValue) / 100;
  } else if (discountType === 'fixed') {
    discountAmount = discountValue;
  } else if (discountType === 'senior_citizen') {
    discountAmount = (subtotal * 10) / 100; // 10% senior citizen discount
  }
  
  // Calculate tax (example: 5% GST)
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * 5) / 100;
  const totalAmount = taxableAmount + taxAmount;
  
  // Create bill object
  const bill = {
    id: billCounter++,
    billNumber: `BILL-${Date.now()}`,
    date: new Date().toISOString(),
    customer: {
      name: customerName,
      phone: customerPhone
    },
    items: processedItems,
    subtotal: subtotal.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    paymentMethod,
    insuranceInfo,
    status: 'completed'
  };
  
  bills.push(bill);
  
  res.json({
    success: true,
    message: 'Bill created successfully',
    data: bill
  });
});

// GET /api/billing/:billId - Get bill by ID
router.get('/:billId', (req, res) => {
  const bill = bills.find(b => b.id === parseInt(req.params.billId));
  
  if (!bill) {
    return res.status(404).json({
      success: false,
      message: 'Bill not found'
    });
  }
  
  res.json({
    success: true,
    data: bill
  });
});

// GET /api/billing - Get all bills (with pagination)
router.get('/', (req, res) => {
  const { page = 1, limit = 10, customerPhone } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  let filteredBills = bills;
  
  if (customerPhone) {
    filteredBills = bills.filter(bill => 
      bill.customer.phone === customerPhone
    );
  }
  
  const paginatedBills = filteredBills.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    count: paginatedBills.length,
    total: filteredBills.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(filteredBills.length / limit),
    data: paginatedBills
  });
});

// POST /api/billing/process-payment - Process payment
router.post('/process-payment', (req, res) => {
  const { billId, paymentMethod, amount, cardDetails } = req.body;
  
  // Simulate payment processing
  const paymentResult = {
    success: true,
    transactionId: `TXN-${Date.now()}`,
    amount: amount,
    method: paymentMethod,
    timestamp: new Date().toISOString()
  };
  
  // In real implementation, integrate with payment gateways like Stripe/PayPal
  if (paymentMethod === 'card' && cardDetails) {
    // Validate card details
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card details'
      });
    }
  }
  
  res.json({
    success: true,
    message: 'Payment processed successfully',
    data: paymentResult
  });
});

// POST /api/billing/calculate-total - Calculate bill total before creation
router.post('/calculate-total', (req, res) => {
  const { items, discountType, discountValue } = req.body;
  
  let subtotal = 0;
  
  items.forEach(item => {
    subtotal += item.quantity * item.price;
  });
  
  // Apply discount
  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (subtotal * discountValue) / 100;
  } else if (discountType === 'fixed') {
    discountAmount = discountValue;
  } else if (discountType === 'senior_citizen') {
    discountAmount = (subtotal * 10) / 100;
  }
  
  // Calculate tax
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * 5) / 100;
  const totalAmount = taxableAmount + taxAmount;
  
  res.json({
    success: true,
    data: {
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    }
  });
});

// GET /api/billing/reports/daily - Get daily sales report
router.get('/reports/daily', (req, res) => {
  const { date } = req.query;
  const targetDate = date ? new Date(date) : new Date();
  
  const dailyBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate.toDateString() === targetDate.toDateString();
  });
  
  const totalSales = dailyBills.reduce((sum, bill) => 
    sum + parseFloat(bill.totalAmount), 0
  );
  
  const totalTransactions = dailyBills.length;
  
  res.json({
    success: true,
    data: {
      date: targetDate.toDateString(),
      totalSales: totalSales.toFixed(2),
      totalTransactions,
      averageTransaction: totalTransactions > 0 ? 
        (totalSales / totalTransactions).toFixed(2) : '0.00',
      bills: dailyBills
    }
  });
});

module.exports = router;