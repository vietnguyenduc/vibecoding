# Task List Management

Guidelines for managing task lists in markdown files to track progress on completing a PRD

## Task Implementation
- **One sub-task at a time:** Do **NOT** start the next sub‑task until you ask the user for permission and they say "yes" or "y"
- **Completion protocol:**  
  1. When you finish a **sub‑task**, immediately mark it as completed by changing `[ ]` to `[x]`.
  2. **Before proceeding**: Run health checks and verification scripts to ensure no regressions
  3. If **all** subtasks underneath a parent task are now `[x]`, follow this sequence:
    - **First**: Run the full test suite (`npm test`, `pytest`, `bin/rails test`, etc.)
    - **Second**: Run health checks (`npm run health-check`, `npm run verify-deps`)
    - **Third**: Run type checking (`npm run type-check`, `tsc --noEmit`)
    - **Only if all checks pass**: Stage changes (`git add .`)
    - **Clean up**: Remove any temporary files and temporary code before committing
    - **Commit**: Use a descriptive commit message that:
      - Uses conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)
      - Summarizes what was accomplished in the parent task
      - Lists key changes and additions
      - References the task number and PRD context
      - **Formats the message as a single-line command using `-m` flags**, e.g.:

        ```
        git commit -m "feat: add payment validation logic" -m "- Validates card type and expiry" -m "- Adds unit tests for edge cases" -m "Related to T123 in PRD"
        ```
  4. Once all the subtasks are marked completed and changes have been committed, mark the **parent task** as completed.
- Stop after each sub‑task and wait for the user's go‑ahead.

## Task List Maintenance

1. **Update the task list as you work:**
   - Mark tasks and subtasks as completed (`[x]`) per the protocol above.
   - Add new tasks as they emerge.
   - Update file descriptions when implementation details change.

2. **Maintain the "Relevant Files" section:**
   - List every file created or modified.
   - Give each file a one‑line description of its purpose.
   - Include documentation files and scripts.

3. **Health Check Integration:**
   - Run verification scripts after each major change.
   - Update health check scripts when new dependencies are added.
   - Document any new error prevention measures.

## AI Instructions

When working with task lists, the AI must:

1. **Before starting any work:**
   - Run health checks to ensure environment is ready
   - Verify dependencies are installed
   - Check for any existing issues

2. **During implementation:**
   - Regularly update the task list file after finishing any significant work.
   - Follow the completion protocol:
     - Mark each finished **sub‑task** `[x]`.
     - Mark the **parent task** `[x]` once **all** its subtasks are `[x]`.
   - Add newly discovered tasks.
   - Keep "Relevant Files" accurate and up to date.

3. **After completing work:**
   - Run comprehensive health checks
   - Update documentation if needed
   - Ensure all tests pass
   - Verify no regressions were introduced

4. **Error Prevention:**
   - Always check for missing dependencies
   - Verify TypeScript compilation
   - Test responsive design on different screen sizes
   - Ensure accessibility standards are met

5. **Communication:**
   - Before starting work, check which sub‑task is next.
   - After implementing a sub‑task, update the file and then pause for user approval.
   - Report any issues or blockers immediately
   - Suggest improvements based on implementation experience

## Lessons Learned (From Debt Repayment Project)

### Critical Success Factors
1. **Dependency Management**: Always verify dependencies before starting work
2. **TypeScript Strict Mode**: Prevents runtime errors and improves code quality
3. **Health Check Scripts**: Automated verification prevents common issues
4. **Responsive Design**: Mobile-first approach saves time and improves UX
5. **Documentation**: Comprehensive docs help with maintenance and onboarding

### Common Issues and Solutions
1. **PowerShell Execution Policy**: Use Command Prompt or fix execution policy
2. **Dependency Conflicts**: Check peer dependencies and version compatibility
3. **TypeScript Errors**: Enable strict mode early and fix issues incrementally
4. **Environment Setup**: Always provide .env.example and setup instructions
5. **Mobile Navigation**: Implement slide-out menus with proper touch targets

### Best Practices for Web App Development
1. **Error Prevention First**: Build verification into the development workflow
2. **Progressive Enhancement**: Start with core functionality, enhance with features
3. **Accessibility by Default**: Include ARIA labels and keyboard navigation
4. **Performance Awareness**: Consider bundle size and loading times
5. **Security Mindset**: Validate inputs and handle sensitive data properly

### Recommended Workflow
1. **Setup Phase**: Dependencies, TypeScript, health checks
2. **Core Implementation**: Main features with error handling
3. **Enhancement Phase**: UI polish, responsive design, accessibility
4. **Testing Phase**: Unit tests, integration tests, user testing
5. **Documentation Phase**: User guides, developer docs, troubleshooting