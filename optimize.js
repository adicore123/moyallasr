import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 🛡️ הגדרות __dirname בסביבת ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 הגדרת תיקיית המקור והפלט
const inputDir = path.join(__dirname, 'images');

/**
 * 🎯 קונפיגורציית קריטריון 2026 - מותאם לאיורים ולתמונות מרכזיות
 * (רק קבצים שקיימים אצלך ב-images/ — בלי .webp)
 */
const IMAGE_CONFIG = {
    'balance-about.png': { width: 1200, quality: 85, effort: 9, chroma: '4:4:4' },
    'clinic-hero.png': { width: 1200, quality: 85, effort: 9, chroma: '4:4:4' },
    'sagit-portrait.png': { width: 800, quality: 85, effort: 9, chroma: '4:4:4' },
    'sagitreal.jpeg': { width: 800, quality: 85, effort: 9, chroma: '4:4:4' },
};

async function startMadbirOptimization() {
    console.log('\n=============================================');
    console.log('🐛 Starting Pest Control (Madbir) Image Optimization...');
    console.log('Target: Lighthouse 100 | Ultra-Sharp Vectors');
    console.log('=============================================\n');

    if (!fs.existsSync(inputDir)) {
        console.error(`❌ Error: Folder "images" not found at: ${inputDir}`);
        return;
    }

    for (const [filename, settings] of Object.entries(IMAGE_CONFIG)) {
        const inputPath = path.join(inputDir, filename);
        const outputName = filename.split('.')[0] + '.avif';
        const outputPath = path.join(inputDir, outputName);

        if (!fs.existsSync(inputPath)) {
            console.warn(`⚠️  Missing file: ${filename} - מדלג...`);
            continue;
        }

        try {
            await sharp(inputPath)
                .resize({
                    width: settings.width,
                    withoutEnlargement: true,
                    kernel: sharp.kernel.lanczos3
                })
                .avif({
                    quality: settings.quality,
                    effort: settings.effort,
                    chromaSubsampling: settings.chroma
                })
                .withMetadata(false)
                .toFile(outputPath);

            const oldSize = (fs.statSync(inputPath).size / 1024).toFixed(1);
            const newSize = (fs.statSync(outputPath).size / 1024).toFixed(1);

            console.log(`✅ ${outputName} ready | ${oldSize}KB -> ${newSize}KB`);
        } catch (err) {
            console.error(`❌ Error encoding ${filename}:`, err.message);
        }
    }

    console.log('\n=============================================');
    console.log('✨ All done! Your illustrations are crisp and Lighthouse-Ready.');
    console.log('=============================================');
}

startMadbirOptimization();