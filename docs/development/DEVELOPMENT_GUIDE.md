# Development Guidelines

## Code Quality Standards

### General Principles
- **SOLID Principles**: Apply Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles
- **DRY (Don't Repeat Yourself)**: Eliminate code duplication through abstraction and modularization
- **KISS (Keep It Simple, Stupid)**: Prefer simple, readable solutions over complex implementations
- **YAGNI (You Aren't Gonna Need It)**: Implement features only when they are actually required

### Code Review Process
1. **Pre-Review Checklist**:
   - All tests pass (unit, integration, e2e)
   - Code coverage meets minimum threshold (90%)
   - Static analysis tools report no critical issues
   - Documentation is updated for public APIs
   - Security considerations are addressed

2. **Review Criteria**:
   - Code correctness and logic
   - Performance implications
   - Security vulnerabilities
   - Adherence to coding standards
   - Test coverage and quality
   - Documentation completeness

3. **Review Workflow**:
   - Automated checks must pass before human review
   - Minimum two approvals required for critical changes
   - Architecture review for significant design changes
   - Security review for authentication/authorization changes

### Testing Strategy

#### Unit Testing
```typescript
// Example: Service unit test
describe('BillingService', () => {
  let service: BillingService;
  let mockRepository: jest.Mocked<BillingRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new BillingService(mockRepository);
  });

  describe('calculateTotal', () => {
    it('should calculate total with tax and discount', () => {
      // Given
      const items = [{ price: 10, quantity: 2 }];
      const discount = 0.1; // 10%
      
      // When
      const result = service.calculateTotal(items, discount);
      
      // Then
      expect(result).toEqual({
        subtotal: 20,
        discount: 2,
        tax: 0.9, // 5% tax on discounted amount
        total: 18.9
      });
    });
  });
});
```

#### Integration Testing
```typescript
// Example: API integration test
describe('Billing API', () => {
  let app: Express;
  let testDb: TestDatabase;

  beforeAll(async () => {
    testDb = await createTestDatabase();
    app = createApp(testDb);
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  describe('POST /api/v1/bills', () => {
    it('should create a new bill', async () => {
      // Given
      const billData = {
        customerName: 'John Doe',
        items: [{ medicineId: 1, quantity: 2, price: 10 }]
      };

      // When
      const response = await request(app)
        .post('/api/v1/bills')
        .send(billData)
        .expect(201);

      // Then
      expect(response.body.data).toMatchObject({
        customerName: 'John Doe',
        totalAmount: '21.00' // Including tax
      });
    });
  });
});
```

#### End-to-End Testing
```typescript
// Example: Cypress E2E test
describe('Billing Workflow', () => {
  beforeEach(() => {
    cy.login('pharmacist@example.com');
    cy.visit('/billing');
  });

  it('should complete a billing transaction', () => {
    // Add medicines to cart
    cy.get('[data-testid=medicine-search]').type('Paracetamol');
    cy.get('[data-testid=add-to-cart]').click();
    
    // Apply discount
    cy.get('[data-testid=apply-discount]').click();
    cy.get('[data-testid=senior-discount]').click();
    
    // Process payment
    cy.get('[data-testid=process-payment]').click();
    cy.get('[data-testid=payment-card]').click();
    
    // Verify success
    cy.get('[data-testid=payment-success]').should('be.visible');
    cy.get('[data-testid=bill-number]').should('contain', 'BILL-');
  });
});
```

### Performance Guidelines

#### Database Optimization
```sql
-- Example: Optimized medicine search query
CREATE INDEX CONCURRENTLY idx_medicines_search 
ON medicines USING gin(to_tsvector('english', name || ' ' || generic_name));

-- Query with proper pagination
SELECT id, name, price, stock_quantity
FROM medicines 
WHERE to_tsvector('english', name || ' ' || generic_name) @@ plainto_tsquery('paracetamol')
ORDER BY name
LIMIT 20 OFFSET $1;
```

#### Caching Strategy
```typescript
// Example: Multi-layer caching
class MedicineService {
  private cache = new Redis();
  private localCache = new LRU({ max: 1000, ttl: 60000 });

  async getMedicine(id: string): Promise<Medicine> {
    // L1: In-memory cache (1 minute)
    let medicine = this.localCache.get(id);
    if (medicine) return medicine;

    // L2: Redis cache (15 minutes)
    medicine = await this.cache.get(`medicine:${id}`);
    if (medicine) {
      this.localCache.set(id, medicine);
      return JSON.parse(medicine);
    }

    // L3: Database
    medicine = await this.repository.findById(id);
    await this.cache.setex(`medicine:${id}`, 900, JSON.stringify(medicine));
    this.localCache.set(id, medicine);
    
    return medicine;
  }
}
```

#### API Rate Limiting
```typescript
// Example: Intelligent rate limiting
const rateLimitConfig = {
  public: { requests: 100, window: 900 }, // 100 requests per 15 minutes
  authenticated: { requests: 1000, window: 900 }, // 1000 requests per 15 minutes
  premium: { requests: 5000, window: 900 } // 5000 requests per 15 minutes
};

app.use('/api', rateLimit({
  keyGenerator: (req) => {
    const userId = req.user?.id || req.ip;
    const tier = req.user?.tier || 'public';
    return `${tier}:${userId}`;
  },
  max: (req) => rateLimitConfig[req.user?.tier || 'public'].requests,
  windowMs: (req) => rateLimitConfig[req.user?.tier || 'public'].window * 1000
}));
```

### Security Best Practices

#### Input Validation
```typescript
// Example: Comprehensive input validation
import Joi from 'joi';

const createBillSchema = Joi.object({
  customerName: Joi.string().trim().min(2).max(100).required(),
  customerPhone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{10,15}$/).required(),
  items: Joi.array().items(
    Joi.object({
      medicineId: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().min(1).max(1000).required(),
      price: Joi.number().precision(2).positive().required()
    })
  ).min(1).max(50).required(),
  discountType: Joi.string().valid('none', 'percentage', 'fixed', 'senior').default('none'),
  discountValue: Joi.number().min(0).max(100).when('discountType', {
    is: Joi.string().valid('percentage', 'fixed'),
    then: Joi.required(),
    otherwise: Joi.forbidden()
  })
});

// Middleware usage
app.post('/api/v1/bills', validate(createBillSchema), createBill);
```

#### Authentication & Authorization
```typescript
// Example: JWT middleware with role-based access
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await userService.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage
app.post('/api/v1/bills', authenticateToken, requirePermission('billing:create'), createBill);
```

#### Data Sanitization
```typescript
// Example: Data sanitization and validation
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

class DataSanitizer {
  static sanitizeString(input: string): string {
    return DOMPurify.sanitize(validator.escape(input.trim()));
  }

  static sanitizeEmail(email: string): string {
    const sanitized = validator.normalizeEmail(email.trim().toLowerCase());
    if (!validator.isEmail(sanitized)) {
      throw new Error('Invalid email format');
    }
    return sanitized;
  }

  static sanitizePhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!validator.isMobilePhone(cleaned, 'any', { strictMode: true })) {
      throw new Error('Invalid phone number format');
    }
    return cleaned;
  }
}
```

### Error Handling

#### Centralized Error Handling
```typescript
// Example: Global error handler
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err } as AppError;
  error.message = err.message;

  // Log error
  logger.error({
    error: err,
    request: {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
      user: req.user?.id
    }
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new AppError(message.join(', '), 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### Documentation Standards

#### API Documentation
```typescript
/**
 * @swagger
 * /api/v1/bills:
 *   post:
 *     summary: Create a new bill
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "John Doe"
 *               customerPhone:
 *                 type: string
 *                 pattern: "^\\+?[\\d\\s\\-\\(\\)]{10,15}$"
 *                 example: "+1-555-123-4567"
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 50
 *                 items:
 *                   type: object
 *                   properties:
 *                     medicineId:
 *                       type: integer
 *                       example: 123
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *                     price:
 *                       type: number
 *                       minimum: 0.01
 *                       example: 10.99
 *     responses:
 *       201:
 *         description: Bill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BillResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
```

#### Code Documentation
```typescript
/**
 * Service responsible for managing billing operations including
 * invoice generation, payment processing, and financial reporting.
 * 
 * @class BillingService
 * @implements {IBillingService}
 */
class BillingService implements IBillingService {
  /**
   * Creates a new bill with the provided items and customer information.
   * Automatically calculates taxes, discounts, and total amounts.
   * 
   * @param {CreateBillDto} billData - The bill creation data
   * @param {string} userId - ID of the user creating the bill
   * @returns {Promise<BillResponseDto>} The created bill with calculated totals
   * @throws {ValidationError} When bill data is invalid
   * @throws {NotFoundError} When referenced medicines don't exist
   * @throws {InsufficientStockError} When requested quantity exceeds available stock
   * 
   * @example
   * ```typescript
   * const bill = await billingService.createBill({
   *   customerName: 'John Doe',
   *   items: [{ medicineId: 1, quantity: 2, price: 10.99 }]
   * }, 'user123');
   * ```
   */
  async createBill(billData: CreateBillDto, userId: string): Promise<BillResponseDto> {
    // Implementation
  }
}
```

This comprehensive development guide ensures consistent, high-quality code across the entire Medicine Management ChatBot system while maintaining security, performance, and maintainability standards.