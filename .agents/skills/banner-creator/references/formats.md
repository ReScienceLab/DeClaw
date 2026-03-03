# Banner Formats Reference

## Platform-Specific Sizes

| Platform | Size (px) | Ratio | Notes |
|----------|-----------|-------|-------|
| **GitHub README** | 1280×640 | 2:1 | Most common for project banners |
| **Twitter/X Header** | 1500×500 | 3:1 | Profile header image |
| **LinkedIn Banner** | 1584×396 | 4:1 | Personal profile background |
| **LinkedIn Company** | 1128×191 | ~6:1 | Company page banner |
| **YouTube Channel** | 2560×1440 | 16:9 | Channel art (safe area: 1546×423) |
| **Facebook Cover** | 820×312 | ~2.6:1 | Personal profile |
| **Discord Server** | 960×540 | 16:9 | Server banner |
| **Website Hero** | 1920×1080 | 16:9 | Full-width hero section |
| **Website Hero (tall)** | 1920×800 | 2.4:1 | Shorter hero section |
| **Email Header** | 600×200 | 3:1 | Newsletter headers |
| **Product Hunt** | 1270×760 | ~1.67:1 | Gallery images |

## Generation Strategy

Since `nano-banana-pro` supports these ratios:
- `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`

**Recommended approach:**
1. Generate at `21:9` (widest available)
2. Crop to target ratio using `crop_banner.py`

This ensures:
- Maximum flexibility for different platforms
- Content centered properly
- No stretching or distortion

## Ratio Quick Reference

```
21:9  ████████████████████████████████  (ultra-wide, cinematic)
16:9  ████████████████████████          (widescreen)
3:1   ████████████████████████████████  (Twitter header)
2:1   ████████████████                  (GitHub README)
4:1   ████████████████████████████████████████████  (LinkedIn)
```

## File Size Guidelines

- **GitHub**: < 10MB, PNG or JPG
- **Twitter**: < 5MB, PNG, JPG, or GIF
- **LinkedIn**: < 8MB, PNG or JPG
- **Website**: Optimize for web (< 500KB ideally)

## Tips

1. **Safe zones**: Keep important content (text, logo) in center 60% for platforms that crop on mobile
2. **Text legibility**: Use high contrast, avoid small text
3. **Brand consistency**: Match colors and style with existing logo
4. **Mobile preview**: Check how banner looks on mobile (often cropped)
