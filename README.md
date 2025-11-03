# MyColor - Raycast Extension

<p align="center">
  <img src="assets/color-palette.png" alt="MyColor Icon" width="128" height="128">
</p>

<p align="center">
  <strong>Quick access to your favorite colors in Raycast</strong>
</p>

<p align="center">
  A lightweight Raycast extension that allows you to store, browse, and copy your favorite colors with ease. Perfect for designers, developers, and anyone who works with colors regularly.
</p>

---

## ✨ Features

- 🎨 **Quick Color Access** - Browse your favorite colors instantly through Raycast
- 📋 **One-Click Copy** - Copy hex color codes (`#ff5a5a`) to clipboard with a single action
- 👀 **Visual Previews** - See color swatches directly in the Raycast interface
- 💾 **Local Storage** - Colors are stored locally, no internet connection required
- 🔍 **Search & Filter** - Quickly find colors by name using Raycast's search
- ⚡ **Fast Performance** - Lightweight and responsive interface

## 🚀 Installation

### From Raycast Store (Coming Soon)
1. Open Raycast
2. Search for "MyColor"
3. Click "Install Extension"

### Manual Installation (Development)
1. Clone this repository
2. Follow the [Development Setup](#-development-setup) instructions below
3. Add the extension to Raycast manually

## 📖 Usage

1. **Open Raycast** (`Cmd + Space`)
2. **Type "List Colors"** or just "colors"
3. **Browse your colors** - Use arrow keys or search by name
4. **Copy color** - Press `Enter` or click to copy hex code to clipboard
5. **Paste anywhere** - Use `Cmd + V` to paste the color code

### Default Colors

The extension comes with a few sample colors:
- **Coral Red** - `#ff5a5a`
- **Ocean Blue** - `#3498db`
- **Forest Green** - `#2ecc71`
- **Royal Purple** - `#9b59b6`
- **Sunset Orange** - `#f39c12`

## 🛠 Development Setup

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Raycast** - [Download here](https://raycast.com/)
- **Git** - For version control

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kk-shinoda/MyColors.git
   cd MyColors
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Start development mode**
   ```bash
   npm run dev
   ```
   > This will start the Raycast development server and automatically reload changes

5. **Add extension to Raycast**
   - Open Raycast (`Cmd + Space`)
   - Go to "Extensions" → "Manage Extensions"
   - Click the "+" button
   - Select "Add Application Directory"
   - Choose the project folder (`MyColors`)

6. **Test the extension**
   - Open Raycast (`Cmd + Space`)
   - Type "List Colors"
   - The extension should appear and work

### Development Commands

```bash
# Start development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run TypeScript type checking
npm run type-check

# Run ESLint (code quality)
npm run lint

# Fix ESLint issues automatically
npm run fix-lint
```

### Project Structure

```
MyColors/
├── src/
│   ├── actions/
│   │   └── copyAction.ts      # Clipboard operations
│   ├── services/
│   │   └── colorService.ts    # File I/O operations
│   ├── list-colors.tsx        # Main UI component
│   └── types.ts               # TypeScript definitions
├── assets/
│   ├── color-palette.png      # Extension icon
│   └── README.md              # Asset documentation
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🎯 Roadmap

- [ ] **Color Management** - Add, edit, and delete colors through Raycast
- [ ] **Color Formats** - Support for RGB, HSL, and other color formats
- [ ] **Color Palettes** - Organize colors into themed collections
- [ ] **Import/Export** - Share color collections with others
- [ ] **Color Picker** - Pick colors from screen or images

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm run type-check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Add JSDoc comments for public functions
- Keep components small and focused

## 📝 Color Data Format

Colors are stored in `~/Library/Application Support/raycast-my-color/colors.json`:

```json
[
  {
    "index": 1,
    "name": "Coral Red",
    "rgb": { "r": 255, "g": 90, "b": 90 }
  },
  {
    "index": 2,
    "name": "Ocean Blue", 
    "rgb": { "r": 52, "g": 152, "b": 219 }
  }
]
```

## 🐛 Troubleshooting

### Extension not appearing in Raycast

1. Make sure you've built the extension (`npm run build`)
2. Check that the extension is added to Raycast correctly
3. Try restarting Raycast
4. Check the console for any error messages

### Development mode not working

1. Ensure Raycast CLI is available (`npx ray --version`)
2. Make sure you're in the project directory
3. Try stopping and restarting development mode
4. Check that all dependencies are installed

### Colors not loading

1. Check if the colors file exists at `~/Library/Application Support/raycast-my-color/colors.json`
2. Verify the JSON format is correct
3. Check file permissions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Raycast](https://raycast.com/) - For the amazing platform
- [Raycast API](https://developers.raycast.com/) - For comprehensive documentation
- Contributors and users who provide feedback and suggestions

---

<p align="center">
  Made with ❤️ for the Raycast community
</p>