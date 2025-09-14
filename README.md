# Promptography - AI Art Gallery

A sophisticated, fully static web application that showcases AI-generated artwork alongside the prompts that created them. Built with modern web technologies and designed for optimal performance and user experience.

![Promptography Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=Promptography+AI+Art+Gallery)

## 🎨 Features

### Core Functionality
- **Dynamic Gallery**: JSON-driven content management with responsive grid layout
- **Modal System**: Immersive single-post viewing experience with keyboard navigation
- **Search & Filter**: Real-time search with category-based filtering
- **Admin Interface**: Multi-step form wizard for content creation and management
- **Progressive Enhancement**: Optimized loading with lazy images and smooth animations

### Technical Highlights
- **Pure Frontend**: HTML5, Tailwind CSS v3.x, Vanilla JavaScript ES6+
- **Performance Optimized**: Sub-3-second load times, progressive loading
- **Accessibility**: WCAG 2.1 AA compliant with semantic HTML and keyboard navigation
- **Responsive Design**: Seamless experience across all devices and screen sizes
- **Glass Morphism**: Modern UI with backdrop blur effects and sophisticated styling

### Design Philosophy
- **Neo-modernist aesthetic** with glassmorphism elements
- **Typography hierarchy** using Playfair Display and Inter fonts
- **Color psychology** with deep indigos and emerald accents
- **8px grid system** for consistent spatial design
- **Micro-interactions** with subtle animations and feedback

## 🚀 Quick Start

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/promptography.git
   cd promptography
   ```

2. Serve the files using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

### Project Structure
```
promptography/
├── index.html              # Main gallery page
├── admin.html              # Content management interface
├── css/                    # Custom stylesheets (if needed)
├── js/
│   ├── main.js            # Main application logic
│   └── admin.js           # Admin interface functionality
├── data/
│   └── data.json          # Gallery content and metadata
├── images/                # Artwork image files
└── README.md              # Project documentation
```

## 📝 Content Management

### Adding New Artwork

1. **Admin Interface**: Navigate to `admin.html` for the guided form wizard
2. **Manual JSON**: Edit `data/data.json` directly following the schema below

### Data Schema
```json
{
  "id": "unique-identifier",
  "title": "Artwork Title",
  "prompt": "The AI prompt used to generate this artwork",
  "image": "images/artwork-filename.jpg",
  "category": "landscapes|portraits|abstract|architecture",
  "tags": ["tag1", "tag2", "tag3"],
  "dateCreated": "YYYY-MM-DD",
  "author": "Artist Name",
  "description": "Detailed description of the artwork",
  "technicalDetails": {
    "model": "AI Model Used",
    "resolution": "1024x1024",
    "iterations": 3,
    "style": "Additional style parameters"
  },
  "metadata": {
    "featured": true|false,
    "likes": 0,
    "views": 0,
    "downloads": 0
  }
}
```

### Image Guidelines
- **Format**: JPG, PNG, or WebP
- **Size**: Minimum 1024x1024px, maximum 5MB
- **Quality**: High resolution, well-composed artwork
- **Naming**: Use the generated ID from the admin interface

## 🎯 Categories

### Available Categories
- **Landscapes**: Natural and fantastical environments
- **Portraits**: Character studies and artistic interpretations  
- **Abstract**: Conceptual and experimental visual explorations
- **Architecture**: Futuristic and historical structural designs

### Adding New Categories
Edit the `categories` array in `data/data.json` and update the filter buttons in `index.html`.

## 🔧 Customization

### Styling
- **Colors**: Modify the Tailwind config in the `<script>` tag of `index.html`
- **Fonts**: Update Google Fonts links and font family definitions
- **Layout**: Adjust grid configurations and spacing classes

### Functionality
- **Search**: Modify search logic in `js/main.js`
- **Filters**: Add new category filters in the `filterGallery()` function
- **Animations**: Customize CSS animations and transitions

## 🚀 Deployment

### Static Hosting Options

#### GitHub Pages
1. Push your code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)

#### Netlify
1. Connect your repository to Netlify
2. Configure build settings (none required for static site)
3. Deploy automatically on push

#### Vercel
1. Import your repository to Vercel
2. Configure as a static site
3. Deploy with automatic previews

### Performance Optimization
- **Image Optimization**: Compress images and use WebP format
- **CDN**: Serve images through a CDN for faster loading
- **Caching**: Configure proper cache headers for static assets
- **Minification**: Minify CSS and JavaScript for production

## 🧪 Browser Support

### Tested Browsers
- **Chrome**: 90+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 90+

### Required Features
- ES6+ JavaScript support
- CSS Grid and Flexbox
- Fetch API
- Intersection Observer API

## 📱 Mobile Optimization

### Responsive Breakpoints
- **Mobile**: 640px and below
- **Tablet**: 641px - 1023px
- **Desktop**: 1024px and above

### Touch Interactions
- Optimized touch targets (minimum 44px)
- Smooth scroll behavior
- Mobile-friendly navigation

## 🎨 Design System

### Typography Scale
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Code**: Courier New (monospace)

### Color Palette
```css
Primary: #6366f1 (Indigo)
Secondary: #10b981 (Emerald)
Background: #0f172a (Slate 900)
Surface: #1e293b (Slate 800)
Text: #f8fafc (Slate 50)
Muted: #64748b (Slate 500)
```

### Spacing System
Based on 8px grid:
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

## 🔒 Security Considerations

### Content Security
- Validate all user inputs in the admin interface
- Sanitize JSON data before rendering
- Use proper file upload restrictions

### Static Site Security
- No server-side vulnerabilities
- Content served over HTTPS
- No database or user authentication required

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers
5. Submit a pull request

### Code Style
- Use semantic HTML5 elements
- Follow BEM methodology for CSS classes
- Use modern JavaScript (ES6+)
- Maintain consistent indentation (2 spaces)

## 📊 Analytics & Monitoring

### Performance Metrics
- **Lighthouse Score**: Target 90+ across all categories
- **Core Web Vitals**: Monitor LCP, FID, and CLS
- **Load Time**: Keep under 3 seconds initial load

### User Analytics
- Page views and session duration
- Popular categories and artworks
- Search queries and filter usage
- Mobile vs desktop usage patterns

## 🐛 Troubleshooting

### Common Issues

#### Images Not Loading
- Check file paths in `data.json`
- Verify image files exist in the `images/` directory
- Ensure proper file permissions

#### JSON Parsing Errors
- Validate JSON syntax in `data.json`
- Check for trailing commas or missing quotes
- Use a JSON validator tool

#### Styling Issues
- Clear browser cache
- Check Tailwind CSS CDN connection
- Verify custom CSS doesn't conflict

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern art galleries and photography portfolios
- **Technical Stack**: Tailwind CSS, Vanilla JavaScript
- **Typography**: Google Fonts (Playfair Display, Inter)
- **Icons**: Heroicons for UI elements

## 📧 Contact

For questions, suggestions, or collaboration opportunities:

- **Project Repository**: [GitHub](https://github.com/your-username/promptography)
- **Issues**: [GitHub Issues](https://github.com/your-username/promptography/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/promptography/discussions)

---

**Promptography** - Where AI prompts meet artistic vision. Crafted with ❤️ for the AI art community.
