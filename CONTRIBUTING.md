# Contributing to BIM Speckle Viewer

We welcome contributions to the BIM Speckle Viewer project! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/bim-speckle-viewer.git`
3. Install dependencies: `npm run setup`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Guidelines

### Code Style

- Use modern JavaScript/React patterns
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and reusable

### Backend Guidelines

- Use Express.js best practices
- Implement proper error handling
- Add input validation
- Use middleware appropriately
- Follow RESTful API conventions

### Frontend Guidelines

- Use React hooks and functional components
- Implement proper state management with Zustand
- Use styled-components for styling
- Ensure responsive design
- Add loading states and error handling

### Testing

- Test new features thoroughly
- Verify file upload functionality
- Test Speckle URL loading
- Check cross-browser compatibility
- Test with various BIM file formats

## Types of Contributions

### Bug Reports

- Use the issue template
- Provide steps to reproduce
- Include environment details
- Add screenshots if relevant

### Feature Requests

- Describe the use case
- Explain the expected behavior
- Consider implementation complexity
- Discuss with maintainers first

### Code Contributions

- Focus on one feature per PR
- Update documentation as needed
- Add tests for new functionality
- Ensure backward compatibility

## Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Add inline code comments
   - Update API documentation

2. **Test Thoroughly**
   - Test locally with `npm run dev`
   - Verify all features work
   - Test with different file types
   - Check responsive design

3. **Commit Standards**
   ```
   feat: add new file format support
   fix: resolve upload progress bug
   docs: update installation guide
   style: improve button styling
   refactor: optimize viewer performance
   ```

4. **Create Pull Request**
   - Use descriptive title
   - Explain changes in detail
   - Reference related issues
   - Add screenshots if UI changes

## Development Setup

### Environment

```bash
# Install dependencies
npm run setup

# Start development
npm run dev

# Access application
open http://localhost:3000
```

### File Structure

When adding new features:

- **Components**: Add to `client/src/components/`
- **Pages**: Add to `client/src/pages/`
- **API Routes**: Add to `server/routes/`
- **Utilities**: Add to appropriate utility folders

### Adding New File Formats

1. Update `server/routes/upload.js`:
   ```javascript
   const SUPPORTED_FORMATS = {
     '.newformat': 'application/new-format',
     // ... existing formats
   };
   ```

2. Update frontend validation
3. Test with sample files
4. Update documentation

### Adding Speckle Features

1. Add API endpoints in `server/routes/speckle.js`
2. Update frontend components
3. Test with real Speckle data
4. Handle edge cases

## Code Review Guidelines

### For Contributors

- Respond to feedback promptly
- Make requested changes
- Keep discussions professional
- Be open to suggestions

### For Reviewers

- Be constructive and helpful
- Focus on code quality
- Check for security issues
- Verify functionality
- Test the changes

## Security Considerations

- Validate all user inputs
- Sanitize file uploads
- Use HTTPS in production
- Implement rate limiting
- Handle errors gracefully
- Don't expose sensitive information

## Performance Guidelines

- Optimize large file handling
- Implement proper loading states
- Use efficient data structures
- Consider memory usage
- Optimize bundle sizes
- Use lazy loading where appropriate

## Documentation

- Update README.md for new features
- Add inline code documentation
- Update API documentation
- Include usage examples
- Keep documentation current

## Questions and Support

- Check existing issues first
- Use GitHub Discussions for questions
- Tag maintainers if needed
- Be patient with responses

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to BIM Speckle Viewer!