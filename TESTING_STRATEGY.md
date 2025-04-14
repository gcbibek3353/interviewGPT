
## 2. Testing Layers

### 2.1 Unit Tests
Focus on testing individual components and functions in isolation.

#### Components to Test:
```typescript
// __tests__/unit/components/Agent.test.tsx
import { render, fireEvent, screen } from '@testing-library/react'
import Agent from '@/components/Agent'

describe('Agent Component', () => {
  it('should render in generate mode', () => {
    const props = {
      userName: 'Test User',
      type: 'generate',
      userId: 'test-id'
    }
    render(<Agent {...props} />)
    expect(screen.getByText(/Interview Generation/i)).toBeInTheDocument()
  })

  it('should render in interview mode', () => {
    const props = {
      userName: 'Test User',
      type: 'interview',
      interviewId: 'test-interview',
      questions: ['Question 1', 'Question 2']
    }
    render(<Agent {...props} />)
    expect(screen.getByText(/Interview Session/i)).toBeInTheDocument()
  })

  // Test voice interaction states
  it('should handle call status changes', () => {
    // Add tests for different call states
  })
})
```

#### Utility Functions:
```typescript
// __tests__/unit/lib/utils.test.ts
import { getRandomInterviewCover } from '@/lib/utils'

describe('Utility Functions', () => {
  it('should return a valid interview cover image', () => {
    const cover = getRandomInterviewCover()
    expect(cover).toMatch(/^https:\/\/.*\.(png|jpg|jpeg)$/)
  })
})
```

### 2.2 Integration Tests
Test interactions between multiple components and services.

```typescript
// __tests__/integration/features/interview-generation.test.ts
import { generateInterview } from '@/lib/actions/general.action'

describe('Interview Generation Flow', () => {
  it('should generate interview questions based on parameters', async () => {
    const params = {
      type: 'technical',
      role: 'Full Stack Developer',
      level: 'Senior',
      techstack: ['React', 'Node.js', 'TypeScript'],
      amount: 5,
      userid: 'test-user'
    }

    const result = await generateInterview(params)
    expect(result.questions).toHaveLength(5)
    expect(result.role).toBe('Full Stack Developer')
  })
})
```

### 2.3 E2E Tests
Test complete user flows using Cypress or Playwright.

```typescript
// __tests__/e2e/flows/complete-interview.spec.ts
describe('Complete Interview Flow', () => {
  beforeEach(() => {
    cy.login() // Custom command for authentication
  })

  it('should complete full interview process', () => {
    // Start interview generation
    cy.visit('/dashboard/interview')
    cy.get('[data-testid="generate-interview"]').click()
    
    // Fill interview parameters
    cy.get('[data-testid="role-input"]').type('Full Stack Developer')
    cy.get('[data-testid="level-select"]').select('Senior')
    
    // Start interview
    cy.get('[data-testid="start-interview"]').click()
    
    // Complete interview
    cy.get('[data-testid="voice-response"]').should('be.visible')
    
    // Verify feedback generation
    cy.get('[data-testid="feedback-section"]').should('be.visible')
  })
})
```

## 3. Mock Data Structure

```typescript
// __tests__/__mocks__/data/interviews.ts
export const mockInterviews = [
  {
    id: 'interview-1',
    role: 'Full Stack Developer',
    level: 'Senior',
    questions: [
      'Explain RESTful API principles',
      'Describe your experience with React hooks',
      'How do you handle state management in large applications?'
    ],
    techstack: ['React', 'Node.js', 'TypeScript'],
    createdAt: '2024-04-06T10:00:00Z',
    userId: 'user-1',
    type: 'technical',
    finalized: true
  }
]

// __tests__/__mocks__/data/feedback.ts
export const mockFeedback = {
  communicationSkills: 85,
  technicalKnowledge: 90,
  problemSolving: 88,
  culturalFit: 92,
  confidenceClarity: 87,
  transcript: [
    { role: 'assistant', content: 'Tell me about your experience with React.' },
    { role: 'user', content: 'I have been working with React for 3 years...' }
  ]
}
```

## 4. Testing Tools and Setup

### 4.1 Required Dependencies
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "cypress": "^13.0.0",
    "msw": "^2.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

### 4.2 Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.*'
  ]
}
```

## 5. Testing Guidelines

1. **Component Testing Priority**:
   - `Agent.tsx` - Core interview interaction component
   - Authentication components
   - Interview feedback components
   - Voice interaction components

2. **API Testing Focus**:
   - Interview generation endpoints
   - Feedback generation
   - Voice processing integration
   - Firebase interactions

3. **Critical User Flows**:
   - Complete interview generation process
   - Interview session with voice interaction
   - Feedback review and storage
   - User authentication and profile management

4. **Mock External Services**:
   - Firebase Authentication
   - Voice API (VAPI)
   - AI models (GPT/Gemini)
   - Storage services

## 6. Test Coverage Goals

- Unit Tests: 80% coverage
- Integration Tests: Key user flows
- E2E Tests: Critical business paths
- Performance Tests: Voice interaction latency

## 7. Continuous Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm run test:unit
      - name: Run integration tests
        run: npm run test:integration
      - name: Run E2E tests
        run: npm run test:e2e
```