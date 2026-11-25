#!/usr/bin/env bash
# Installs the Spring-NWVMC (v0.1.0) AI-Agent Adoption Kit into a target Spring Boot project.
#
# Usage:
#   ./ai-agent-kit/install.sh --target /path/to/my-spring-app
#   ./ai-agent-kit/install.sh --target /path/to/my-spring-app --agent claude
#   ./ai-agent-kit/install.sh --target /path/to/my-spring-app --agent all --force

set -euo pipefail

KIT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET=""
AGENT="all"
FORCE="false"

usage() {
  cat <<'EOF'
Usage: install.sh --target <project-dir> [--agent <name>] [--force]

Options:
  --target <dir>   Target Spring Boot project directory (required)
  --agent  <name>  all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic (default: all)
  --force          Overwrite existing root adapter files (default: skip existing root files)
  -h, --help       Show this help message
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      TARGET="${2:-}"
      shift 2
      ;;
    --agent)
      AGENT="${2:-}"
      shift 2
      ;;
    --force)
      FORCE="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  echo "Error: --target is required." >&2
  usage >&2
  exit 1
fi

case "$AGENT" in
  all|antigravity|claude|codex|cursor|copilot|windsurf|cline|generic) ;;
  *)
    echo "Error: invalid --agent '$AGENT'." >&2
    usage >&2
    exit 1
    ;;
esac

mkdir -p "$TARGET"
RESOLVED_TARGET="$(cd "$TARGET" && pwd)"

INSTALLED=()
SKIPPED=()

copy_kit_file() {
  local src="$1"
  local dst="$2"
  local overwrite="$3"
  mkdir -p "$(dirname "$dst")"
  if [[ -f "$dst" && "$overwrite" != "true" ]]; then
    SKIPPED+=("${dst#"$RESOLVED_TARGET"/}")
    return
  fi
  cp "$src" "$dst"
  INSTALLED+=("${dst#"$RESOLVED_TARGET"/}")
}

install_skill_tree() {
  local skill_dir="$1"
  local f
  for f in SKILL.md INTRO.md RULES.md CHECKLIST.md; do
    copy_kit_file "$KIT_ROOT/$f" "$skill_dir/$f" "true"
  done
  for f in "$KIT_ROOT"/references/*; do
    copy_kit_file "$f" "$skill_dir/references/$(basename "$f")" "true"
  done
}

echo "Installing Spring-NWVMC (v0.1.0) AI-Agent Adoption Kit -> $RESOLVED_TARGET (agent=$AGENT)"

AGENTS_SKILL_DIR="$RESOLVED_TARGET/.agents/skills/spring-nwvmc-adoption"
install_skill_tree "$AGENTS_SKILL_DIR"

if [[ "$AGENT" == "all" || "$AGENT" == "claude" ]]; then
  install_skill_tree "$RESOLVED_TARGET/.claude/skills/spring-nwvmc-adoption"
fi

ADAPTERS_DIR="$KIT_ROOT/adapters"

if [[ "$AGENT" == "all" || "$AGENT" == "codex" || "$AGENT" == "antigravity" ]]; then
  copy_kit_file "$ADAPTERS_DIR/AGENTS.md" "$RESOLVED_TARGET/AGENTS.md" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "antigravity" ]]; then
  copy_kit_file "$ADAPTERS_DIR/GEMINI.md" "$RESOLVED_TARGET/GEMINI.md" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "claude" ]]; then
  copy_kit_file "$ADAPTERS_DIR/CLAUDE.md" "$RESOLVED_TARGET/CLAUDE.md" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "cursor" ]]; then
  copy_kit_file "$ADAPTERS_DIR/cursor/spring-nwvmc.mdc" "$RESOLVED_TARGET/.cursor/rules/spring-nwvmc.mdc" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "copilot" ]]; then
  copy_kit_file "$ADAPTERS_DIR/copilot-instructions.md" "$RESOLVED_TARGET/.github/copilot-instructions.md" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "windsurf" ]]; then
  copy_kit_file "$ADAPTERS_DIR/windsurfrules" "$RESOLVED_TARGET/.windsurfrules" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "cline" ]]; then
  copy_kit_file "$ADAPTERS_DIR/clinerules" "$RESOLVED_TARGET/.clinerules" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "generic" ]]; then
  copy_kit_file "$ADAPTERS_DIR/GENERIC_LLM_PROMPT.md" "$AGENTS_SKILL_DIR/GENERIC_LLM_PROMPT.md" "true"
fi

echo ""
echo "Installed ${#INSTALLED[@]} file(s):"
for item in "${INSTALLED[@]}"; do
  echo "  [+] $item"
done

if [[ ${#SKIPPED[@]} -gt 0 ]]; then
  echo ""
  echo "Skipped ${#SKIPPED[@]} existing file(s) (re-run with --force to overwrite, or merge manually):"
  for item in "${SKIPPED[@]}"; do
    echo "  [=] $item"
  done
fi

echo ""
echo "Done! Open your project with any AI coding agent and ask it to adopt Spring-NWVMC v0.1.0."
