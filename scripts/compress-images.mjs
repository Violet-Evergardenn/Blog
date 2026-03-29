/**
 * 批量压缩 public/blog-img/ 下的图片
 * - JPG/PNG → WebP，质量 82，长边限制 1200px
 * - 原文件保留（输出到同目录，加 .webp 后缀）
 * - 同时更新 src/data/pictures.ts 中的路径
 *
 * 运行：node scripts/compress-images.mjs
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INPUT_DIR = path.join(__dirname, '../public/blog-img')
const QUALITY = 90        // 提高质量，避免模糊
const MAX_SIDE = 1600     // 放宽分辨率上限

// 扫描目录，按 baseName 分组，优先选 PNG（无损源）> JPG > JPEG
const allFiles = fs.readdirSync(INPUT_DIR)
const sourceMap = new Map() // baseName → 最优源文件名

for (const f of allFiles) {
  const ext = path.extname(f).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue
  const base = path.basename(f, ext)
  const existing = sourceMap.get(base)
  // PNG 优先级最高，其次是 JPG
  if (!existing) { sourceMap.set(base, f); continue }
  const existExt = path.extname(existing).toLowerCase()
  if (ext === '.png' && existExt !== '.png') sourceMap.set(base, f)
}

const files = [...sourceMap.values()]
console.log(`\n🖼  找到 ${files.length} 张最优源文件，开始压缩（quality=${QUALITY}）...\n`)

let savedTotal = 0

for (const file of files) {
  const inputPath = path.join(INPUT_DIR, file)
  const baseName = path.basename(file, path.extname(file))
  const outputPath = path.join(INPUT_DIR, `${baseName}.webp`)

  const originalSize = fs.statSync(inputPath).size

  try {
    const img = sharp(inputPath)
    const meta = await img.metadata()
    const maxDim = Math.max(meta.width || 0, meta.height || 0)

    let pipeline = img
    if (maxDim > MAX_SIDE) {
      // 等比缩小，长边限制为 MAX_SIDE
      pipeline = pipeline.resize(
        (meta.width || 0) >= (meta.height || 0) ? MAX_SIDE : null,
        (meta.height || 0) > (meta.width || 0) ? MAX_SIDE : null,
        { fit: 'inside', withoutEnlargement: true }
      )
    }

    // 若输入输出路径相同（原本就是 .webp），先写临时文件再替换
    const isSameFile = inputPath === outputPath
    const writePath = isSameFile ? outputPath + '.tmp' : outputPath

    await pipeline
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(writePath)

    if (isSameFile) {
      // 先删除旧文件再重命名（避免 Windows EPERM）
      fs.unlinkSync(outputPath)
      fs.renameSync(writePath, outputPath)
    }

    const newSize = fs.statSync(outputPath).size
    const saved = originalSize - newSize
    savedTotal += saved
    const ratio = ((saved / originalSize) * 100).toFixed(1)

    console.log(
      `  ✅ ${file.padEnd(26)} ${(originalSize / 1024).toFixed(0).padStart(5)} KB → ` +
      `${(newSize / 1024).toFixed(0).padStart(5)} KB  (-${ratio}%)`
    )
  } catch (err) {
    console.error(`  ❌ ${file}: ${err.message}`)
  }
}

console.log(`\n🎉 完成！共节省 ${(savedTotal / 1024 / 1024).toFixed(2)} MB\n`)

// ─── 自动更新 src/data/pictures.ts 中的图片路径 ──────────────────────────────
const DATA_FILE = path.join(__dirname, '../src/data/pictures.ts')
let content = fs.readFileSync(DATA_FILE, 'utf-8')

// 把 .jpg/.jpeg/.png 替换为 .webp
const updated = content.replace(
  /\/blog-img\/([\w-]+)\.(jpg|jpeg|png)/g,
  '/blog-img/$1.webp'
)

if (updated !== content) {
  fs.writeFileSync(DATA_FILE, updated, 'utf-8')
  console.log('📝 已自动更新 src/data/pictures.ts 中的图片路径（.jpg/.png → .webp）\n')
} else {
  console.log('📝 src/data/pictures.ts 路径无需更新\n')
}
