Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$iconDir = Join-Path $projectRoot "assets\icons"
$iconPath = Join-Path $iconDir "ecogestor.ico"

if (-not (Test-Path $iconDir)) {
    New-Item -ItemType Directory -Path $iconDir -Force | Out-Null
}

$size = 256
$bitmap = New-Object System.Drawing.Bitmap $size, $size
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::Transparent)

$background = New-Object System.Drawing.RectangleF 8, 8, 240, 240
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Point 0, 0),
    (New-Object System.Drawing.Point 256, 256),
    ([System.Drawing.Color]::FromArgb(255, 7, 94, 84)),
    ([System.Drawing.Color]::FromArgb(255, 34, 197, 94))
)

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$radius = 54
$diameter = $radius * 2
$path.AddArc($background.X, $background.Y, $diameter, $diameter, 180, 90)
$path.AddArc($background.Right - $diameter, $background.Y, $diameter, $diameter, 270, 90)
$path.AddArc($background.Right - $diameter, $background.Bottom - $diameter, $diameter, $diameter, 0, 90)
$path.AddArc($background.X, $background.Bottom - $diameter, $diameter, $diameter, 90, 90)
$path.CloseFigure()
$graphics.FillPath($bgBrush, $path)

$shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 0, 0, 0))
$graphics.FillEllipse($shadowBrush, 66, 116, 124, 92)

$leafPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$leafPath.AddBezier((New-Object System.Drawing.Point 154, 54), (New-Object System.Drawing.Point 212, 78), (New-Object System.Drawing.Point 214, 144), (New-Object System.Drawing.Point 164, 168))
$leafPath.AddBezier((New-Object System.Drawing.Point 164, 168), (New-Object System.Drawing.Point 112, 150), (New-Object System.Drawing.Point 112, 86), (New-Object System.Drawing.Point 154, 54))
$leafBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 187, 247, 208))
$graphics.FillPath($leafBrush, $leafPath)

$leafPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(210, 22, 101, 52), 6)
$graphics.DrawBezier($leafPen, 148, 147, 160, 125, 171, 102, 178, 76)

$fontFamily = New-Object System.Drawing.FontFamily("Segoe UI")
$font = New-Object System.Drawing.Font($fontFamily, 108, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$textRect = New-Object System.Drawing.RectangleF 24, 74, 146, 126
$graphics.DrawString("E", $font, $textBrush, $textRect, $format)

$stream = New-Object System.IO.MemoryStream
$bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
$pngBytes = $stream.ToArray()
$stream.Dispose()

$file = [System.IO.File]::Open($iconPath, [System.IO.FileMode]::Create)
$writer = New-Object System.IO.BinaryWriter($file)
$writer.Write([UInt16]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]1)
$writer.Write([byte]0)
$writer.Write([byte]0)
$writer.Write([byte]0)
$writer.Write([byte]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]32)
$writer.Write([UInt32]$pngBytes.Length)
$writer.Write([UInt32]22)
$writer.Write($pngBytes)
$writer.Flush()
$writer.Close()
$file.Close()

$graphics.Dispose()
$bitmap.Dispose()
$bgBrush.Dispose()
$shadowBrush.Dispose()
$leafBrush.Dispose()
$leafPen.Dispose()
$font.Dispose()
$fontFamily.Dispose()
$textBrush.Dispose()
$format.Dispose()
$path.Dispose()
$leafPath.Dispose()

Write-Output "Icone gerado em: $iconPath"
