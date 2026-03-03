# Nano Banana Prompt Reference

## Prompt Structure

A good prompt typically includes:
1. **Subject** - What to generate
2. **Style** - Artistic style or aesthetic
3. **Details** - Lighting, colors, composition
4. **Quality** - Resolution hints, professional quality

## Categories

### Pixel Art / 8-bit

```
Pixel art {subject}, 8-bit retro style, limited color palette, 
crisp pixels, nostalgic video game aesthetic
```

**Examples:**
```
Pixel art robot mascot, 8-bit style, blue and orange colors, 
friendly expression, transparent background

Pixel art landscape, retro video game style, sunset colors, 
16-bit era aesthetic, side-scrolling game background

Pixel art food icons, 8-bit style, bright colors, 
game UI elements, clean pixel edges
```

### Photorealistic

```
Professional photograph of {subject}, {lighting} lighting,
{lens} lens, high resolution, sharp focus, {mood}
```

**Examples:**
```
Professional product photo of wireless headphones on marble surface,
soft studio lighting, 85mm lens, high resolution, minimalist background

Portrait photograph of elderly craftsman in workshop,
natural window lighting, 50mm lens, shallow depth of field,
warm tones, documentary style

Aerial photograph of coastal city at golden hour,
drone perspective, dramatic lighting, high dynamic range
```

### Digital Art / Illustration

```
Digital illustration of {subject}, {style} style,
{colors} color palette, {mood} atmosphere
```

**Examples:**
```
Digital illustration of enchanted forest, fantasy art style,
purple and teal color palette, mystical atmosphere,
detailed foliage, magical creatures

Character concept art, cyberpunk style, neon lighting,
futuristic armor design, dynamic pose, professional quality

Children's book illustration, whimsical style, pastel colors,
friendly animals in meadow, soft edges, storybook quality
```

### Minimalist / Flat Design

```
Minimalist {subject}, flat design, {colors}, 
clean lines, simple shapes, modern aesthetic
```

**Examples:**
```
Minimalist logo design, geometric mountain shape,
blue gradient, flat design, vector style, clean edges

Minimalist app icon, flat design, single color,
simple shape, rounded corners, iOS style

Minimalist infographic elements, flat icons,
corporate blue palette, clean vector style
```

### 3D / Isometric

```
3D render of {subject}, isometric view, {style},
soft shadows, {colors}, clean background
```

**Examples:**
```
3D isometric office workspace, low poly style,
pastel colors, soft shadows, cute aesthetic

3D render of floating island, isometric perspective,
fantasy environment, vibrant colors, game asset style

Isometric city block, architectural visualization,
modern buildings, clean lines, professional render
```

### Abstract / Artistic

```
Abstract {subject}, {style} style, {colors},
{texture}, artistic composition
```

**Examples:**
```
Abstract fluid art, vibrant colors, marble texture,
flowing shapes, high contrast, contemporary style

Abstract geometric pattern, bauhaus style,
primary colors, sharp edges, modernist aesthetic

Abstract landscape, impressionist style,
soft brushstrokes, dreamy atmosphere, oil painting texture
```

## Aspect Ratio Guidelines

| Ratio | Use Case | Example Prompt Suffix |
|-------|----------|----------------------|
| 1:1 | Icons, avatars, social posts | "square format, centered composition" |
| 16:9 | Banners, YouTube thumbnails | "wide format, horizontal composition" |
| 9:16 | Phone wallpapers, stories | "vertical format, portrait orientation" |
| 21:9 | Cinematic, ultra-wide | "cinematic aspect ratio, panoramic view" |
| 4:3 | Presentations, traditional | "standard format, classic composition" |
| 2:3 | Portrait photos | "portrait orientation, full body framing" |

## Quality Modifiers

**Resolution hints:**
- "high resolution"
- "4K quality"
- "ultra detailed"
- "sharp focus"
- "crisp details"

**Professional quality:**
- "professional photograph"
- "studio quality"
- "commercial grade"
- "publication ready"
- "award winning"

**Style consistency:**
- "consistent style"
- "cohesive aesthetic"
- "unified color palette"
- "matching visual language"

## Negative Concepts

To avoid unwanted elements, describe what you want clearly:

Instead of: "no text"
Use: "clean image without text, pure visual"

Instead of: "no people"
Use: "empty scene, unpopulated environment"

Instead of: "not blurry"
Use: "sharp focus, crisp details, high clarity"

## Batch Generation Tips

When generating multiple variations:

1. **Keep core prompt consistent** - Same subject and style
2. **Vary specific details** - Colors, poses, backgrounds
3. **Use numbered batches** - Track which prompts work best
4. **Iterate on winners** - Refine prompts that produce good results

**Example batch workflow:**
```bash
# Round 1: Explore styles
"pixel art robot, 8-bit style, blue colors"
"pixel art robot, retro game style, warm colors"
"pixel art robot, modern pixel art, neon colors"

# Round 2: Refine best style
"pixel art robot, 8-bit style, blue and silver colors, friendly expression"
"pixel art robot, 8-bit style, blue and gold colors, heroic pose"
```
