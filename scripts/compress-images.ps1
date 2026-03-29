# compress-images.ps1
# 使用 .NET System.Drawing 压缩图片（Windows 原生，无需第三方工具）
# JPG/PNG → 高质量 JPG，长边缩至 1200px，质量 85
# 运行：powershell -ExecutionPolicy Bypass -File scripts/compress-images.ps1

Add-Type -AssemblyName System.Drawing

$inputDir  = "$PSScriptRoot\..\public\blog-img"
$quality   = 85
$maxSide   = 1200

# JPEG 编码器参数
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]$quality
)

$exts = @('.jpg','.jpeg','.png','.webp')
$files = Get-ChildItem $inputDir | Where-Object { $exts -contains $_.Extension.ToLower() }

Write-Host "`n🖼  找到 $($files.Count) 张图片，开始压缩...`n"

$savedTotal = 0

foreach ($file in $files) {
    $baseName   = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $outputPath = Join-Path $inputDir "$baseName.jpg"
    $origSize   = $file.Length

    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)

        # 计算缩放尺寸
        $w = $img.Width
        $h = $img.Height
        if ([Math]::Max($w,$h) -gt $maxSide) {
            if ($w -ge $h) { $newW = $maxSide; $newH = [int]($h * $maxSide / $w) }
            else            { $newH = $maxSide; $newW = [int]($w * $maxSide / $h) }
        } else {
            $newW = $w; $newH = $h
        }

        $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
        $g   = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()
        $img.Dispose()

        # 若输出路径与输入相同（已是 jpg），先写到临时文件再替换
        if ($file.FullName -eq $outputPath) {
            $tmpPath = $outputPath + '.tmp'
            $bmp.Save($tmpPath, $jpegEncoder, $encParams)
            $bmp.Dispose()
            Remove-Item $outputPath -Force
            Rename-Item $tmpPath $outputPath
        } else {
            $bmp.Save($outputPath, $jpegEncoder, $encParams)
            $bmp.Dispose()
        }

        $newSize = (Get-Item $outputPath).Length
        $saved   = $origSize - $newSize
        $savedTotal += $saved
        $ratio   = [Math]::Round($saved * 100 / $origSize, 1)

        $origKB = [Math]::Round($origSize/1KB, 0)
        $newKB  = [Math]::Round($newSize/1KB, 0)
        Write-Host ("  ✅ {0,-26} {1,5} KB → {2,5} KB  (-{3}%)" -f $file.Name, $origKB, $newKB, $ratio)

    } catch {
        Write-Host "  ❌ $($file.Name): $_" -ForegroundColor Red
    }
}

$savedMB = [Math]::Round($savedTotal/1MB, 2)
Write-Host "`n🎉 完成！共节省 $savedMB MB`n"

# ─── 更新 src/data/pictures.ts 路径 ──────────────────────────────────────────
$dataFile = "$PSScriptRoot\..\src\data\pictures.ts"
$content  = Get-Content $dataFile -Raw
$updated  = $content -replace '/blog-img/([\w-]+)\.(png|webp)', '/blog-img/$1.jpg'

if ($updated -ne $content) {
    Set-Content $dataFile $updated -NoNewline
    Write-Host "📝 已自动更新 src/data/pictures.ts（.png/.webp → .jpg）`n"
} else {
    Write-Host "📝 src/data/pictures.ts 路径无需更新`n"
}
