#!/usr/bin/env bash

set -euo pipefail

if [ $# -lt 1 ]; then
  echo 'Usage: ./scripts/new-post.sh "Post Title" "tag1,tag2" [slug]' >&2
  exit 1
fi

title="$1"
raw_tags="${2:-security}"
explicit_slug="${3:-}"

slugify() {
  printf "%s" "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g'
}

slug="${explicit_slug:-$(slugify "$title")}"

if [ -z "$slug" ]; then
  echo 'Could not derive a slug from the title. Pass a slug as the third argument.' >&2
  exit 1
fi

post_date="$(TZ=Asia/Tokyo date +%F)"
post_timestamp="$(TZ=Asia/Tokyo date '+%Y-%m-%d %H:%M:%S %z')"
post_path="_posts/${post_date}-${slug}.md"

if [ -e "$post_path" ]; then
  echo "Refusing to overwrite existing file: $post_path" >&2
  exit 1
fi

IFS=',' read -r -a tags <<< "$raw_tags"
normalized_tags=()

for tag in "${tags[@]}"; do
  trimmed="$(printf "%s" "$tag" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  if [ -n "$trimmed" ]; then
    normalized_tags+=("$trimmed")
  fi
done

if [ "${#normalized_tags[@]}" -eq 0 ]; then
  normalized_tags=("security")
fi

escaped_title="${title//\"/\\\"}"

{
  printf -- '---\n'
  printf 'title: "%s"\n' "$escaped_title"
  printf 'description: "Add a short summary here."\n'
  printf 'date: %s\n' "$post_timestamp"
  printf 'tags:\n'
  for tag in "${normalized_tags[@]}"; do
    printf '  - %s\n' "$tag"
  done
  printf -- '---\n\n'
  printf 'Write your article here.\n\n'
  printf '<!--more-->\n\n'
  printf '## Summary\n\n'
  printf -- '- Background\n'
  printf -- '- Findings\n'
  printf -- '- Lessons learned\n'
} > "$post_path"

echo "Created $post_path"
