#!/usr/bin/env node
/**
 * Optimize images: convert PNG → WebP, resize large images
 * Run: node scripts/optimize-images.mjs
 */
import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PUBLIC_DIR = join(__dirname, '..', 'public')
const MASCOT_DIR = join(PUBLIC_DIR, 'mascot')

async function optimizeImage(inputPath, options = {}) {
  const { maxWidth = 1920, quality = 80, suffix = '' } = options
  const outputPath = inputPath.replace(/\.png$/i, '.webp')
  
  try {
    const metadata = await sharp(inputPath).metadata()
    const originalStat = await stat(inputPath)
    
    let pipeline = sharp(inputPath)
    
    // Resize if wider than maxWidth
    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true })
    }
    
    // Convert to WebP
    pipeline = pipeline.webp({ quality, effort: 6 })
    
    await pipeline.toFile(outputPath)
    
    const newStat = await stat(outputPath)
    const saved = ((1 - newStat.size / originalStat.size) * 100).toFixed(1)
    
    console.log(`✅ ${inputPath.split('/').pop()} → ${outputPath.split('/').pop()} (${(originalStat.size/1024).toFixed(0)}KB → ${(newStat.size/1024).toFixed(0)}KB, -${saved}%)`)
    
    return { input: inputPath, output: outputPath, original: originalStat.size, optimized: newStat.size }
  } catch (err) {
    console.error(`❌ Failed: ${inputPath} — ${err.message}`)
    return null
  }
}

async function run() {
  console.log('🖼️  Optimizing images...\n')
  
  const results = []
  
  // Background images — resize to 1920px max, high quality
  const bgFiles = ['dark-theme-bg.png', 'light-theme-bg.png']
  for (const file of bgFiles) {
    const path = join(PUBLIC_DIR, file)
    try {
      await stat(path)
      const r = await optimizeImage(path, { maxWidth: 1920, quality: 75 })
      if (r) results.push(r)
    } catch {
      // File doesn't exist, skip
    }
  }
  
  // Mascot images — keep smaller, resize to 400px max
  try {
    const mascotFiles = await readdir(MASCOT_DIR)
    for (const file of mascotFiles) {
      if (extname(file).toLowerCase() === '.png') {
        const r = await optimizeImage(join(MASCOT_DIR, file), { maxWidth: 400, quality: 85 })
        if (r) results.push(r)
      }
    }
  } catch {
    // Mascot dir doesn't exist
  }
  
  // Summary
  if (results.length > 0) {
    const totalOriginal = results.reduce((s, r) => s + r.original, 0)
    const totalOptimized = results.reduce((s, r) => s + r.optimized, 0)
    const saved = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1)
    console.log(`\n📊 Total: ${(totalOriginal/1024).toFixed(0)}KB → ${(totalOptimized/1024).toFixed(0)}KB (-${saved}%)`)
    console.log(`\n💡 Update your code to use .webp extensions:`)
    console.log(`   /dark-theme-bg.png → /dark-theme-bg.webp`)
    console.log(`   /light-theme-bg.png → /light-theme-bg.webp`)
    console.log(`   /mascot/octo-main.png → /mascot/octo-main.webp`)
  }
}

run().catch(console.error)
