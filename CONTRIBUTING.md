# 🤝 Contributing to MUNC Inventory Management System

First off, thank you for considering contributing to MUNC! It's people like you that make MUNC such a great tool for inventory management.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal/political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- A **GitHub account**
- Basic knowledge of **React**, **TypeScript**, and **Tailwind CSS**

### Quick Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MUNC.git
   cd MUNC
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Neerajupadhayay2004/MUNC.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🎯 How to Contribute

### Types of Contributions

We welcome many types of contributions:

#### 🐛 **Bug Reports**
- Found a bug? Please create an issue with detailed steps to reproduce
- Include screenshots, error messages, and system information
- Check existing issues first to avoid duplicates

#### ✨ **Feature Requests**
- Have an idea for a new feature?
- Create an issue with the "enhancement" label
- Describe the problem it solves and proposed solution

#### 📝 **Documentation**
- Improve README, code comments, or create tutorials
- Fix typos, improve clarity, or add examples
- Translate documentation to other languages

#### 🔧 **Code Contributions**
- Fix bugs, implement new features, or improve performance
- Enhance UI/UX, add tests, or refactor code
- Follow our coding standards and guidelines

#### 🎨 **Design Contributions**
- Improve UI/UX design
- Create icons, graphics, or illustrations
- Suggest design improvements

## 🛠️ Development Setup

### Project Structure

```
MUNC/
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utility functions
│   └── styles/             # CSS styles
├── public/                 # Static assets
├── docs/                   # Documentation
└── tests/                  # Test files
```

### Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure environment variables**
   ```env
   VITE_APP_NAME=MUNC Inventory System
   VITE_ENABLE_QR_SCANNER=true
   VITE_DEBUG_MODE=false
   ```

3. **Verify setup**
   ```bash
   npm run dev
   # Visit http://localhost:5173
   ```

## 📏 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Use descriptive names
interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
}

// ✅ Good: Use proper typing
const createProduct = async (data: ProductFormData): Promise<Product> => {
  // Implementation
}

// ❌ Bad: Avoid any types
const processData = (data: any) => {
  // Implementation
}
```

### React Component Guidelines

```typescript
// ✅ Good: Functional components with proper props
interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete
}) => {
  // Component implementation
}

// ✅ Good: Use hooks properly
const useProductData = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Hook implementation
  
  return { product, loading }
}
```

### CSS/Tailwind Guidelines

```typescript
// ✅ Good: Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
    Product Name
  </h3>
</div>

// ✅ Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

### File Naming Conventions

```
✅ Components: PascalCase
   - ProductCard.tsx
   - QRScanner.tsx
   - VariantTabs.tsx

✅ Utilities: camelCase
   - storage.ts
   - validation.ts
   - helpers.ts

✅ Types: PascalCase
   - Product.ts
   - Auth.ts
   - API.ts

✅ Constants: UPPER_SNAKE_CASE
   - PRODUCT_TYPES.ts
   - API_ENDPOINTS.ts
```

## 📝 Commit Guidelines

### Commit Message Format

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
# ✅ Good commit messages
feat(scanner): add QR code generation functionality
fix(variants): resolve color picker validation issue
docs(readme): update installation instructions
style(components): format ProductCard component
refactor(storage): improve localStorage error handling
perf(dashboard): optimize product list rendering
test(utils): add validation helper tests
chore(deps): update React to version 18.2.0

# ❌ Bad commit messages
fix bug
update stuff
changes
working on feature
```

### Commit Best Practices

- Use the imperative mood ("Add feature" not "Added feature")
- Keep the first line under 50 characters
- Reference issues and pull requests when applicable
- Include breaking changes in the footer

## 🔄 Pull Request Process

### Before Submitting

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run test
   npm run build
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Template

When creating a pull request, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots
If applicable, add screenshots to help explain your changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **At least one maintainer** will review your PR
3. **Address feedback** promptly and professionally
4. **Squash commits** if requested before merging
5. **Celebrate** your contribution! 🎉

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for solutions
3. **Try the latest version** to see if it's already fixed

### Bug Report Template

```markdown
**Bug Description**
A clear and concise description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Node.js: [e.g., 18.0.0]
- MUNC Version: [e.g., 1.0.0]

**Additional Context**
Any other context about the problem.
```

### Feature Request Template

```markdown
**Feature Description**
A clear and concise description of the feature.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How would you like this feature to work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Screenshots, mockups, or examples.
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test ProductCard.test.tsx
```

### Writing Tests

```typescript
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '../ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    stock: 10
  }

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('10 in stock')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn()
    render(<ProductCard product={mockProduct} onEdit={mockOnEdit} />)
    
    fireEvent.click(screen.getByText('Edit'))
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct)
  })
})
```

### Testing Guidelines

- **Write tests** for new features and bug fixes
- **Aim for high coverage** but focus on critical paths
- **Test user interactions** not implementation details
- **Use meaningful test descriptions**
- **Mock external dependencies**

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Creates a new product with the provided data
 * @param productData - The product information
 * @param options - Additional options for product creation
 * @returns Promise resolving to the created product
 * @throws {ValidationError} When product data is invalid
 */
export const createProduct = async (
  productData: ProductFormData,
  options: CreateProductOptions = {}
): Promise<Product> => {
  // Implementation
}
```

### README Updates

When making significant changes:
- Update feature lists
- Add new screenshots
- Update installation instructions
- Add new configuration options

### API Documentation

For new API endpoints or changes:
```typescript
/**
 * @api {post} /api/products Create Product
 * @apiName CreateProduct
 * @apiGroup Products
 * 
 * @apiParam {String} name Product name
 * @apiParam {Number} price Product price
 * @apiParam {String} [description] Product description
 * 
 * @apiSuccess {String} id Product ID
 * @apiSuccess {String} name Product name
 * @apiSuccess {Number} price Product price
 * 
 * @apiError ValidationError Invalid input data
 */
```

## 🌟 Recognition

### Contributors

All contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for their contributions
- **GitHub contributors** page
- **Special mentions** for significant contributions

### Contribution Levels

- **🥉 Bronze**: 1-5 merged PRs
- **🥈 Silver**: 6-15 merged PRs
- **🥇 Gold**: 16+ merged PRs or major features
- **💎 Diamond**: Core maintainers and exceptional contributors

## 🆘 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: neerajupadhyay2004@gmail.com for sensitive issues

### Response Times

- **Bug reports**: Within 24-48 hours
- **Feature requests**: Within 3-5 days
- **Pull requests**: Within 1-2 weeks
- **Security issues**: Within 24 hours

### Questions?

Don't hesitate to ask questions! We're here to help:

1. **Check existing documentation** first
2. **Search GitHub issues** for similar questions
3. **Create a new discussion** for general questions
4. **Create an issue** for specific problems

## 🎉 Thank You!

Thank you for contributing to MUNC! Your efforts help make inventory management better for everyone.

**Remember**: Every contribution matters, whether it's:
- Fixing a typo
- Reporting a bug
- Suggesting a feature
- Writing code
- Improving documentation
- Helping other users

**Happy Contributing!** 🚀

---

<div align="center">

**🤝 Built by the Community, For the Community**

[📂 Back to Repository](https://github.com/Neerajupadhayay2004/MUNC) | [🌐 Live Demo](https://munc02.netlify.app/) | [📝 Documentation](README.md)

</div>
