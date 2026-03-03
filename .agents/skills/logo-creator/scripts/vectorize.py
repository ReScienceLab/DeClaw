#!/usr/bin/env python3
"""
Convert raster image to SVG using Recraft API.

Requires RECRAFT_API_KEY environment variable.

Usage:
    python3 vectorize.py input.png output.svg
"""

import sys
import os
import subprocess
import json


def vectorize_image(input_path, output_path):
    """
    Convert raster image to SVG using Recraft API.
    
    Args:
        input_path: Path to input image (PNG, JPG, or WEBP)
        output_path: Path to save SVG output
    """
    api_key = os.environ.get('RECRAFT_API_KEY')
    
    if not api_key:
        # Try to get from ~/.zshrc
        try:
            result = subprocess.run(
                ['grep', 'RECRAFT_API_KEY', os.path.expanduser('~/.zshrc')],
                capture_output=True, text=True
            )
            if result.stdout:
                api_key = result.stdout.split('"')[1]
        except:
            pass
    
    if not api_key:
        print("Error: RECRAFT_API_KEY not found in environment or ~/.zshrc")
        print("Get your API key from: https://www.recraft.ai/")
        sys.exit(1)
    
    if not os.path.exists(input_path):
        print(f"Error: File not found: {input_path}")
        sys.exit(1)
    
    # Step 1: Call Recraft API to vectorize
    print(f"Vectorizing: {input_path}")
    
    cmd = [
        'curl', '-s', '-X', 'POST',
        'https://external.api.recraft.ai/v1/images/vectorize',
        '-H', f'Authorization: Bearer {api_key}',
        '-H', 'Content-Type: multipart/form-data',
        '-F', f'file=@{input_path}'
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        sys.exit(1)
    
    try:
        response = json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"Error: Invalid API response: {result.stdout}")
        sys.exit(1)
    
    if 'error' in response:
        print(f"API Error: {response['error']}")
        sys.exit(1)
    
    svg_url = response.get('image', {}).get('url')
    if not svg_url:
        print(f"Error: No SVG URL in response: {response}")
        sys.exit(1)
    
    print(f"SVG URL: {svg_url}")
    
    # Step 2: Download the SVG
    download_cmd = ['curl', '-s', svg_url, '-o', output_path]
    result = subprocess.run(download_cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error downloading SVG: {result.stderr}")
        sys.exit(1)
    
    # Verify output
    if os.path.exists(output_path) and os.path.getsize(output_path) > 100:
        # Check if it's actually an SVG
        with open(output_path, 'r') as f:
            content = f.read(100)
            if '<svg' in content.lower() or '<?xml' in content.lower():
                print(f"Success! Saved to: {output_path}")
                print(f"File size: {os.path.getsize(output_path) / 1024:.1f} KB")
            else:
                print(f"Warning: Output may not be a valid SVG")
                print(f"First 100 chars: {content}")
    else:
        print("Error: Failed to download SVG")
        sys.exit(1)
    
    return output_path


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    vectorize_image(input_path, output_path)


if __name__ == "__main__":
    main()
