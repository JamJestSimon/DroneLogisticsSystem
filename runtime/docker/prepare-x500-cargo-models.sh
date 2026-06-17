#!/usr/bin/env sh
# Patches PX4 x500 model with DetachableJoint plugins (one cargo slot per instance).
set -eu

PX4_HOME="${PX4_HOME:-/opt/PX4-Autopilot}"
# When set (0, 1, …), only the matching cargo_x500_N plugin is added so attach topics
# do not make every drone in the world fight over the same child model.
UAV_CARGO_INSTANCE="${UAV_CARGO_INSTANCE:-}"
MAX_CARGO_SLOTS="${MAX_CARGO_SLOTS:-8}"
OUT_ROOT="${GZ_CARGO_MODELS_ROOT:-/tmp/gz-cargo-models}"
SRC_MODEL="$PX4_HOME/Tools/simulation/gz/models/x500/model.sdf"
OUT_MODEL="$OUT_ROOT/x500/model.sdf"

if [ ! -f "$SRC_MODEL" ]; then
  echo "prepare-x500-cargo-models: missing $SRC_MODEL" >&2
  exit 1
fi

mkdir -p "$OUT_ROOT/x500"
cp "$PX4_HOME/Tools/simulation/gz/models/x500/model.config" "$OUT_ROOT/x500/model.config" 2>/dev/null || true

python3 - "$SRC_MODEL" "$OUT_MODEL" "$MAX_CARGO_SLOTS" "$UAV_CARGO_INSTANCE" <<'PY'
import sys
from pathlib import Path

source = Path(sys.argv[1])
target = Path(sys.argv[2])
max_slots = int(sys.argv[3])
instance = sys.argv[4].strip()
marker = "<!-- uav-logistics-cargo-joints -->"
if target.exists() and marker in target.read_text():
    text = target.read_text().split(marker)[0].rstrip()
else:
    text = source.read_text()
    if marker in text:
        text = text.split(marker)[0].rstrip()
if "</model>" not in text:
    raise SystemExit(f"Unexpected x500 model.sdf format in {source}")

if instance:
    slots = [int(instance)]
else:
    slots = list(range(max_slots))

plugins = [marker]
for index in slots:
    plugins.append(
        f"""
    <plugin filename="gz-sim-detachable-joint-system"
            name="gz::sim::systems::DetachableJoint">
      <parent_link>base_link</parent_link>
      <child_model>cargo_x500_{index}</child_model>
      <child_link>package_link</child_link>
      <attach_topic>/cargo/x500_{index}/attach</attach_topic>
      <detach_topic>/cargo/x500_{index}/detach</detach_topic>
      <output_topic>/model/cargo_x500_{index}/detachable_joint/state</output_topic>
      <suppress_child_warning>true</suppress_child_warning>
    </plugin>"""
    )
block = "".join(plugins)
text = text.replace("</model>", f"{block}\n  </model>", 1)
target.write_text(text)
PY

export GZ_SIM_RESOURCE_PATH="$OUT_ROOT:$PX4_HOME/Tools/simulation/gz/models:${GZ_SIM_RESOURCE_PATH:-}"
if [ -n "$UAV_CARGO_INSTANCE" ]; then
  echo "prepare-x500-cargo-models: x500 with cargo slot ${UAV_CARGO_INSTANCE} only -> $OUT_MODEL" >&2
else
  echo "prepare-x500-cargo-models: x500 with ${MAX_CARGO_SLOTS} cargo slots -> $OUT_MODEL" >&2
fi
