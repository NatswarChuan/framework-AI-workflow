#!/usr/bin/env bash
# Installs the Spring-NWVMC (0.1.0) AI-Agent Adoption Kit into any Spring Boot project.
# Works BOTH locally (inside a cloned repo) AND remotely (downloads each file once into a
# temporary staging directory with TLS 1.2 + retries + symlink protection).
#
# Zero-clone one-liner (run inside your Spring Boot project root):
#   curl --proto '=https' --tlsv1.2 -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
#
# Enterprise pinned-SHA install (pin BOTH the script URL and --ref to the same commit SHA):
#   REF="<commit-sha>"; curl --proto '=https' --tlsv1.2 -fsSL "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/${REF}/ai-agent-kit/install.sh" | bash -s -- --target . --agent all --ref "${REF}"

set -euo pipefail

SCRIPT_SOURCE="${BASH_SOURCE[0]:-}"
KIT_ROOT=""
IS_LOCAL_KIT="false"
if [[ -n "$SCRIPT_SOURCE" && -f "$SCRIPT_SOURCE" ]]; then
  KIT_ROOT="$(cd "$(dirname "$SCRIPT_SOURCE")" && pwd)"
  if [[ -f "$KIT_ROOT/SKILL.md" && -f "$KIT_ROOT/INTRO.md" && -f "$KIT_ROOT/references/01-annotations-exact-matrix.md" ]]; then
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
Usage: install.sh [--target <project-dir>] [--agent <name>] [--ref <branch-or-sha>] [--repo <owner/repo>] [--force]

Options:
  --target <dir>         Target Spring Boot project directory (default: .)
  --agent  <name>        all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic (default: all)
  --ref    <ref>         Git branch, tag, or immutable commit SHA to download from in remote mode (default: main)
  --repo   <owner/repo>  GitHub repo slug (default: NatswarChuan/Spring-NWVMC-document)
  --force                Overwrite existing root adapter files (default: preserve existing root files; skill trees always refresh)
  -h, --help             Show this help message
EOF
}

require_value() {
  local flag="$1"
  if [[ $# -lt 2 || -z "${2:-}" || "${2:-}" == --* ]]; then
    echo "Error: '$flag' requires a non-empty value." >&2
    usage >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      require_value "$1" "${2:-}"
      TARGET="$2"
      shift 2
      ;;
    --agent)
      require_value "$1" "${2:-}"
      AGENT="$2"
      shift 2
      ;;
    --ref)
      require_value "$1" "${2:-}"
      REF="$2"
      shift 2
      ;;
    --repo)
      require_value "$1" "${2:-}"
      REPO="$2"
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

if [[ ! "$REPO" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  echo "Error: invalid --repo '$REPO'. Expected 'owner/repository'." >&2
  exit 1
fi
if [[ ! "$REF" =~ ^[A-Za-z0-9._/-]+$ || "$REF" == *".."* ]]; then
  echo "Error: invalid --ref '$REF'. Path traversal and shell metacharacters are not allowed." >&2
  exit 1
fi

if [[ "$IS_LOCAL_KIT" != "true" ]]; then
  if ! command -v curl >/dev/null 2>&1; then
    echo "Error: 'curl' is required for remote installation." >&2
    exit 1
  fi
fi

RAW_BASE_URL="https://raw.githubusercontent.com/$REPO/$REF/ai-agent-kit"
STAGE_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t nwvmc-kit-stage)"
cleanup() {
  rm -rf "$STAGE_DIR"
}
trap cleanup EXIT

mkdir -p "$TARGET"
RESOLVED_TARGET="$(cd "$TARGET" && pwd)"
RESOLVED_TARGET_TRIMMED="${RESOLVED_TARGET%/}"

INSTALLED=()
SKIPPED=()

CORE_FILES=(SKILL.md INTRO.md RULES.md CHECKLIST.md)
REFERENCE_FILES=(
  01-annotations-exact-matrix.md
  02-endpoints-and-query-dsl.md
  03-yaml-properties-and-profiles.md
  04-cookbook-verified-patterns.md
  05-imports-and-spi-contracts.md
  06-sdd-and-tdd-playbook.md
)
TEMPLATE_FILES=(
  spec.template.md
  plan.template.md
  tasks.template.md
)

rel_display_path() {
  local full="$1"
  if [[ -n "$RESOLVED_TARGET_TRIMMED" && "$full" == "$RESOLVED_TARGET_TRIMMED/"* ]]; then
    printf '%s' "${full#"$RESOLVED_TARGET_TRIMMED"/}"
  else
    printf '%s' "${full#/}"
  fi
}

resolve_kit_source() {
  local rel_kit_path="$1"
  if [[ "$IS_LOCAL_KIT" == "true" ]]; then
    printf '%s' "$KIT_ROOT/$rel_kit_path"
    return
  fi
  local staged="$STAGE_DIR/$rel_kit_path"
  if [[ -s "$staged" ]]; then
    printf '%s' "$staged"
    return
  fi
  mkdir -p "$(dirname "$staged")"
  curl --proto '=https' --tlsv1.2 --retry 3 --retry-delay 2 --connect-timeout 10 --max-time 30 \
    -fsSL "$RAW_BASE_URL/$rel_kit_path" -o "$staged"
  if [[ ! -s "$staged" ]]; then
    echo "Error: downloaded empty file from $RAW_BASE_URL/$rel_kit_path" >&2
    exit 1
  fi
  printf '%s' "$staged"
}

install_kit_file() {
  local rel_kit_path="$1"
  local dst="$2"
  local overwrite="$3"
  mkdir -p "$(dirname "$dst")"
  if [[ -L "$dst" ]]; then
    echo "Error: refusing to overwrite symlink at '$dst'." >&2
    exit 1
  fi
  if [[ -e "$dst" && "$overwrite" != "true" ]]; then
    SKIPPED+=("$(rel_display_path "$dst")")
    return
  fi
  local src
  src="$(resolve_kit_source "$rel_kit_path")"
  local tmp_dst="${dst}.tmp.$$"
  cp "$src" "$tmp_dst"
  mv -f "$tmp_dst" "$dst"
  INSTALLED+=("$(rel_display_path "$dst")")
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
  for f in "${TEMPLATE_FILES[@]}"; do
    install_kit_file "templates/$f" "$skill_dir/templates/$f" "true"
  done
}

if [[ "$IS_LOCAL_KIT" == "true" ]]; then
  echo "Installing Spring-NWVMC (0.1.0) AI-Agent Adoption Kit -> $RESOLVED_TARGET (source=local, agent=$AGENT)"
else
  echo "Installing Spring-NWVMC (0.1.0) AI-Agent Adoption Kit -> $RESOLVED_TARGET (source=$RAW_BASE_URL, agent=$AGENT)"
fi
echo "  Note: Skill tree files (.agents/skills/... and .claude/skills/...) refresh on each run; existing root adapters are preserved unless --force is passed."

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
echo "Done! Open your project with your AI coding agent and start with Prompt 1 (Bootstrap) in ai-agent-kit/README.md."
