#!/bin/bash

echo "🚀 Installing Node.js and setting up Dwello development environment..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH
    if [[ -f "/opt/homebrew/bin/brew" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [[ -f "/usr/local/bin/brew" ]]; then
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/usr/local/bin/brew shellenv)"
    fi
else
    echo "✅ Homebrew is already installed"
fi

# Install Node.js
echo "📦 Installing Node.js..."
brew install node

# Verify installation
echo "🔍 Verifying Node.js installation..."
if command -v node &> /dev/null; then
    echo "✅ Node.js installed successfully: $(node --version)"
    echo "✅ npm installed successfully: $(npm --version)"
else
    echo "❌ Node.js installation failed"
    exit 1
fi

# Install Xcode Command Line Tools if needed
echo "🔧 Checking Xcode Command Line Tools..."
if ! xcode-select -p &> /dev/null; then
    echo "📦 Installing Xcode Command Line Tools..."
    xcode-select --install
    echo "⚠️  Please complete the Xcode installation and run this script again"
    exit 0
else
    echo "✅ Xcode Command Line Tools are installed"
fi

echo ""
echo "🎉 Node.js installation complete!"
echo ""
echo "Next steps:"
echo "1. Run: cd dwello-backend-express && npm install"
echo "2. Run: cd ../dwello && npm install"
echo "3. Set up your database and environment variables"
echo "4. Start the servers:"
echo "   - Backend: cd dwello-backend-express && npm run dev"
echo "   - Frontend: cd dwello && npm run dev" 