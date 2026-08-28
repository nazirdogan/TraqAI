import zlib, struct, math

W, H = 1200, 630
BG   = (0x1D, 0x19, 0x16)
GOLD = (0xA8, 0x87, 0x4F)
SOFT = (0xC9, 0xAC, 0x77)
BONE = (0xF2, 0xEC, 0xE3)

buf = [[BG[0], BG[1], BG[2]] for _ in range(W * H)]

def blend(x, y, color, a):
    if a <= 0 or x < 0 or y < 0 or x >= W or y >= H: return
    a = min(1.0, a); i = y * W + x; p = buf[i]
    for c in range(3):
        p[c] = int(round(p[c] * (1 - a) + color[c] * a))

def seg(x0, y0, x1, y1, w, color, alpha=1.0):
    r = w / 2.0
    dx, dy = x1 - x0, y1 - y0
    L2 = dx * dx + dy * dy
    pad = int(r + 2)
    for y in range(int(min(y0, y1)) - pad, int(max(y0, y1)) + pad + 1):
        for x in range(int(min(x0, x1)) - pad, int(max(x0, x1)) + pad + 1):
            px, py = x + 0.5, y + 0.5
            t = 0.0 if L2 == 0 else max(0.0, min(1.0, ((px - x0) * dx + (py - y0) * dy) / L2))
            d = math.hypot(px - (x0 + t * dx), py - (y0 + t * dy))
            cov = max(0.0, min(1.0, r + 0.5 - d))
            if cov > 0: blend(x, y, color, cov * alpha)

def polyline(pts, w, color, alpha=1.0):
    for i in range(len(pts) - 1):
        seg(pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1], w, color, alpha)

def arcpts(cx, cy, rx, ry, a0, a1, steps=40):
    return [(cx + rx * math.cos(a0 + (a1 - a0) * i / steps),
             cy + ry * math.sin(a0 + (a1 - a0) * i / steps)) for i in range(steps + 1)]

def arc(cx, cy, r, a0, a1, w, color, alpha=1.0, steps=48):
    polyline(arcpts(cx, cy, r, r, a0, a1, steps), w, color, alpha)

# ---------------------------------------------------------------- stroke font
# Glyphs live in a 0..adv wide, 0..1 tall box (y=0 is the cap line).
D = math.pi / 180.0
FONT = {
    'N': (0.62, [('L', [(0, 1), (0, 0), (0.62, 1), (0.62, 0)])]),
    'O': (0.66, [('A', (0.33, 0.5, 0.33, 0.5, 0, 360))]),
    'R': (0.60, [('L', [(0, 1), (0, 0), (0.30, 0)]),
                 ('A', (0.30, 0.27, 0.27, 0.27, -90, 90)),
                 ('L', [(0.30, 0.54), (0, 0.54)]),
                 ('L', [(0.26, 0.54), (0.60, 1)])]),
    'A': (0.64, [('L', [(0, 1), (0.32, 0), (0.64, 1)]), ('L', [(0.13, 0.64), (0.51, 0.64)])]),
    'T': (0.62, [('L', [(0, 0), (0.62, 0)]), ('L', [(0.31, 0), (0.31, 1)])]),
    'E': (0.54, [('L', [(0.54, 0), (0, 0), (0, 1), (0.54, 1)]), ('L', [(0, 0.5), (0.44, 0.5)])]),
    'L': (0.50, [('L', [(0, 0), (0, 1), (0.50, 1)])]),
    'I': (0.10, [('L', [(0.05, 0), (0.05, 1)])]),
    'D': (0.62, [('L', [(0, 1), (0, 0), (0.30, 0)]),
                 ('A', (0.30, 0.5, 0.32, 0.5, -90, 90)),
                 ('L', [(0.30, 1), (0, 1)])]),
    'U': (0.62, [('L', [(0, 0), (0, 0.70)]), ('L', [(0.62, 0), (0.62, 0.70)]),
                 ('A', (0.31, 0.70, 0.31, 0.30, 0, 180))]),
    'B': (0.58, [('L', [(0, 1), (0, 0), (0.28, 0)]),
                 ('A', (0.28, 0.25, 0.26, 0.25, -90, 90)),
                 ('L', [(0.28, 0.5), (0, 0.5)]), ('L', [(0.28, 0.5), (0.28, 0.5)]),
                 ('A', (0.28, 0.75, 0.28, 0.25, -90, 90)),
                 ('L', [(0.28, 1), (0, 1)])]),
    ' ': (0.42, []),
}

def text(s, cx, top, cap, tracking, w, color, alpha=1.0):
    adv = [FONT[ch][0] * cap + tracking for ch in s]
    total = sum(adv) - tracking
    x = cx - total / 2.0
    for ch in s:
        gw, strokes = FONT[ch]
        for kind, data in strokes:
            if kind == 'L':
                polyline([(x + px * cap, top + py * cap) for px, py in data], w, color, alpha)
            else:
                gx, gy, rx, ry, a0, a1 = data
                polyline(arcpts(x + gx * cap, top + gy * cap, rx * cap, ry * cap,
                                a0 * D, a1 * D, 56), w, color, alpha)
        x += gw * cap + tracking

# ------------------------------------------------------------------ backdrop
for y in range(H):
    for x in range(W):
        d = math.hypot((x - 600) / 540.0, (y - 250) / 360.0)
        g = max(0.0, 1.0 - d)
        if g > 0: blend(x, y, GOLD, 0.09 * g * g)

m = 44
seg(m, m, W - m, m, 1.6, SOFT, 0.4)
seg(m, H - m, W - m, H - m, 1.6, SOFT, 0.4)
seg(m, m, m, H - m, 1.6, SOFT, 0.4)
seg(W - m, m, W - m, H - m, 1.6, SOFT, 0.4)

# ---------------------------------------------------------------- hanger mark
cx, cy = 600, 196
arc(cx, cy - 44, 16, 150 * D, 390 * D, 5.5, GOLD)
seg(cx, cy - 29, cx, cy + 2, 5.5, GOLD)
polyline([(cx, cy + 2), (cx - 120, cy + 84), (cx + 120, cy + 84), (cx, cy + 2)], 5.5, GOLD)
seg(cx - 138, cy + 84, cx + 138, cy + 84, 5.5, GOLD)

# ------------------------------------------------------------------ wordmark
text('NOOR ATELIER', 600, 372, 58, 13, 4.0, BONE)
seg(500, 486, 700, 486, 1.4, SOFT, 0.7)

text('DUBAI', 600, 522, 22, 12, 2.2, SOFT, 0.95)

raw = bytearray()
for y in range(H):
    raw.append(0)
    for p in buf[y * W:(y + 1) * W]:
        raw += bytes(p)

def chunk(tag, data):
    return (struct.pack('>I', len(data)) + tag + data +
            struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff))

png = (b'\x89PNG\r\n\x1a\n'
       + chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 2, 0, 0, 0))
       + chunk(b'IDAT', zlib.compress(bytes(raw), 9))
       + chunk(b'IEND', b''))
open('assets/img/og.png', 'wb').write(png)
print('og.png', len(png), 'bytes')
