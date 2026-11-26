<#
.SYNOPSIS
    Installs the Spring-NWVMC (0.1.0) AI-Agent Adoption Kit into any Spring Boot project.
.DESCRIPTION
    Works BOTH locally (when run inside a cloned Spring-NWVMC / Spring-NWVMC-document repo)
    AND standalone remotely (when downloaded with zero local files).
    Downloads remote files once into a temporary staging directory, enforces TLS 1.2 +
    strict Repo/Ref validation + symlink protection, and installs:
      - .agents/skills/spring-nwvmc-adoption/ (and .claude/skills/... when targeting claude/all)
      - selected platform adapters (preserving existing root adapter files unless -Force is passed).
.EXAMPLE
    # Zero-clone one-liner (run inside PowerShell in your Spring Boot project root):
    $ErrorActionPreference='Stop'; $s=Join-Path $env:TEMP ("nwvmc-install-" + [guid]::NewGuid().ToString("N") + ".ps1"); try { [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent cursor } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }
.EXAMPLE
    # Install all adapters & pin an immutable commit SHA (pin BOTH download URL and -Ref):
    .\install.ps1 -Target "C:\Projects\my-spring-app" -Agent all -Ref "<commit-sha>"
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
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

if ($Repo -notmatch '^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$') {
    throw "Invalid -Repo value '$Repo'. Expected format 'owner/repository'."
}
if (($Ref -notmatch '^[A-Za-z0-9._/-]+$') -or ($Ref -match '\.\.')) {
    throw "Invalid -Ref value '$Ref'. Path traversal and shell metacharacters are not allowed."
}

$KitRoot = $PSScriptRoot
$IsLocalKit = (-not [string]::IsNullOrWhiteSpace($KitRoot)) `
    -and (Test-Path -LiteralPath (Join-Path $KitRoot "SKILL.md") -PathType Leaf) `
    -and (Test-Path -LiteralPath (Join-Path $KitRoot "INTRO.md") -PathType Leaf) `
    -and (Test-Path -LiteralPath (Join-Path $KitRoot "references\01-annotations-exact-matrix.md") -PathType Leaf)
$RawBaseUrl = "https://raw.githubusercontent.com/$Repo/$Ref/ai-agent-kit"

if (-not (Test-Path -LiteralPath $Target)) {
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
}
$ResolvedTarget = (Resolve-Path -LiteralPath $Target).Path.TrimEnd('\', '/')

$Installed = New-Object System.Collections.Generic.List[string]
$Skipped = New-Object System.Collections.Generic.List[string]
$StageDir = Join-Path $env:TEMP ("nwvmc-kit-stage-" + [guid]::NewGuid().ToString("N"))

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

function Get-RelativeDisplayPath {
    param([string]$FullPath)
    if ($FullPath.StartsWith($ResolvedTarget, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $FullPath.Substring($ResolvedTarget.Length).TrimStart('\', '/')
    }
    return $FullPath
}

function Resolve-KitSourceFile {
    param([string]$RelativeKitPath)
    $relWin = $RelativeKitPath -replace '/', '\'
    if ($IsLocalKit) {
        return (Join-Path $KitRoot $relWin)
    }
    $stagedPath = Join-Path $StageDir $relWin
    if (Test-Path -LiteralPath $stagedPath -PathType Leaf) {
        return $stagedPath
    }
    $stagedParent = Split-Path -Path $stagedPath -Parent
    if (-not (Test-Path -LiteralPath $stagedParent)) {
        New-Item -ItemType Directory -Path $stagedParent -Force | Out-Null
    }
    $url = "$RawBaseUrl/$RelativeKitPath"
    $maxAttempts = 3
    for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
        try {
            Invoke-WebRequest -Uri $url -OutFile $stagedPath -TimeoutSec 30 -UseBasicParsing
            if ((Get-Item -LiteralPath $stagedPath).Length -le 0) {
                throw "Downloaded empty file from $url"
            }
            return $stagedPath
        } catch {
            if ($attempt -eq $maxAttempts) {
                throw "Failed downloading '$url' after $maxAttempts attempts: $($_.Exception.Message)"
            }
            Start-Sleep -Seconds 2
        }
    }
}

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
    if (Test-Path -LiteralPath $DestinationPath) {
        $existing = Get-Item -LiteralPath $DestinationPath -Force
        if (($existing.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
            throw "Refusing to overwrite symlink/reparse point at '$DestinationPath'."
        }
        if (-not $AllowOverwrite) {
            $Skipped.Add($DestinationPath)
            return
        }
    }
    $srcPath = Resolve-KitSourceFile -RelativeKitPath $RelativeKitPath
    $tmpDst = "$DestinationPath.tmp.$([guid]::NewGuid().ToString('N'))"
    Copy-Item -LiteralPath $srcPath -Destination $tmpDst -Force
    Move-Item -LiteralPath $tmpDst -Destination $DestinationPath -Force
    $Installed.Add($DestinationPath)
}

function Install-SkillTree {
    param([string]$SkillBaseDir)
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

try {
    $SourceMode = if ($IsLocalKit) { "local ($KitRoot)" } else { "remote ($RawBaseUrl)" }
    Write-Host "Installing Spring-NWVMC (0.1.0) AI-Agent Adoption Kit -> $ResolvedTarget" -ForegroundColor Cyan
    Write-Host "  Source: $SourceMode | Agent: $Agent" -ForegroundColor DarkCyan
    Write-Host "  Note: Skill tree files (.agents/skills/... and .claude/skills/...) are refreshed on each run; existing root adapter files are preserved unless -Force is passed." -ForegroundColor DarkGray

    # 1. Always install standard workspace skill tree (.agents/skills/spring-nwvmc-adoption)
    $AgentsSkillDir = Join-Path $ResolvedTarget ".agents\skills\spring-nwvmc-adoption"
    Install-SkillTree -SkillBaseDir $AgentsSkillDir

    # 2. Also install Claude native skill tree when targeting Claude or all (reuses staged files)
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
        Write-Host ("  [+] {0}" -f (Get-RelativeDisplayPath -FullPath $item))
    }

    if ($Skipped.Count -gt 0) {
        Write-Host ""
        Write-Host ("Skipped {0} existing file(s) (re-run with -Force to overwrite, or merge manually):" -f $Skipped.Count) -ForegroundColor Yellow
        foreach ($item in $Skipped) {
            Write-Host ("  [=] {0}" -f (Get-RelativeDisplayPath -FullPath $item))
        }
    }

    Write-Host ""
    Write-Host "Done! Open your project with your AI coding agent and start with Prompt 1 (Bootstrap) in ai-agent-kit/README.md." -ForegroundColor Cyan
} finally {
    if (Test-Path -LiteralPath $StageDir) {
        Remove-Item -LiteralPath $StageDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
