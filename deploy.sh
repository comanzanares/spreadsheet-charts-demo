#!/bin/bash

# 🚀 Quick Deploy Script for Spreadsheet Charts Demo
# This script will help you deploy your app quickly

echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🎯 Vercel CLI detected! Deploying to Vercel..."
    vercel --prod
elif command -v netlify &> /dev/null; then
    echo "🌐 Netlify CLI detected! Deploying to Netlify..."
    netlify deploy --prod --dir=build
else
    echo "📋 No deployment CLI detected."
    echo ""
    echo "Choose your deployment option:"
    echo ""
    echo "1. 🎯 Vercel (Recommended):"
    echo "   npm install -g vercel"
    echo "   vercel --prod"
    echo ""
    echo "2. 🌐 Netlify:"
    echo "   npm install -g netlify-cli"
    echo "   netlify deploy --prod --dir=build"
    echo ""
    echo "3. 📄 GitHub Pages:"
    echo "   npm install --save-dev gh-pages"
    echo "   npm run deploy"
    echo ""
    echo "4. 📁 Manual:"
    echo "   Your build folder is ready at: ./build"
    echo "   Upload this folder to any static hosting service"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
fi

echo "🎉 Deployment process completed!" 