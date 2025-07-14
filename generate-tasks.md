# Rule: Generating a Task List from a PRD

## Goal

To guide an AI assistant in creating a detailed, step-by-step task list in Markdown format based on an existing Product Requirements Document (PRD). The task list should guide a developer through implementation with error prevention and best practices.

## Output

- **Format:** Markdown (`.md`)
- **Location:** Project root or `/tasks/`
- **Filename:** `tasks-[prd-file-name].md` (e.g., `tasks-prd-user-profile-editing.md`)

## Process

1.  **Receive PRD Reference:** The user points the AI to a specific PRD file
2.  **Analyze PRD:** The AI reads and analyzes the functional requirements, user stories, and other sections of the specified PRD.
3.  **Phase 1: Generate Parent Tasks:** Based on the PRD analysis, create the file and generate the main, high-level tasks required to implement the feature. Use your judgement on how many high-level tasks to use. It's likely to be about 5-7. Present these tasks to the user in the specified format (without sub-tasks yet). Inform the user: "I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed."
4.  **Wait for Confirmation:** Pause and wait for the user to respond with "Go".
5.  **Phase 2: Generate Sub-Tasks:** Once the user confirms, break down each parent task into smaller, actionable sub-tasks necessary to complete the parent task. Ensure sub-tasks logically follow from the parent task and cover the implementation details implied by the PRD.
6.  **Identify Relevant Files:** Based on the tasks and PRD, identify potential files that will need to be created or modified. List these under the `Relevant Files` section, including corresponding test files if applicable.
7.  **Generate Final Output:** Combine the parent tasks, sub-tasks, relevant files, and notes into the final Markdown structure.
8.  **Save Task List:** Save the generated document with the filename `tasks-[prd-file-name].md`, where `[prd-file-name]` matches the base name of the input PRD file.

## Output Format

The generated task list _must_ follow this structure:

```markdown
## Relevant Files

- `path/to/potential/file1.ts` - Brief description of why this file is relevant (e.g., Contains the main component for this feature).
- `path/to/file1.test.ts` - Unit tests for `file1.ts`.
- `path/to/another/file.tsx` - Brief description (e.g., API route handler for data submission).
- `path/to/another/file.test.tsx` - Unit tests for `another/file.tsx`.
- `lib/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations).
- `lib/utils/helpers.test.ts` - Unit tests for `helpers.ts`.
- `docs/FEATURE-NAME.md` - Documentation for the feature implementation.
- `scripts/verify-feature.js` - Verification script for feature dependencies and setup.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- Always include error prevention tasks (dependency verification, type checking, etc.) in the first parent task.
- Include documentation tasks for complex features.
- Consider adding health check scripts for critical features.

## Tasks

- [ ] 1.0 Project Setup and Infrastructure (Error Prevention)
  - [ ] 1.1 Install and verify dependencies
  - [ ] 1.2 Set up TypeScript strict mode
  - [ ] 1.3 Create verification scripts
  - [ ] 1.4 Add error prevention documentation
- [ ] 2.0 Core Feature Implementation
  - [ ] 2.1 [Sub-task description 2.1]
  - [ ] 2.2 [Sub-task description 2.2]
- [ ] 3.0 Testing and Documentation
  - [ ] 3.1 Write unit tests
  - [ ] 3.2 Create feature documentation
- [ ] 4.0 Integration and Deployment
  - [ ] 4.1 Integration testing
  - [ ] 4.2 Deployment preparation
```

## Interaction Model

The process explicitly requires a pause after generating parent tasks to get user confirmation ("Go") before proceeding to generate the detailed sub-tasks. This ensures the high-level plan aligns with user expectations before diving into details.

## Best Practices (Based on Experience)

### Error Prevention
- **Always include dependency verification tasks** in the first parent task
- **Add TypeScript strict mode setup** for type safety
- **Create health check scripts** for critical features
- **Include environment setup verification**

### Documentation
- **Document complex features** with implementation guides
- **Create troubleshooting guides** for common issues
- **Include quick start guides** for new developers
- **Document error prevention strategies**

### Testing Strategy
- **Unit tests for all utilities and components**
- **Integration tests for complex workflows**
- **Error boundary testing** for React components
- **Accessibility testing** for UI components

### Development Workflow
- **Use conventional commit messages**
- **Run health checks before starting work**
- **Verify dependencies after each major change**
- **Test on multiple environments** (dev, staging, prod)

## Target Audience

Assume the primary reader of the task list is a **junior developer** who will implement the feature.

## Common Pitfalls to Avoid

1. **Missing Dependencies**: Always verify all required packages are listed
2. **TypeScript Errors**: Enable strict mode and resolve all type issues
3. **Environment Issues**: Ensure proper .env setup and validation
4. **Responsive Design**: Test on mobile, tablet, and desktop
5. **Accessibility**: Include ARIA labels and keyboard navigation
6. **Performance**: Consider bundle size and loading times
7. **Security**: Validate inputs and handle sensitive data properly