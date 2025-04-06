# Contributing to InterviewGPT 🤝

First off, thank you for considering contributing to InterviewGPT! It's people like you that make InterviewGPT such a great tool. We welcome contributions from the community and are grateful for any time you can dedicate to improving this project.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Project Setup](#project-setup)
3. [Development Guidelines](#development-guidelines)
4. [Contribution Process](#contribution-process)
5. [Pull Request Guidelines](#pull-request-guidelines)
6. [Community](#community)

## Code of Conduct

### Our Pledge
We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement
- Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers
- Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, and other contributions that are not aligned with this Code of Conduct

## Project Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- A modern web browser
- Firebase account (for backend services)

### Step-by-Step Setup
1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/interview_gpt.git
   cd interview_gpt
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:3000`

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use modern ES6+ features when appropriate

### Project Structure

interview_gpt/
├── src/
│ ├── app/ # Next.js app router pages
│ ├── components/ # Reusable React components
│ ├── lib/ # Utility functions and helpers
│ ├── types/ # TypeScript type definitions
│ ├── constants/ # Constant values and configurations
│ └── firebase/ # Firebase configuration and helpers
├── public/ # Static assets
└── tests/ # Test files


### Testing
- Write tests for new features
- Ensure all tests pass before submitting PR
- Follow the existing testing patterns

## Contribution Process

1. **Create an Issue**
   - Before making significant changes, create an issue to discuss the proposed changes
   - Wait for approval from maintainers

2. **Branch Creation**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

3. **Development**
   - Make your changes
   - Keep commits small and focused
   - Write meaningful commit messages

4. **Testing**
   ```bash
   npm run test
   npm run lint
   ```

5. **Update Documentation**
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update any relevant documentation

## Pull Request Guidelines

1. **Before Submitting**
   - Ensure all tests pass
   - Update documentation if needed
   - Rebase on main branch
   - Squash commits if necessary

2. **PR Description**
   - Clearly describe the changes
   - Link to related issues
   - Include screenshots for UI changes
   - List any breaking changes

3. **Review Process**
   - Address reviewer comments
   - Make requested changes
   - Maintain a respectful dialogue

## Community

### Getting Help
- Create an issue for bugs
- Use discussions for questions
- Join our Discord community (if available)

### Recognition
- Contributors will be added to the README.md
- Significant contributions will be specially recognized
- All contributors will be listed in the GitHub repository

### Communication Channels
- GitHub Issues
- GitHub Discussions
- Project Discord (if available)

Thank you for contributing to InterviewGPT! 🎉

---

By contributing, you agree to abide by the terms of our license and code of conduct.