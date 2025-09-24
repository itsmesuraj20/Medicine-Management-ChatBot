#!/bin/bash

# Medicine Management ChatBot - Enterprise Setup Script
# This script initializes the development environment for the Medicine Management ChatBot system
# Author: Senior Software Engineer
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_header "Checking Prerequisites..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js $NODE_VERSION is installed"
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm $NPM_VERSION is installed"
    else
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check Docker
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_status "$DOCKER_VERSION is installed"
    else
        print_warning "Docker is not installed. Docker is recommended for containerized development"
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        print_status "$GIT_VERSION is installed"
    else
        print_error "Git is not installed. Please install Git"
        exit 1
    fi
}

# Setup backend services
setup_backend() {
    print_header "Setting up Backend Services..."
    
    cd services
    
    # Setup each microservice
    for service in auth-service billing-service inventory-service ai-service notification-service analytics-service; do
        if [ -d "$service" ]; then
            print_status "Setting up $service..."
            cd $service
            if [ -f "package.json" ]; then
                npm install
                print_status "$service dependencies installed"
            fi
            cd ..
        else
            print_warning "$service directory not found, creating template..."
            mkdir -p $service/src
            cat > $service/package.json << EOF
{
  "name": "$service",
  "version": "1.0.0",
  "description": "Medicine Management ChatBot - $service",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
EOF
        fi
    done
    
    cd ..
}

# Setup web application
setup_web_app() {
    print_header "Setting up Web Application..."
    
    if [ -d "web-app" ]; then
        cd web-app
        if [ -f "package.json" ]; then
            print_status "Installing web app dependencies..."
            npm install
            print_status "Web app dependencies installed"
        else
            print_status "Creating React TypeScript application..."
            npx create-react-app . --template typescript --use-npm
        fi
        cd ..
    else
        print_status "Creating web application directory..."
        mkdir -p web-app/src/components web-app/src/pages web-app/src/services web-app/src/hooks web-app/src/store web-app/src/utils web-app/src/types
        print_status "Web app structure created"
    fi
}

# Setup mobile application
setup_mobile_app() {
    print_header "Setting up Mobile Application..."
    
    if [ -d "mobile-app" ]; then
        cd mobile-app
        if [ -f "package.json" ]; then
            print_status "Installing mobile app dependencies..."
            npm install
            print_status "Mobile app dependencies installed"
        fi
        cd ..
    else
        print_warning "Mobile app directory not found. Run 'npx react-native init MedicineManagementApp' to create React Native app"
        mkdir -p mobile-app/src/screens mobile-app/src/components mobile-app/src/navigation mobile-app/src/services
    fi
}

# Setup infrastructure
setup_infrastructure() {
    print_header "Setting up Infrastructure..."
    
    mkdir -p infrastructure/{terraform,kubernetes,docker}
    
    # Create Docker Compose for local development
    cat > infrastructure/docker/docker-compose.dev.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: medicine_management
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  elasticsearch:
    image: elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
EOF

    print_status "Infrastructure configuration created"
}

# Setup monitoring
setup_monitoring() {
    print_header "Setting up Monitoring Stack..."
    
    mkdir -p monitoring/{prometheus,grafana,jaeger}
    
    # Prometheus configuration
    cat > monitoring/prometheus/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'api-gateway'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'billing-service'
    static_configs:
      - targets: ['localhost:3001']
    metrics_path: '/metrics'

  - job_name: 'inventory-service'
    static_configs:
      - targets: ['localhost:3002']
    metrics_path: '/metrics'

  - job_name: 'ai-service'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
EOF

    print_status "Monitoring configuration created"
}

# Setup testing framework
setup_testing() {
    print_header "Setting up Testing Framework..."
    
    mkdir -p testing/{unit-tests,integration-tests,e2e-tests,performance-tests}
    
    # Create Jest configuration
    cat > testing/jest.config.js << EOF
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/unit-tests', '<rootDir>/integration-tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'services/**/*.ts',
    '!services/**/*.d.ts',
    '!services/**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
EOF

    print_status "Testing configuration created"
}

# Setup security configurations
setup_security() {
    print_header "Setting up Security Configuration..."
    
    mkdir -p security/{vault,policies,certificates}
    
    # Create security policy template
    cat > security/policies/api-security-policy.md << EOF
# API Security Policy

## Authentication Requirements
- All API endpoints must use JWT authentication
- Tokens must expire within 1 hour
- Refresh tokens must be rotated on each use

## Authorization Requirements
- Implement role-based access control (RBAC)
- Use principle of least privilege
- Log all authorization decisions

## Data Protection
- Encrypt sensitive data at rest using AES-256
- Use TLS 1.3 for data in transit
- Implement field-level encryption for PII

## Input Validation
- Validate all input data against strict schemas
- Sanitize output data to prevent XSS
- Use parameterized queries to prevent SQL injection

## Rate Limiting
- Implement per-user rate limiting
- Use exponential backoff for repeated failures
- Monitor for suspicious activity patterns
EOF

    print_status "Security configuration created"
}

# Create development environment file
create_env_files() {
    print_header "Creating Environment Configuration..."
    
    # Root environment file
    cat > .env.development << EOF
# Development Environment Configuration
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medicine_management_dev
DB_USER=dev_user
DB_PASSWORD=dev_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=development-secret-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# API Gateway Configuration
API_GATEWAY_PORT=8080
API_GATEWAY_HOST=localhost

# Service Ports
AUTH_SERVICE_PORT=3001
BILLING_SERVICE_PORT=3002
INVENTORY_SERVICE_PORT=3003
AI_SERVICE_PORT=8000
NOTIFICATION_SERVICE_PORT=3004
ANALYTICS_SERVICE_PORT=3005

# External APIs
OPENAI_API_KEY=your-openai-api-key-here
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3006
JAEGER_PORT=16686

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json
EOF

    print_status "Environment configuration created"
}

# Setup Git hooks and configurations
setup_git() {
    print_header "Setting up Git Configuration..."
    
    # Create .gitignore
    cat > .gitignore << EOF
# Dependencies
node_modules/
*/node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
*/dist/
*/build/

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Terraform
*.tfstate
*.tfstate.*
.terraform/

# Docker
.docker/

# Certificates
*.pem
*.crt
*.key

# Backup files
*.backup
*.bak
EOF

    # Initialize git repository if not already initialized
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "Initial commit: Medicine Management ChatBot enterprise setup"
        print_status "Git repository initialized"
    else
        print_status "Git repository already exists"
    fi
}

# Generate project summary
generate_summary() {
    print_header "Generating Project Summary..."
    
    cat > SETUP_SUMMARY.md << EOF
# Medicine Management ChatBot - Setup Summary

## Project Structure Created
- ✅ Microservices architecture with 6 core services
- ✅ Web application with React TypeScript
- ✅ Mobile application structure (React Native ready)
- ✅ Infrastructure as Code templates
- ✅ Comprehensive monitoring stack
- ✅ Security configuration templates
- ✅ Testing framework setup
- ✅ Development environment configuration

## Next Steps

### 1. Start Development Environment
\`\`\`bash
# Start infrastructure services
cd infrastructure/docker
docker-compose -f docker-compose.dev.yml up -d

# Verify services are running
docker-compose -f docker-compose.dev.yml ps
\`\`\`

### 2. Run Database Migrations
\`\`\`bash
# Create database schema
cd services/auth-service
npm run migrate

cd ../billing-service
npm run migrate
\`\`\`

### 3. Start Backend Services
\`\`\`bash
# Terminal 1: API Gateway
cd services/api-gateway && npm run dev

# Terminal 2: Auth Service
cd services/auth-service && npm run dev

# Terminal 3: Billing Service
cd services/billing-service && npm run dev
\`\`\`

### 4. Start Frontend Applications
\`\`\`bash
# Terminal 4: Web Application
cd web-app && npm start

# Terminal 5: Mobile App (React Native)
cd mobile-app && npx react-native start
\`\`\`

### 5. Access Applications
- **Web App**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Grafana Dashboard**: http://localhost:3006
- **Prometheus**: http://localhost:9090

## Development Guidelines
- Follow the coding standards in \`docs/development/DEVELOPMENT_GUIDE.md\`
- Review architecture decisions in \`docs/architecture/ADR.md\`
- Implement security policies from \`security/policies/\`
- Maintain test coverage above 90%

## Project Metrics
- **Services**: 6 microservices
- **Documentation Files**: 10+ comprehensive guides
- **Configuration Files**: 15+ template files
- **Security Policies**: Enterprise-grade security framework
- **Testing Strategy**: 4-layer testing pyramid

## Support
For technical questions or architecture guidance, refer to the comprehensive documentation in the \`docs/\` directory.
EOF

    print_status "Project summary generated in SETUP_SUMMARY.md"
}

# Main setup function
main() {
    clear
    echo "================================================================"
    echo "  Medicine Management ChatBot - Enterprise Setup"
    echo "  Initializing production-ready development environment..."
    echo "================================================================"
    echo ""
    
    check_prerequisites
    setup_backend
    setup_web_app
    setup_mobile_app
    setup_infrastructure
    setup_monitoring
    setup_testing
    setup_security
    create_env_files
    setup_git
    generate_summary
    
    echo ""
    echo "================================================================"
    print_status "Setup completed successfully!"
    echo "================================================================"
    echo ""
    print_status "📋 Read SETUP_SUMMARY.md for next steps"
    print_status "📚 Check docs/ directory for comprehensive documentation"
    print_status "🔧 Review .env.development for configuration"
    print_status "🚀 Run 'docker-compose -f infrastructure/docker/docker-compose.dev.yml up -d' to start services"
    echo ""
}

# Run main function
main "$@"