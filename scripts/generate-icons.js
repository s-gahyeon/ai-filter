// 외부 의존성 없이(zlib만 사용) PWA 아이콘 PNG를 생성합니다.
// 마스코트(빨강 배경 + 흰 버섯갓 + 눈)를 단순 도형으로 그립니다.
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function makePNG(size, maskable) {
  const px = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const radius = size * 0.22; // 둥근 모서리
  const inset = maskable ? 0 : 0; // 배경은 전체 채움(마스커블 안전)

  const set = (x, y, r, g, b, a = 255) => {
    const i = (y * size + x) * 4;
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
    px[i + 3] = a;
  };

  // 배경: 대각선 그라데이션 + 둥근 모서리
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // 둥근 모서리 처리
      let inside = true;
      const corners = [
        [radius, radius],
        [size - radius, radius],
        [radius, size - radius],
        [size - radius, size - radius],
      ];
      if (x < radius && y < radius) inside = Math.hypot(x - radius, y - radius) <= radius;
      else if (x > size - radius && y < radius) inside = Math.hypot(x - (size - radius), y - radius) <= radius;
      else if (x < radius && y > size - radius) inside = Math.hypot(x - radius, y - (size - radius)) <= radius;
      else if (x > size - radius && y > size - radius) inside = Math.hypot(x - (size - radius), y - (size - radius)) <= radius;
      void corners;

      if (!inside) {
        set(x, y, 0, 0, 0, 0);
        continue;
      }
      const t = (x + y) / (2 * size);
      // #FF7058 -> #CF302D
      const r = lerp(0xff, 0xcf, t);
      const g = lerp(0x70, 0x30, t);
      const b = lerp(0x58, 0x2d, t);
      set(x, y, r, g, b, 255);
    }
  }

  // 마스코트 갓 (흰 타원)
  const capCY = size * 0.5;
  const capRX = size * 0.3;
  const capRY = size * 0.2;
  const stemCY = size * 0.36;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (px[i + 3] === 0) continue;
      // 갈색 줄기/갓 받침
      const dStem = ((x - cx) / (size * 0.24)) ** 2 + ((y - stemCY) / (size * 0.08)) ** 2;
      if (dStem <= 1) set(x, y, 0x7a, 0x42, 0x20, 255);
      // 흰 갓
      const dCap = ((x - cx) / capRX) ** 2 + ((y - capCY) / capRY) ** 2;
      if (dCap <= 1) set(x, y, 0xff, 0xff, 0xff, 255);
    }
  }
  // 눈
  const eyeY = size * 0.5;
  const eyeRX = size * 0.035;
  const eyeRY = size * 0.05;
  for (const ex of [cx - size * 0.085, cx + size * 0.085]) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const d = ((x - ex) / eyeRX) ** 2 + ((y - eyeY) / eyeRY) ** 2;
        if (d <= 1) set(x, y, 0x12, 0x12, 0x12, 255);
      }
    }
  }

  // 스캔라인 + 필터바이트(0)
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "icon-192.png"), makePNG(192, false));
fs.writeFileSync(path.join(outDir, "icon-512.png"), makePNG(512, false));
fs.writeFileSync(path.join(outDir, "icon-maskable-512.png"), makePNG(512, true));
console.log("icons generated: icon-192.png, icon-512.png, icon-maskable-512.png");
