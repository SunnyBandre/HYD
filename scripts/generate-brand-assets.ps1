# Generates HYD branded assets from the gold logo:
#   - src/assets/images/splash-logo.png         (transparent bg + maroon badge for native splash)
#   - assets/images/icon.png                    (full-bleed maroon app icon, 1024)
#   - assets/images/android-icon-foreground.png (transparent, safe-zone logo)
#   - assets/images/android-icon-monochrome.png (white silhouette)
# src/assets/images/logo.png stays untouched.
Add-Type -AssemblyName System.Drawing

function New-RoundedRectPath([System.Drawing.Rectangle]$rect, [int]$radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $radius * 2
  $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
  $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
  $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
  $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return ,$path
}

function New-Canvas([int]$size) {
  return ,(New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb))
}

function Get-Graphics([System.Drawing.Bitmap]$b) {
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
  return ,$g
}

function Draw-LogoBadge([System.Drawing.Bitmap]$bmp, [System.Drawing.Graphics]$g, [bool]$fullBleed, [System.Drawing.Bitmap]$logo) {
  $W = $bmp.Width; $H = $bmp.Height
  $aspect = [double]$logo.Width / $logo.Height
  if ($fullBleed) {
    $bg = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#4A0F18"))
    $g.FillRectangle($bg, 0, 0, $W, $H)
    $bg.Dispose()
  }
  # central maroon badge with gold border
  $bx = 152; $by = 252; $bw = 720; $bh = 520; $radius = 96
  $badge = New-Object System.Drawing.Rectangle($bx, $by, $bw, $bh)
  $path = New-RoundedRectPath $badge $radius
  $fill = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#6E1E2B"))
  $g.FillPath($fill, $path)
  $fill.Dispose(); $path.Dispose()
  # gold outline inset 14
  $ox = $bx + 14; $oy = $by + 14; $ow = $bw - 28; $oh = $bh - 28
  $outline = New-Object System.Drawing.Rectangle($ox, $oy, $ow, $oh)
  $oPath = New-RoundedRectPath $outline ($radius - 14)
  $pen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#C9962E"), 14)
  $g.DrawPath($pen, $oPath)
  $pen.Dispose(); $oPath.Dispose()
  # logo centered (aspect = logo width/height)
  $lw = 560; $lh = [int]([double]$lw / $aspect)
  $lx = [int](($W - $lw) / 2); $ly = [int](($H - $lh) / 2)
  $g.DrawImage($logo, $lx, $ly, $lw, $lh)
}

function Draw-LogoCenter([System.Drawing.Bitmap]$bmp, [System.Drawing.Graphics]$g, [System.Drawing.Bitmap]$logo, [int]$widthPercent, $tint) {
  $W = $bmp.Width; $H = $bmp.Height
  $aspect = [double]$logo.Width / $logo.Height
  $lw = [int]($W * $widthPercent / 100); $lh = [int]([double]$lw / $aspect)
  $lx = [int](($W - $lw) / 2); $ly = [int](($H - $lh) / 2)
  if ($null -eq $tint) {
    $g.DrawImage($logo, $lx, $ly, $lw, $lh)
  } else {
    # recolour the logo's alpha shape as a solid tint (for the monochrome icon)
    $attrs = New-Object System.Drawing.Imaging.ImageAttributes
    $cm = New-Object System.Drawing.Imaging.ColorMatrix
    $cm.Matrix00 = 0; $cm.Matrix01 = 0; $cm.Matrix02 = 0; $cm.Matrix03 = 0; $cm.Matrix04 = 0
    $cm.Matrix10 = 0; $cm.Matrix11 = 0; $cm.Matrix12 = 0; $cm.Matrix13 = 0; $cm.Matrix14 = 0
    $cm.Matrix20 = 0; $cm.Matrix21 = 0; $cm.Matrix22 = 0; $cm.Matrix23 = 0; $cm.Matrix24 = 0
    $cm.Matrix30 = 0; $cm.Matrix31 = 0; $cm.Matrix32 = 0; $cm.Matrix33 = 1; $cm.Matrix34 = 0
    $cm.Matrix40 = $tint.R / 255; $cm.Matrix41 = $tint.G / 255; $cm.Matrix42 = $tint.B / 255; $cm.Matrix43 = 0; $cm.Matrix44 = 1
    $attrs.SetColorMatrix($cm)
    $rect = New-Object System.Drawing.Rectangle($lx, $ly, $lw, $lh)
    $g.DrawImage($logo, $rect, 0, 0, $logo.Width, $logo.Height, [System.Drawing.GraphicsUnit]::Pixel, $attrs)
  }
}

$root = "C:\Projects\HYD"
$logo = [System.Drawing.Bitmap]::FromFile("$root\src\assets\images\logo.png")

# splash-logo.png (transparent outside badge)
$b = New-Canvas 1024; $g = Get-Graphics $b; Draw-LogoBadge $b $g $false $logo
$b.Save("$root\src\assets\images\splash-logo.png", [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $b.Dispose()

# icon.png (full-bleed)
$b = New-Canvas 1024; $g = Get-Graphics $b; Draw-LogoBadge $b $g $true $logo
$b.Save("$root\assets\images\icon.png", [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $b.Dispose()

# android foreground (transparent, centred logo in safe zone)
$b = New-Canvas 1024; $g = Get-Graphics $b; Draw-LogoCenter $b $g $logo 60 $null
$b.Save("$root\assets\images\android-icon-foreground.png", [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $b.Dispose()

# android monochrome (white silhouette)
$b = New-Canvas 1024; $g = Get-Graphics $b; Draw-LogoCenter $b $g $logo 60 ([System.Drawing.Color]::White)
$b.Save("$root\assets\images\android-icon-monochrome.png", [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $b.Dispose()

$logo.Dispose()
"Done."