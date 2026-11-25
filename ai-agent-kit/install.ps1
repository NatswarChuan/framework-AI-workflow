<#
.SYNOPSIS
    Installs the Spring-NWVMC (v0.1.0) AI-Agent Adoption Kit into a target Spring Boot project.
.DESCRIPTION
    Copies the progressive-disclosure skill (SKILL.md, INTRO.md, RULES.md, CHECKLIST.md, references/*)
    and the requested platform adapter files (AGENTS.md, CLAUDE.md, GEMINI.md, Cursor .mdc,
    GitHub Copilot instructions, Windsurf, Cline/Roo Code, Generic LLM prompt) into the target repo.
    Existing root adapter files are preserved by default unless -Force is passed.
.EXAMPLE
    .\ai-agent-kit\install.ps1 -Target C:\Projects\my-spring-app
.EXAMPLE
    .\ai-agent-kit\install.ps1 -Target C:\Projects\my-spring-app -Agent cursor
.EXAMPLE
    .\ai-agent-kit\install.ps1 -Target C:\Projects\my-spring-app -Agent all -Force
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Target,

    [ValidateSet("all", "antigravity", "claude", "codex", "cursor", "copilot", "windsurf", "cline", "generic")]
    [string]$Agent = "all",

    [switch]$Force
)

$ErrorActionPreference = "Stop"
$KitRoot = $PSScriptRoot

if (-not (Test-Path -LiteralPath $Target)) {
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
}
$ResolvedTarget = (Resolve-Path -LiteralPath $Target).Path

$Installed = New-Object System.Collections.Generic.List[string]
$Skipped = New-Object System.Collections.Generic.List[string]

function Copy-KitFile {
    param(
        [string]$SourcePath,
        [string]$DestinationPath,
        [bool]$AllowOverwrite
    )
    $parentDir = Split-Path -Path $DestinationPath -Parent
    if (-not (Test-Path -LiteralPath $parentDir)) {
        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
    }
    if ((Test-Path -LiteralPath $DestinationPath) -and (-not $AllowOverwrite)) {
        $Skipped.Add($DestinationPath)
        return
    }
    Copy-Item -LiteralPath $SourcePath -Destination $DestinationPath -Force
    $Installed.Add($DestinationPath)
}

function Install-SkillTree {
    param(
        [string]$SkillBaseDir
    )
    $coreFiles = @("SKILL.md", "INTRO.md", "RULES.md", "CHECKLIST.md")
    foreach ($f in $coreFiles) {
        Copy-KitFile -SourcePath (Join-Path $KitRoot $f) -DestinationPath (Join-Path $SkillBaseDir $f) -AllowOverwrite $true
    }
    $refSrcDir = Join-Path $KitRoot "references"
    $refDstDir = Join-Path $SkillBaseDir "references"
    Get-ChildItem -LiteralPath $refSrcDir -File | ForEach-Object {
        Copy-KitFile -SourcePath $_.FullName -DestinationPath (Join-Path $refDstDir $_.Name) -AllowOverwrite $true
    }
}

Write-Host "Installing Spring-NWVMC (v0.1.0) AI-Agent Adoption Kit -> $ResolvedTarget (Agent=$Agent)" -ForegroundColor Cyan

# 1. Always install standard workspace skill tree (.agents/skills/spring-nwvmc-adoption)
$AgentsSkillDir = Join-Path $ResolvedTarget ".agents\skills\spring-nwvmc-adoption"
Install-SkillTree -SkillBaseDir $AgentsSkillDir

# 2. Also install Claude native skill tree when targeting Claude or all
if (($Agent -eq "all") -or ($Agent -eq "claude")) {
    $ClaudeSkillDir = Join-Path $ResolvedTarget ".claude\skills\spring-nwvmc-adoption"
    Install-SkillTree -SkillBaseDir $ClaudeSkillDir
}

# 3. Install platform adapters
$AdaptersDir = Join-Path $KitRoot "adapters"

if (($Agent -eq "all") -or ($Agent -eq "codex") -or ($Agent -eq "antigravity")) {
    Copy-KitFile -SourcePath (Join-Path $AdaptersDir "AGENTS.md") -DestinationPath (Join-Path $ResolvedTarget "AGENTS.md") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "antigravity")) {
    Copy-KitFile -SourcePath (Join-Path $AdaptersDir "GEMINI.md") -DestinationPath (Join-Path $ResolvedTarget "GEMINI.md") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "claude")) {
    Copy-KitFile -SourcePath (Join-Path $AdaptersDir "CLAUDE.md") -DestinationPath (Join-Path $ResolvedTarget "CLAUDE.md") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "cursor")) {
    Copy-KitFile -SourcePath (Join-Path $AdaptersDir "cursor\spring-nwvmc.mdc") -DestinationPath (Join-Path $ResolvedTarget ".cursor\rules\spring-nwvmc.mdc") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "copilot")) {
    Copy-KitFile -SourcePath (Join-Path $AdaptersDir "copilot-instructions.md") -DestinationPath (Join-Path $ResolvedTarget ".github\copilot-instructions.md") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "windsurf")) {
    Copy-KitFile -SourcePath (Join-Path $AdaptersDir "windsurfrules") -DestinationPath (Join-Path $ResolvedTarget ".windsurfrules") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "cline")) {
    Copy-KitFile -SourcePath (Join-Path $AdaptersDir "clinerules") -DestinationPath (Join-Path $ResolvedTarget ".clinerules") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "generic")) {
    Copy-KitFile -SourcePath (Join-Path $AdaptersDir "GENERIC_LLM_PROMPT.md") -DestinationPath (Join-Path $AgentsSkillDir "GENERIC_LLM_PROMPT.md") -AllowOverwrite $true
}

Write-Host ""
Write-Host ("Installed {0} file(s):" -f $Installed.Count) -ForegroundColor Green
foreach ($item in $Installed) {
    $rel = $item.Substring($ResolvedTarget.Length).TrimStart('\', '/')
    Write-Host ("  [+] {0}" -f $rel)
}

if ($Skipped.Count -gt 0) {
    Write-Host ""
    Write-Host ("Skipped {0} existing file(s) (re-run with -Force to overwrite, or merge manually):" -f $Skipped.Count) -ForegroundColor Yellow
    foreach ($item in $Skipped) {
        $rel = $item.Substring($ResolvedTarget.Length).TrimStart('\', '/')
        Write-Host ("  [=] {0}" -f $rel)
    }
}

Write-Host ""
Write-Host "Done! Open your project with any AI coding agent and ask it to adopt Spring-NWVMC v0.1.0." -ForegroundColor Cyan
