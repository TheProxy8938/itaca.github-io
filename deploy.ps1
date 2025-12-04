# =============================================
# SCRIPT DE DEPLOYMENT UNIFICADO - ITACA
# Versión: 1.0 - Diciembre 2025
# =============================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('html', 'php', 'all')]
    [string]$tipo = 'all'
)

$servidor = "fjw.d54.mytemp.website"
$usuario = "bpmrirqnvu9u"
$rutaRemota = "~/public_html/itaca-mx.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT ITACA COMUNICACION" -ForegroundColor Cyan
Write-Host "Tipo: $tipo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Función para subir archivos HTML
function Deploy-HTML {
    Write-Host "`n[1/3] SUBIENDO ARCHIVOS HTML..." -ForegroundColor Yellow
    
    $archivosHTML = @(
        "index.html",
        "nosotros.html",
        "servicios.html",
        "contacto.html",
        "casos-de-exito.html",
        "faq.html",
        "politica-privacidad.html",
        "terminos-condiciones.html",
        "404.html"
    )
    
    foreach ($archivo in $archivosHTML) {
        $rutaLocal = "itaca-produccion\$archivo"
        if (Test-Path $rutaLocal) {
            Write-Host "  Subiendo $archivo..." -ForegroundColor White
            scp "$rutaLocal" "${usuario}@${servidor}:${rutaRemota}/"
        }
    }
}

# Función para subir archivos PHP
function Deploy-PHP {
    Write-Host "`n[2/3] SUBIENDO ARCHIVOS PHP..." -ForegroundColor Yellow
    
    # Subir archivos PHP del backend
    Write-Host "  Subiendo admin/*.php..." -ForegroundColor White
    scp -r "php-backend/admin" "${usuario}@${servidor}:${rutaRemota}/"
    
    Write-Host "  Subiendo api/*.php..." -ForegroundColor White
    scp -r "php-backend/api" "${usuario}@${servidor}:${rutaRemota}/"
    
    Write-Host "  Subiendo lib/*.php..." -ForegroundColor White
    scp -r "php-backend/lib" "${usuario}@${servidor}:${rutaRemota}/"
    
    Write-Host "  Subiendo config.php..." -ForegroundColor White
    scp "php-backend/config.php" "${usuario}@${servidor}:${rutaRemota}/"
}

# Función para verificar deployment
function Verify-Deployment {
    Write-Host "`n[3/3] VERIFICANDO ARCHIVOS..." -ForegroundColor Yellow
    ssh "${usuario}@${servidor}" "ls -lh ~/public_html/itaca-mx.com/*.html | head -5"
}

# Ejecutar según el tipo seleccionado
switch ($tipo) {
    'html' { Deploy-HTML }
    'php' { Deploy-PHP }
    'all' {
        Deploy-HTML
        Deploy-PHP
    }
}

Verify-Deployment

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nPrueba el sitio: https://itaca-mx.com" -ForegroundColor Cyan
Write-Host ""
