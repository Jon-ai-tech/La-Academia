#!/bin/bash

# Script to generate placeholder images for the moto scroll sequence
# This creates simple placeholder images using ImageMagick (if available) or creates a simple HTML canvas-based generator

echo "🏍️ Generating placeholder images for Moto Scroll sequence..."

# Check if ImageMagick is available
if command -v convert >/dev/null 2>&1; then
    echo "📸 Using ImageMagick to create placeholder images..."
    
    # Create a few key placeholder images
    for frame in 0001 0075 0151; do
        convert -size 800x600 xc:"#1a1a2e" \
                -fill "#FFC777" -pointsize 48 \
                -draw "text 300,300 'Frame ${frame}'" \
                "assets/scroll-sequence/frame_${frame}.jpg"
        echo "Created frame_${frame}.jpg"
    done
    
    # Create placeholder images
    convert -size 800x600 xc:"#2d2d44" \
            -fill "#FFC777" -pointsize 36 \
            -draw "text 250,300 'Loading...'" \
            "assets/placeholders/loading.jpg"
            
    convert -size 800x600 xc:"#3d1a1a" \
            -fill "#E06C75" -pointsize 36 \
            -draw "text 200,300 'Image Missing'" \
            "assets/placeholders/missing.jpg"
    
    echo "✅ Placeholder images created using ImageMagick"
else
    echo "⚠️ ImageMagick not available, creating basic placeholder files..."
    
    # Create empty placeholder files to prevent 404 errors
    for frame in 0001 0075 0151; do
        touch "assets/scroll-sequence/frame_${frame}.jpg"
        echo "Created placeholder frame_${frame}.jpg"
    done
    
    touch "assets/placeholders/loading.jpg"
    touch "assets/placeholders/missing.jpg"
    
    echo "📝 Basic placeholder files created. For better placeholders, install ImageMagick."
fi

echo "🏍️ Placeholder generation complete!"