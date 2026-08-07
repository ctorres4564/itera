# Script para converter arquivos DOCX em MD usando Pandoc

$docsDir = Join-Path $PSScriptRoot "..\docs"
$docsDir = [System.IO.Path]::GetFullPath($docsDir)

Write-Host "Buscando arquivos .docx em: $docsDir"

if (-not (Test-Path $docsDir)) {
    Write-Error "Diretorio docs nao encontrado em $docsDir"
    exit 1
}

$files = Get-ChildItem -Path $docsDir -Filter *.docx

if ($files.Count -eq 0) {
    Write-Host "Nenhum arquivo .docx encontrado."
    exit 0
}

foreach ($file in $files) {
    $outputPath = [System.IO.Path]::ChangeExtension($file.FullName, ".md")
    Write-Host "Convertendo: $($file.Name) -> $(Split-Path $outputPath -Leaf)"
    
    # Executa o pandoc para conversão
    pandoc -f docx -t markdown --wrap=none -o $outputPath $file.FullName
}

Write-Host "Conversao concluida com sucesso!"
