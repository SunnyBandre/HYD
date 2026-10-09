# Crops src/assets/images/logo.png to its non-transparent content (the thin
# gold band), adding a small margin, so the logo asset is a wide banner
# instead of a 92%-empty square. Re-run generate-brand-assets.ps1 after.
Add-Type -AssemblyName System.Drawing

$src = "C:\Projects\HYD\src\assets\images\logo.png"
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$W = $bmp.Width; $H = $bmp.Height

$minX = $W; $minY = $H; $maxX = 0; $maxY = 0
for ($y = 0; $y -lt $H; $y++) {
  for ($x = 0; $x -lt $W; $x++) {
    if ($bmp.GetPixel($x, $y).A -gt 8) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

$margin = 12
$sx = [Math]::Max(0, $minX - $margin)
$sy = [Math]::Max(0, $minY - $margin)
$sw = [Math]::Min($W - $sx, ($maxX - $minX) + $margin * 2)
$sh = [Math]::Min($H - $sy, ($maxY - $minY) + $margin * 2)

$out = New-Object System.Drawing.Bitmap($sw, $sh, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($out)
$g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$srcRect = New-Object System.Drawing.Rectangle($sx, $sy, $sw, $sh)
$dstRect = New-Object System.Drawing.Rectangle(0, 0, $sw, $sh)
$g.DrawImage($bmp, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$tmp = "$src.new.png"
$g.Dispose()
$out.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
$out.Dispose(); $bmp.Dispose()
Move-Item -Force $tmp $src

"Cropped logo: content=$($maxX-$minX)x$($maxY-$minY)  saved=${sw}x${sh}"