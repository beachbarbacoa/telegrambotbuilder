# Testing Guide

## Overview

This guide provides instructions for testing the Telegram Restaurant Bot SaaS Platform to ensure all functionality works correctly.

## Prerequisites

- Node.js (v16 or higher)
- pnpm (package manager)
- Supabase account for integration testing
- Stripe account for payment testing

## Running Tests

### Unit Tests

Run all unit tests:
```bash
pnpm test:run
```

Run tests in watch mode:
```bash
pnpm test
```

Run tests with UI:
```bash
pnpm test:ui
```

### Test Structure

```
src/
└── tests/
    ├── coreFunctionality.test.ts    # Core functionality tests
    ├── setup.ts                     # Test setup file
    └── __mocks__/                   # Mock implementations
        └── supabase.ts             # Supabase client mock
```

## Writing Tests

### Test File Structure

Create test files with the `.test.ts` extension in the `src/tests/` directory.

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should perform expected behavior', () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

### Mocking Dependencies

For mocking external dependencies like Supabase, create mock files in `src/tests/__mocks__/`.

## Test Categories

### 1. Authentication Tests
- User signup and login
- Session management
- Profile updates

### 2. Subscription Tests
- Plan selection
- Payment processing
- Subscription status updates

### 3. Menu Management Tests
- Category creation/editing
- Item creation/editing
- Drag-and-drop reordering

### 4. Telegram Bot Tests
- Bot creation
- Bot activation/deactivation
- Message handling

### 5. Payment Tests
- Subscription payments
- Order payments
- Refunds

### 6. Admin Panel Tests
- Restaurant management
- Order management
- Analytics

## Continuous Integration

The project is configured to run tests automatically on:
- Every pull request
- Every commit to the main branch
- Scheduled weekly runs

## Test Data Management

### Test Accounts
- Use dedicated test accounts for each environment
- Reset test data between test runs
- Use factories for generating test data

### Database Seeding
For integration tests, use database seeding:
```sql
-- Create test data
INSERT INTO restaurants (id, name, email) 
VALUES ('test-id', 'Test Restaurant', 'test@example.com');
```

## Performance Testing

### Load Testing
- Test with concurrent users
- Measure response times
- Check database performance

### Stress Testing
- Test system limits
- Monitor resource usage
- Identify bottlenecks

## Security Testing

### Authentication
- Test password strength
- Verify session security
- Check authorization boundaries

### Data Validation
- Test input validation
- Check for injection vulnerabilities
- Verify data sanitization

## Browser Testing

### Supported Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Testing
- Test on various screen sizes
- Verify touch interactions
- Check responsive design

## Debugging Tests

### Common Issues

1. **Async Test Failures**
   ```typescript
   // Wrong
   it('should handle async operation', () => {
     service.asyncMethod().then(result => {
       expect(result).toBe(expected);
     });
   });

   // Correct
   it('should handle async operation', async () => {
     const result = await service.asyncMethod();
     expect(result).toBe(expected);
   });
   ```

2. **Mock Issues**
   - Ensure mocks are properly configured
   - Reset mocks between tests
   - Verify mock return values

3. **Timeout Issues**
   - Increase test timeout for slow operations
   - Optimize test data
   - Use more specific selectors

### Debugging Tools

- Use `console.log` for debugging test execution
- Use browser dev tools for frontend debugging
- Use Supabase dashboard for database debugging

## Test Reporting

### Test Coverage
Run tests with coverage reporting:
```bash
pnpm test:run --coverage
```

### CI/CD Integration
- Tests run automatically on GitHub Actions
- Results are reported in pull requests
- Coverage reports are generated

## Best Practices

### Test Organization
- Group related tests in describe blocks
- Use clear, descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Data
- Use realistic test data
- Clean up test data after tests
- Use factories for complex data

### Test Speed
- Keep tests focused and fast
- Mock external dependencies
- Use parallel test execution

### Test Reliability
- Avoid flaky tests
- Use specific assertions
- Test edge cases

## Troubleshooting

### Common Test Failures

1. **Module Resolution Errors**
   - Check import paths
   - Verify tsconfig.json configuration
   - Ensure all dependencies are installed

2. **Async Test Timeouts**
   - Increase test timeout
   - Optimize test implementation
   - Check for unhandled promises

3. **Mock Mismatches**
   - Verify mock function signatures
   - Check return values
   - Ensure proper mock setup

### Getting Help

- Check the Vitest documentation
- Review existing test implementations
- Consult team members
- Open GitHub issues for bugs

## Maintenance

### Regular Tasks
- Update test dependencies
- Review and update test coverage
- Refactor tests as code changes
- Add new tests for new features

### Test Reviews
- Include tests in code reviews
- Verify test quality and coverage
- Check for test maintainability
- Ensure tests are readable and clear