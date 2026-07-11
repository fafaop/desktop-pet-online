Add-Type -AssemblyName System.Drawing

$buildDir = Join-Path $PSScriptRoot '..\build'
New-Item -ItemType Directory -Path $buildDir -Force | Out-Null
$pngPath = Join-Path $buildDir 'icon.png'

$bitmap = [System.Drawing.Bitmap]::new(512, 512)
$bitmap.SetResolution(96, 96)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::Transparent)

function Brush($hex) { [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex)) }
function Pen($hex, $width) { [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($hex), $width) }

$background = [System.Drawing.Drawing2D.GraphicsPath]::new()
$radius = 112
$background.AddArc(16, 16, $radius, $radius, 180, 90)
$background.AddArc(384, 16, $radius, $radius, 270, 90)
$background.AddArc(384, 384, $radius, $radius, 0, 90)
$background.AddArc(16, 384, $radius, $radius, 90, 90)
$background.CloseFigure()
$gradient = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
  [System.Drawing.Rectangle]::new(16, 16, 480, 480),
  [System.Drawing.ColorTranslator]::FromHtml('#8068EE'),
  [System.Drawing.ColorTranslator]::FromHtml('#35265F'), 48)
$graphics.FillPath($gradient, $background)

$glow = Brush '#3325B8A6'
$graphics.FillEllipse($glow, 70, 76, 372, 372)

$ears = [System.Drawing.Point[]]@(
  [System.Drawing.Point]::new(126, 207), [System.Drawing.Point]::new(139, 102),
  [System.Drawing.Point]::new(220, 165), [System.Drawing.Point]::new(292, 165),
  [System.Drawing.Point]::new(373, 102), [System.Drawing.Point]::new(386, 207))
$faceBrush = Brush '#FFF8ED'
$graphics.FillPolygon($faceBrush, $ears)
$graphics.FillEllipse($faceBrush, 111, 150, 290, 270)

$innerEar = Brush '#F3A5B7'
$graphics.FillPolygon($innerEar, [System.Drawing.Point[]]@(
  [System.Drawing.Point]::new(151, 185), [System.Drawing.Point]::new(158, 133), [System.Drawing.Point]::new(202, 171)))
$graphics.FillPolygon($innerEar, [System.Drawing.Point[]]@(
  [System.Drawing.Point]::new(361, 185), [System.Drawing.Point]::new(354, 133), [System.Drawing.Point]::new(310, 171)))

$dark = Brush '#332A49'
$graphics.FillEllipse($dark, 174, 251, 34, 49)
$graphics.FillEllipse($dark, 304, 251, 34, 49)
$shine = Brush '#FFFFFF'
$graphics.FillEllipse($shine, 183, 259, 10, 13)
$graphics.FillEllipse($shine, 313, 259, 10, 13)

$nose = Brush '#D66E8C'
$graphics.FillPolygon($nose, [System.Drawing.Point[]]@(
  [System.Drawing.Point]::new(244, 310), [System.Drawing.Point]::new(268, 310), [System.Drawing.Point]::new(256, 323)))
$mouthPen = Pen '#6A526B' 7
$graphics.DrawArc($mouthPen, 226, 309, 31, 36, 15, 85)
$graphics.DrawArc($mouthPen, 255, 309, 31, 36, 80, 85)

$networkPen = Pen '#B7FFF0' 10
$networkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$networkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($networkPen, 89, 356, 141, 322)
$graphics.DrawLine($networkPen, 371, 322, 423, 356)
$node = Brush '#5BE4C1'
$graphics.FillEllipse($node, 66, 340, 40, 40)
$graphics.FillEllipse($node, 406, 340, 40, 40)
$graphics.FillEllipse($node, 126, 307, 30, 30)
$graphics.FillEllipse($node, 356, 307, 30, 30)

$bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)

foreach ($item in @($networkPen, $mouthPen, $node, $nose, $shine, $dark, $innerEar, $faceBrush, $glow, $gradient, $background, $graphics, $bitmap)) {
  if ($null -ne $item) { $item.Dispose() }
}

Write-Output $pngPath
