#!/usr/bin/env bash
# Installs the Spring-NWVMC (0.1.0) AI-Agent Adoption Kit into any Spring Boot project.
# Works BOTH locally (inside a cloned repo) AND remotely via curl pipe (zero local files required).
#
# Zero-clone one-liner (run inside your Spring Boot project root):
#   curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
#
# Local usage:
#   ./ai-agent-kit/install.sh --target /path/to/my-spring-app --agent cursor

set -euo pipefail

SCRIPT_SOURCE="${BASH_SOURCE[0]:-}"
KIT_ROOT=""
IS_LOCAL_KIT="false"
if [[ -n "$SCRIPT_SOURCE" && -f "$SCRIPT_SOURCE" ]]; then
  KIT_ROOT="$(cd "$(dirname "$SCRIPT_SOURCE")" && pwd)"
  if [[ -f "$KIT_ROOT/SKILL.md" ]]; then
    IS_LOCAL_KIT="true"
  fi
fi

TARGET="."
AGENT="all"
REF="main"
REPO="NatswarChuan/Spring-NWVMC-document"
FORCE="false"

usage() {
  cat <<'EOF'
Usage: install.sh [--target <project-dir>] [--agent <name>] [--ref <branch-or-tag>] [--force]

Options:
  --target <dir>   Target Spring Boot project directory (default: .)
  --agent  <name>  all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic (default: all)
  --ref    <ref>   Git branch/tag to download from in remote mode (default: main)
  --repo   <slug>  GitHub repo slug (default: NatswarChuan/Spring-NWVMC-document)
  --force          Overwrite existing root adapter files (default: skip existing root files)
  -h, --help       Show this help message
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      TARGET="${2:-.}"
      shift 2
      ;;
    --agent)
      AGENT="${2:-all}"
      shift 2
      ;;
    --ref)
      REF="${2:-main}"
      shift 2
      ;;
    --repo)
      REPO="${2:-NatswarChuan/Spring-NWVMC-document}"
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

case "$AGENT" in
  all|antigravity|claude|codex|cursor|copilot|windsurf|cline|generic) ;;
  *)
    echo "Error: invalid --agent '$AGENT'." >&2
    usage >&2
    exit 1
    ;;
esac

RAW_BASE_URL="https://raw.githubusercontent.com/$REPO/$REF/ai-agent-kit"

mkdir -p "$TARGET"
RESOLVED_TARGET="$(cd "$TARGET" && pwd)"

INSTALLED=()
SKIPPED=()

CORE_FILES=(SKILL.md INTRO.md RULES.md CHECKLIST.md)
REFERENCE_FILES=(
  01-annotations-exact-matrix.md
  02-endpoints-and-query-dsl.md
  03-yaml-properties-and-profiles.md
  04-cookbook-verified-patterns.md
  05-imports-and-spi-contracts.md
)

install_kit_file() {
  local rel_kit_path="$1"
  local dst="$2"
  local overwrite="$3"
  mkdir -p "$(dirname "$dst")"
  if [[ -f "$dst" && "$overwrite" != "true" ]]; then
    SKIPPED+=("${dst#"$RESOLVED_TARGET"/}")
    return
  fi
  if [[ "$IS_LOCAL_KIT" == "true" ]]; then
    cp "$KIT_ROOT/$rel_kit_path" "$dst"
  else
    curl -fsSL "$RAW_BASE_URL/$rel_kit_path" -o "$dst"
  fi
  INSTALLED+=("${dst#"$RESOLVED_TARGET"/}")
}

install_skill_tree() {
  local skill_dir="$1"
  local f
  for f in "${CORE_FILES[@]}"; do
    install_kit_file "$f" "$skill_dir/$f" "true"
  done
  for f in "${REFERENCE_FILES[@]}"; do
    install_kit_file "references/$f" "$skill_dir/references/$f" "true"
  done
}

if [[ "$IS_LOCAL_KIT" == "true" ]]; then
  echo "Installing Spring-NWVMC (0.1.0) AI-Agent Adoption Kit -> $RESOLVED_TARGET (source=local, agent=$AGENT)"
else
  echo "Installing Spring-NWVMC (0.1.0) AI-Agent Adoption Kit -> $RESOLVED_TARGET (source=$RAW_BASE_URL, agent=$AGENT)"
fi

AGENTS_SKILL_DIR="$RESOLVED_TARGET/.agents/skills/spring-nwvmc-adoption"
install_skill_tree "$AGENTS_SKILL_DIR"

if [[ "$AGENT" == "all" || "$AGENT" == "claude" ]]; then
  install_skill_tree "$RESOLVED_TARGET/.claude/skills/spring-nwvmc-adoption"
fi

if [[ "$AGENT" == "all" || "$AGENT" == "codex" || "$AGENT" == "antigravity" ]]; then
  install_kit_file "adapters/AGENTS.md" "$RESOLVED_TARGET/AGENTS.md" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "antigravity" ]]; then
  install_kit_file "adapters/GEMINI.md" "$RESOLVED_TARGET/GEMINI.md" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "claude" ]]; then
  install_kit_file "adapters/CLAUDE.md" "$RESOLVED_TARGET/CLAUDE.md" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "cursor" ]]; then
  install_kit_file "adapters/cursor/spring-nwvmc.mdc" "$RESOLVED_TARGET/.cursor/rules/spring-nwvmc.mdc" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "copilot" ]]; then
  install_kit_file "adapters/copilot-instructions.md" "$RESOLVED_TARGET/.github/copilot-instructions.md" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "windsurf" ]]; then
  install_kit_file "adapters/windsurfrules" "$RESOLVED_TARGET/.windsurfrules" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "cline" ]]; then
  install_kit_file "adapters/clinerules" "$RESOLVED_TARGET/.clinerules" "$FORCE"
fi
if [[ "$AGENT" == "all" || "$AGENT" == "generic" ]]; then
  install_kit_file "adapters/GENERIC_LLM_PROMPT.md" "$AGENTS_SKILL_DIR/GENERIC_LLM_PROMPT.md" "true"
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
echo "Done! Open your project with any AI coding agent and ask it to adopt Spring-NWVMC 0.1.0."
