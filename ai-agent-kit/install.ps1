<#
.SYNOPSIS
    Installs the Spring-NWVMC (0.1.0) AI-Agent Adoption Kit into any Spring Boot project.
.DESCRIPTION
    Works BOTH locally (when run inside a cloned Spring-NWVMC / Spring-NWVMC-document repo)
    AND standalone remotely (when downloaded via Invoke-RestMethod with zero local files).
    Installs .agents/skills/spring-nwvmc-adoption/, .claude/skills/spring-nwvmc-adoption/,
    and selected platform adapters without overwriting existing root adapter files unless -Force is passed.
.EXAMPLE
    # Zero-clone one-liner from inside your Spring Boot project root:
    $s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force
.EXAMPLE
    # Target a specific agent only:
    .\install.ps1 -Target "C:\Projects\my-spring-app" -Agent cursor
#>
[CmdletBinding()]
param(
    [string]$Target = ".",

    [ValidateSet("all", "antigravity", "claude", "codex", "cursor", "copilot", "windsurf", "cline", "generic")]
    [string]$Agent = "all",

    [string]$Ref = "main",

    [string]$Repo = "NatswarChuan/Spring-NWVMC-document",

    [switch]$Force
)

$ErrorActionPreference = "Stop"
$KitRoot = $PSScriptRoot
$IsLocalKit = (-not [string]::IsNullOrWhiteSpace($KitRoot)) -and (Test-Path -LiteralPath (Join-Path $KitRoot "SKILL.md"))
$RawBaseUrl = "https://raw.githubusercontent.com/$Repo/$Ref/ai-agent-kit"

if (-not (Test-Path -LiteralPath $Target)) {
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
}
$ResolvedTarget = (Resolve-Path -LiteralPath $Target).Path

$Installed = New-Object System.Collections.Generic.List[string]
$Skipped = New-Object System.Collections.Generic.List[string]

$CoreFiles = @("SKILL.md", "INTRO.md", "RULES.md", "CHECKLIST.md")
$ReferenceFiles = @(
    "01-annotations-exact-matrix.md",
    "02-endpoints-and-query-dsl.md",
    "03-yaml-properties-and-profiles.md",
    "04-cookbook-verified-patterns.md",
    "05-imports-and-spi-contracts.md",
    "06-sdd-and-tdd-playbook.md"
)
$TemplateFiles = @(
    "spec.template.md",
    "plan.template.md",
    "tasks.template.md"
)

function Install-KitFile {
    param(
        [string]$RelativeKitPath,
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
    if ($IsLocalKit) {
        $localSrc = Join-Path $KitRoot ($RelativeKitPath -replace '/', '\')
        Copy-Item -LiteralPath $localSrc -Destination $DestinationPath -Force
    } else {
        $url = "$RawBaseUrl/$RelativeKitPath"
        Invoke-WebRequest -Uri $url -OutFile $DestinationPath -UseBasicParsing
    }
    $Installed.Add($DestinationPath)
}

function Install-SkillTree {
    param(
        [string]$SkillBaseDir
    )
    foreach ($f in $CoreFiles) {
        Install-KitFile -RelativeKitPath $f -DestinationPath (Join-Path $SkillBaseDir $f) -AllowOverwrite $true
    }
    $refDstDir = Join-Path $SkillBaseDir "references"
    foreach ($r in $ReferenceFiles) {
        Install-KitFile -RelativeKitPath "references/$r" -DestinationPath (Join-Path $refDstDir $r) -AllowOverwrite $true
    }
    $tplDstDir = Join-Path $SkillBaseDir "templates"
    foreach ($t in $TemplateFiles) {
        Install-KitFile -RelativeKitPath "templates/$t" -DestinationPath (Join-Path $tplDstDir $t) -AllowOverwrite $true
    }
}

$SourceMode = if ($IsLocalKit) { "local ($KitRoot)" } else { "remote ($RawBaseUrl)" }
Write-Host "Installing Spring-NWVMC (0.1.0) AI-Agent Adoption Kit -> $ResolvedTarget" -ForegroundColor Cyan
Write-Host "  Source: $SourceMode | Agent: $Agent" -ForegroundColor DarkCyan

# 1. Always install standard workspace skill tree (.agents/skills/spring-nwvmc-adoption)
$AgentsSkillDir = Join-Path $ResolvedTarget ".agents\skills\spring-nwvmc-adoption"
Install-SkillTree -SkillBaseDir $AgentsSkillDir

# 2. Also install Claude native skill tree when targeting Claude or all
if (($Agent -eq "all") -or ($Agent -eq "claude")) {
    $ClaudeSkillDir = Join-Path $ResolvedTarget ".claude\skills\spring-nwvmc-adoption"
    Install-SkillTree -SkillBaseDir $ClaudeSkillDir
}

# 3. Install platform adapters
if (($Agent -eq "all") -or ($Agent -eq "codex") -or ($Agent -eq "antigravity")) {
    Install-KitFile -RelativeKitPath "adapters/AGENTS.md" -DestinationPath (Join-Path $ResolvedTarget "AGENTS.md") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "antigravity")) {
    Install-KitFile -RelativeKitPath "adapters/GEMINI.md" -DestinationPath (Join-Path $ResolvedTarget "GEMINI.md") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "claude")) {
    Install-KitFile -RelativeKitPath "adapters/CLAUDE.md" -DestinationPath (Join-Path $ResolvedTarget "CLAUDE.md") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "cursor")) {
    Install-KitFile -RelativeKitPath "adapters/cursor/spring-nwvmc.mdc" -DestinationPath (Join-Path $ResolvedTarget ".cursor\rules\spring-nwvmc.mdc") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "copilot")) {
    Install-KitFile -RelativeKitPath "adapters/copilot-instructions.md" -DestinationPath (Join-Path $ResolvedTarget ".github\copilot-instructions.md") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "windsurf")) {
    Install-KitFile -RelativeKitPath "adapters/windsurfrules" -DestinationPath (Join-Path $ResolvedTarget ".windsurfrules") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "cline")) {
    Install-KitFile -RelativeKitPath "adapters/clinerules" -DestinationPath (Join-Path $ResolvedTarget ".clinerules") -AllowOverwrite ([bool]$Force)
}
if (($Agent -eq "all") -or ($Agent -eq "generic")) {
    Install-KitFile -RelativeKitPath "adapters/GENERIC_LLM_PROMPT.md" -DestinationPath (Join-Path $AgentsSkillDir "GENERIC_LLM_PROMPT.md") -AllowOverwrite $true
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
Write-Host "Done! Open your project with any AI coding agent and ask it to adopt Spring-NWVMC 0.1.0." -ForegroundColor Cyan
