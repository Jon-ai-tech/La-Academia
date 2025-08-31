#!/bin/bash

# Script to generate placeholder images for the moto scroll sequence
# This creates all 151 placeholder images using available tools

echo "🏍️ Generating placeholder images for Moto Scroll sequence..."

# Check if Python enhanced generator exists and use it
if [ -f "generate-placeholders-enhanced.py" ] && command -v python3 >/dev/null 2>&1; then
    echo "🐍 Using Python enhanced generator to create all 151 placeholder images..."
    python3 generate-placeholders-enhanced.py
    if [ $? -eq 0 ]; then
        echo "✅ All placeholder images created successfully"
        exit 0
    else
        echo "⚠️ Python generator failed, falling back to alternative methods..."
    fi
fi

# Check if ImageMagick is available for high-quality placeholders
if command -v convert >/dev/null 2>&1; then
    echo "📸 Using ImageMagick to create placeholder images..."
    
    # Create directories if they don't exist
    mkdir -p assets/scroll-sequence
    mkdir -p assets/placeholders
    
    # Generate ALL 151 frames (not just 3 key frames)
    echo "🏍️ Generating all 151 frame placeholders..."
    for i in $(seq -f "%04g" 1 151); do
        convert -size 800x600 xc:"#1a1a2e" \
                -fill "#FFC777" -pointsize 48 \
                -draw "text 250,300 'Frame ${i}'" \
                "assets/scroll-sequence/frame_${i}.jpg"
        
        # Progress indicator every 25 frames
        frame_num=$((10#$i))  # Convert to decimal, treating as base 10
        if [ $((frame_num % 25)) -eq 0 ] || [ "$i" = "0001" ] || [ "$i" = "0151" ]; then
            echo "✅ Created frame_${i}.jpg"
        fi
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
    
    echo "✅ All placeholder images created using ImageMagick"
else
    echo "⚠️ ImageMagick not available, using fallback method..."
    
    # Create directories if they don't exist
    mkdir -p assets/scroll-sequence
    mkdir -p assets/placeholders
    
    # Create minimal valid JPEG using base64 data
    # This is a 1x1 pixel black JPEG image
    MINIMAL_JPEG_B64="/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB8A"
    
    echo "🏍️ Generating all 151 frame placeholders using base64 method..."
    
    # Generate all 151 frames
    for i in $(seq -f "%04g" 1 151); do
        echo "$MINIMAL_JPEG_B64" | base64 -d > "assets/scroll-sequence/frame_${i}.jpg"
        
        # Progress indicator every 25 frames
        frame_num=$((10#$i))  # Convert to decimal, treating as base 10
        if [ $((frame_num % 25)) -eq 0 ] || [ "$i" = "0001" ] || [ "$i" = "0151" ]; then
            echo "✅ Created frame_${i}.jpg"
        fi
    done
    
    # Create placeholder images
    echo "$MINIMAL_JPEG_B64" | base64 -d > "assets/placeholders/loading.jpg"
    echo "$MINIMAL_JPEG_B64" | base64 -d > "assets/placeholders/missing.jpg"
    
    echo "✅ All placeholder images created using base64 method"
fi

echo "🏍️ Placeholder generation complete!"
echo "📊 Generated: 151 frame images + 2 placeholder images = 153 total images"
echo "📋 Next: Test your application - image loading errors should be resolved!"