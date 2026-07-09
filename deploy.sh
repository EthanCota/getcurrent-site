#!/usr/bin/env bash
# deploy.sh — One-command deploy for the Baxter Solutions website to GitHub Pages
#
# Brand note: this repo is still named "getcurrent-site" (a holdover from the site's
# pre-rebrand name, before the 2026-07-08 rebrand to Baxter Solutions). Renaming the
# GitHub repo itself is an infra decision, not part of the branding-content pass that
# touched this file — see BRANDING-AUDIT.md.
#
# Prerequisites:
#   1. gh auth login   (run this first if not already authenticated)
#   2. git must be installed
#
# Usage:
#   cd "/Users/baxter/claude/software projects/agency/website"
#   chmod +x deploy.sh
#   ./deploy.sh
#
# What this does:
#   - Creates a public GitHub repo named "getcurrent-site" under your account
#   - Inits git inside this website/ directory (scoped here only)
#   - Commits all files and pushes to main
#   - Enables GitHub Pages from the main branch root
#   - Polls until the site is live (up to 5 minutes)
#
# Custom domain (baxter.solutions — already purchased, GitHub Pages custom domain
# already configured, CNAME file already committed as of this pass):
#   1. CNAME file in this directory should already read "baxter.solutions" — if not:
#      echo "baxter.solutions" > CNAME  then re-run ./deploy.sh
#   2. In GitHub repo Settings → Pages → Custom domain: confirm it reads baxter.solutions
#   3. DNS (NOT done by this script — status tracked outside this repo):
#        A records pointing to GitHub Pages IPs:
#          185.199.108.153
#          185.199.109.153
#          185.199.110.153
#          185.199.111.153
#        CNAME record: www → <your-gh-username>.github.io
#   4. Wait for DNS propagation (~15 min–2 hrs) then check Pages settings for HTTPS
#
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

REPO_NAME="getcurrent-site"
BRANCH="main"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Checking gh auth..."
if ! gh auth status &>/dev/null; then
  echo ""
  echo "ERROR: Not logged into GitHub. Run:  gh auth login"
  echo "Then re-run this script."
  exit 1
fi

GH_USER=$(gh api user --jq '.login')
echo "==> Authenticated as: $GH_USER"

cd "$SCRIPT_DIR"

echo "==> Initializing git in $SCRIPT_DIR ..."
if [ ! -d .git ]; then
  git init
  git checkout -b "$BRANCH" 2>/dev/null || git branch -M "$BRANCH"
fi

echo "==> Creating GitHub repo: $REPO_NAME ..."
if gh repo view "$GH_USER/$REPO_NAME" &>/dev/null; then
  echo "    Repo already exists — will push to it."
else
  gh repo create "$REPO_NAME" --public --description "Baxter Solutions — website" 2>/dev/null || true
fi

# Set remote (replace if it already exists)
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GH_USER/$REPO_NAME.git"

echo "==> Staging and committing files..."
git add -A
git diff --cached --quiet && echo "    Nothing to commit." || \
  git commit -m "Deploy Baxter Solutions website — $(date +%Y-%m-%d)"

echo "==> Pushing to GitHub..."
git push -u origin "$BRANCH" --force

echo "==> Enabling GitHub Pages (branch: $BRANCH, path: /)..."
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  "repos/$GH_USER/$REPO_NAME/pages" \
  -f build_type=legacy \
  -f "source[branch]=$BRANCH" \
  -f "source[path]=/" \
  2>/dev/null || \
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "repos/$GH_USER/$REPO_NAME/pages" \
  -f "source[branch]=$BRANCH" \
  -f "source[path]=/" \
  2>/dev/null || echo "    Pages already configured."

LIVE_URL="https://$GH_USER.github.io/$REPO_NAME/"
echo ""
echo "==> Waiting for GitHub Pages to go live at: $LIVE_URL"
echo "    (polling every 30s, up to 5 minutes)"

for i in $(seq 1 10); do
  sleep 30
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$LIVE_URL" 2>/dev/null || echo "000")
  echo "    Attempt $i/10 — HTTP $HTTP_CODE"
  if [ "$HTTP_CODE" = "200" ]; then
    echo ""
    echo "====================================================="
    echo " LIVE: $LIVE_URL"
    echo "====================================================="
    echo ""
    echo "Next steps:"
    echo "  - baxter.solutions is purchased and configured in Pages settings; DNS is the"
    echo "    remaining gate (see README.md Custom Domain section for status)"
    echo "  - To redeploy after changes:  ./deploy.sh  (from this directory)"
    exit 0
  fi
done

echo ""
echo "Pages is deploying but not yet responding — this is normal."
echo "Check in 2–5 minutes: $LIVE_URL"
echo "If it stays down: GitHub repo Settings → Pages → confirm source is set to main / (root)"
