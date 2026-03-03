#!/usr/bin/env python3
"""
Crop banner to target aspect ratio.

Usage:
    python crop_banner.py input.png output.png --ratio 2:1 --width 1280
    python crop_banner.py input.png output.png --ratio 16:9
    python crop_banner.py input.png output.png --size 1500x500
"""

import argparse
import sys
from PIL import Image


def parse_ratio(ratio_str: str) -> tuple[int, int]:
    """Parse ratio string like '2:1' or '16:9' into (width, height) parts."""
    parts = ratio_str.split(':')
    if len(parts) != 2:
        raise ValueError(f"Invalid ratio format: {ratio_str}. Use format like '2:1' or '16:9'")
    return int(parts[0]), int(parts[1])


def parse_size(size_str: str) -> tuple[int, int]:
    """Parse size string like '1280x640' into (width, height)."""
    parts = size_str.lower().split('x')
    if len(parts) != 2:
        raise ValueError(f"Invalid size format: {size_str}. Use format like '1280x640'")
    return int(parts[0]), int(parts[1])


def crop_to_ratio(img: Image.Image, target_ratio: tuple[int, int]) -> Image.Image:
    """Crop image to target aspect ratio, centered."""
    orig_width, orig_height = img.size
    target_w, target_h = target_ratio
    
    target_aspect = target_w / target_h
    orig_aspect = orig_width / orig_height
    
    if orig_aspect > target_aspect:
        # Image is wider than target, crop width
        new_width = int(orig_height * target_aspect)
        new_height = orig_height
        left = (orig_width - new_width) // 2
        top = 0
    else:
        # Image is taller than target, crop height
        new_width = orig_width
        new_height = int(orig_width / target_aspect)
        left = 0
        top = (orig_height - new_height) // 2
    
    right = left + new_width
    bottom = top + new_height
    
    return img.crop((left, top, right, bottom))


def main():
    parser = argparse.ArgumentParser(description='Crop banner to target aspect ratio')
    parser.add_argument('input', help='Input image path')
    parser.add_argument('output', help='Output image path')
    parser.add_argument('--ratio', '-r', help='Target aspect ratio (e.g., 2:1, 16:9)')
    parser.add_argument('--size', '-s', help='Target size (e.g., 1280x640)')
    parser.add_argument('--width', '-w', type=int, help='Target width (maintains ratio)')
    parser.add_argument('--height', type=int, help='Target height (maintains ratio)')
    
    args = parser.parse_args()
    
    if not args.ratio and not args.size:
        print("Error: Must specify --ratio or --size", file=sys.stderr)
        sys.exit(1)
    
    try:
        img = Image.open(args.input)
        print(f"Input: {img.size[0]}x{img.size[1]}")
        
        if args.size:
            target_w, target_h = parse_size(args.size)
            target_ratio = (target_w, target_h)
        else:
            target_ratio = parse_ratio(args.ratio)
            target_w, target_h = None, None
        
        # Crop to ratio
        cropped = crop_to_ratio(img, target_ratio)
        print(f"Cropped: {cropped.size[0]}x{cropped.size[1]}")
        
        # Resize if target dimensions specified
        if args.size:
            cropped = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
            print(f"Resized: {cropped.size[0]}x{cropped.size[1]}")
        elif args.width:
            ratio = args.width / cropped.size[0]
            new_height = int(cropped.size[1] * ratio)
            cropped = cropped.resize((args.width, new_height), Image.Resampling.LANCZOS)
            print(f"Resized: {cropped.size[0]}x{cropped.size[1]}")
        elif args.height:
            ratio = args.height / cropped.size[1]
            new_width = int(cropped.size[0] * ratio)
            cropped = cropped.resize((new_width, args.height), Image.Resampling.LANCZOS)
            print(f"Resized: {cropped.size[0]}x{cropped.size[1]}")
        
        cropped.save(args.output)
        print(f"Saved: {args.output}")
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
