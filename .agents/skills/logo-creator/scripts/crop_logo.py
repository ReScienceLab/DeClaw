#!/usr/bin/env python3
"""
Crop whitespace from logo and center in 1:1 square.

Usage:
    python3 crop_logo.py input.png output.png [--padding 5]
"""

import sys
import os

try:
    from PIL import Image
    import numpy as np
except ImportError:
    print("Error: PIL and numpy required. Install with: pip install Pillow numpy")
    sys.exit(1)


def crop_to_content(image_path, output_path, padding=5, threshold=240):
    """
    Crop whitespace from image and center in 1:1 square.
    
    Args:
        image_path: Path to input image
        output_path: Path to save cropped image
        padding: Pixels of padding around content (default: 5)
        threshold: Pixel value threshold for "white" (default: 240)
    """
    img = Image.open(image_path).convert('RGB')
    data = np.array(img)
    
    # Find non-white pixels (where any channel is below threshold)
    mask = (data[:,:,0] < threshold) | (data[:,:,1] < threshold) | (data[:,:,2] < threshold)
    
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    
    if not np.any(rows) or not np.any(cols):
        print(f"Warning: No content found in {image_path}")
        img.save(output_path)
        return output_path
    
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    # Add padding
    top = max(0, rmin - padding)
    bottom = min(img.size[1], rmax + padding + 1)
    left = max(0, cmin - padding)
    right = min(img.size[0], cmax + padding + 1)
    
    # Crop to content
    cropped = img.crop((left, top, right, bottom))
    
    # Make square
    w, h = cropped.size
    size = max(w, h)
    
    # Create new square image with white background
    square = Image.new('RGB', (size, size), (255, 255, 255))
    
    # Center the cropped image
    x = (size - w) // 2
    y = (size - h) // 2
    square.paste(cropped, (x, y))
    
    square.save(output_path, quality=95)
    
    print(f"Original: {img.size[0]}x{img.size[1]}")
    print(f"Content:  {cmax-cmin+1}x{rmax-rmin+1}")
    print(f"Output:   {size}x{size}")
    print(f"Saved to: {output_path}")
    
    return output_path


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    padding = int(sys.argv[3]) if len(sys.argv) > 3 else 5
    
    if not os.path.exists(input_path):
        print(f"Error: File not found: {input_path}")
        sys.exit(1)
    
    crop_to_content(input_path, output_path, padding)


if __name__ == "__main__":
    main()
