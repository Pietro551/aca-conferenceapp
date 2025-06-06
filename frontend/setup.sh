#!/bin/bash
# South Moravia Conference Booking - Frontend Setup Script

echo "🎨 Setting up South Moravia Conference Booking Frontend..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/ or use:"
    echo "  Windows: choco install nodejs"
    echo "  macOS: brew install node"
    echo "  Linux: sudo apt-get install nodejs npm"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Frontend setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm start"
echo ""
echo "📖 The frontend will be available at:"
echo "   http://localhost:3000"
echo ""
echo "🔗 Make sure the backend is running at:"
echo "   http://localhost:8000"
echo ""
echo "📝 Demo credentials:"
echo "   Admin: admin@example.com / password123"
echo "   User: user@example.com / password123"
