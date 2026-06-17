#!/usr/bin/env sh
set -eu

ACTION="${1:?action is required}"
NAME="${2:?model name is required}"
LAT="${3:-47.397971}"
LON="${4:-8.546164}"
ALT="${5:-0.0}"
MODEL="${6:-r1_rover}"
AGENT_TYPE="${7:-UAV}"
PACKAGE_ATTACH_OFFSET_M="${PACKAGE_ATTACH_OFFSET_M:-0.35}"

WORLD="${GZ_WORLD:-default}"
PX4_HOME="${PX4_HOME:-/opt/PX4-Autopilot}"
ORIGIN_LAT="${SIM_ORIGIN_LAT:-47.397971}"
ORIGIN_LON="${SIM_ORIGIN_LON:-8.546164}"
SERVICE_TIMEOUT="${GZ_SERVICE_TIMEOUT_MS:-10000}"
export GZ_PARTITION="${GZ_PARTITION:-uav-logistics}"

xy_json() {
  python3 - "$ORIGIN_LAT" "$ORIGIN_LON" "$LAT" "$LON" <<'PY'
import json
import math
import sys

origin_lat, origin_lon, lat, lon = map(float, sys.argv[1:])
earth = 6371000.0
x = math.radians(lon - origin_lon) * earth * math.cos(math.radians(origin_lat))
y = math.radians(lat - origin_lat) * earth
print(json.dumps({"x": x, "y": y}))
PY
}

XY="$(xy_json)"
X="$(printf '%s' "$XY" | python3 -c 'import json,sys; print(json.load(sys.stdin)["x"])')"
Y="$(printf '%s' "$XY" | python3 -c 'import json,sys; print(json.load(sys.stdin)["y"])')"

create_package() {
  SDF="/tmp/${NAME}.sdf"
  cat > "$SDF" <<EOF
<?xml version="1.0" ?>
<sdf version="1.10">
  <model name="$NAME">
    <pose>$X $Y $ALT 0 0 0</pose>
    <static>true</static>
    <link name="package_link">
      <visual name="package_visual">
        <geometry><box><size>0.35 0.35 0.25</size></box></geometry>
        <material>
          <ambient>1.0 0.55 0.05 1</ambient>
          <diffuse>1.0 0.55 0.05 1</diffuse>
        </material>
      </visual>
    </link>
  </model>
</sdf>
EOF
  gz service -s "/world/$WORLD/create" \
    --reqtype gz.msgs.EntityFactory \
    --reptype gz.msgs.Boolean \
    --timeout "$SERVICE_TIMEOUT" \
    --req "sdf_filename: '$SDF', name: '$NAME', pose: {position: {x: $X, y: $Y, z: $ALT}}"
}

remove_model_by_name() {
  gz service -s "/world/$WORLD/remove" \
    --reqtype gz.msgs.Entity \
    --reptype gz.msgs.Boolean \
    --timeout "$SERVICE_TIMEOUT" \
    --req "name: '$1', type: MODEL"
}

package_to_cargo_name() {
  printf '%s' "$1" | sed 's/^package-/cargo-/'
}

carried_world_z() {
  if [ "$AGENT_TYPE" = "UGV" ]; then
    python3 -c "print(float('$ALT') + float('$PACKAGE_ATTACH_OFFSET_M'))"
  else
    # Low relative alt = ground contact; cruise alt = box under the drone in Gazebo.
    python3 - <<PY
import os
alt = float("$ALT")
offset = float(os.environ.get("PACKAGE_ATTACH_OFFSET_M", "0.35"))
min_air = float(os.environ.get("SIM_CARGO_MIN_AIR_Z_M", "2.0"))
if alt < 2.0:
    print(max(0.2, alt))
else:
    print(max(min_air, alt - offset))
PY
  fi
}

spawn_carried_cargo() {
  CARGO="$1"
  CZ="$2"
  SDF="/tmp/${CARGO}.sdf"
  cat > "$SDF" <<EOF
<?xml version="1.0" ?>
<sdf version="1.10">
  <model name="$CARGO">
    <pose>$X $Y $CZ 0 0 0</pose>
    <link name="package_link">
      <inertial>
        <mass>0.01</mass>
        <inertia>
          <ixx>0.0001</ixx><iyy>0.0001</iyy><izz>0.0001</izz>
        </inertia>
      </inertial>
      <gravity>false</gravity>
      <kinematic>true</kinematic>
      <visual name="package_visual">
        <geometry><box><size>0.35 0.35 0.25</size></box></geometry>
        <material>
          <ambient>1.0 0.55 0.05 1</ambient>
          <diffuse>1.0 0.55 0.05 1</diffuse>
        </material>
      </visual>
    </link>
  </model>
</sdf>
EOF
  gz service -s "/world/$WORLD/create" \
    --reqtype gz.msgs.EntityFactory \
    --reptype gz.msgs.Boolean \
    --timeout "$SERVICE_TIMEOUT" \
    --req "sdf_filename: '$SDF', name: '$CARGO', pose: {position: {x: $X, y: $Y, z: $CZ}}"
}

# Option A: same package-* model — kinematic carry via set_pose (no rename to cargo-*).
pickup_visual() {
  GROUND="$NAME"
  CZ="$(carried_world_z)"
  LEGACY="$(package_to_cargo_name "$GROUND")"
  echo "Pickup visual: carry $GROUND at ($X, $Y, $CZ) ($AGENT_TYPE)" >&2
  remove_model_by_name "$LEGACY" >/dev/null 2>&1 || true
  remove_model_by_name "$GROUND" >/dev/null 2>&1 || true
  sleep 0.1
  spawn_carried_cargo "$GROUND" "$CZ"
}

drop_visual() {
  GROUND="$NAME"
  LEGACY="$(package_to_cargo_name "$GROUND")"
  echo "Drop visual: $GROUND at ($X, $Y, $ALT)" >&2
  remove_model_by_name "$LEGACY" >/dev/null 2>&1 || true
  remove_model_by_name "$GROUND" >/dev/null 2>&1 || true
  sleep 0.1
  create_package
}

move_cargo() {
  CZ="$(carried_world_z)"
  gz service -s "/world/$WORLD/set_pose" \
    --reqtype gz.msgs.Pose \
    --reptype gz.msgs.Boolean \
    --timeout "$SERVICE_TIMEOUT" \
    --req "name: '$NAME', position: {x: $X, y: $Y, z: $CZ}"
}

create_station() {
  SDF="/tmp/${NAME}.sdf"
  PARKING_CAPACITY="$(printf '%s' "$MODEL" | cut -d, -f1)"
  STORAGE_CAPACITY="$(printf '%s' "$MODEL" | cut -d, -f2)"
  PARKING_CAPACITY="${PARKING_CAPACITY:-1}"
  STORAGE_CAPACITY="${STORAGE_CAPACITY:-1}"
  STATION_VISUALS="$(python3 - "$PARKING_CAPACITY" "$STORAGE_CAPACITY" <<'PY'
import sys

parking_capacity = max(0, int(sys.argv[1]))
storage_capacity = max(0, int(sys.argv[2]))
slots_per_row = 4
slot_spacing = 2.2
row_spacing = 2.2
section_gap = 2.0
margin = 1.0
parking_footprint = 1.5
storage_footprint = 0.7
base_z = 0.02
base_thickness = 0.04
marker_height = 0.04
slot_z = base_z + base_thickness / 2.0 + marker_height / 2.0


def block_metrics(capacity, footprint):
    if capacity <= 0:
        return 0.0, 0.0
    rows = (capacity + slots_per_row - 1) // slots_per_row
    last_row_count = (capacity - 1) % slots_per_row + 1
    columns = slots_per_row if rows > 1 else last_row_count
    width = (columns - 1) * slot_spacing + footprint
    depth = (rows - 1) * row_spacing + footprint
    return width, depth


p_width, p_depth = block_metrics(parking_capacity, parking_footprint)
s_width, s_depth = block_metrics(storage_capacity, storage_footprint)
gap = section_gap if parking_capacity > 0 and storage_capacity > 0 else 0.0
platform_width = margin + p_width + gap + s_width + margin
content_depth = max(p_depth, s_depth)
platform_depth = content_depth + 2 * margin if parking_capacity + storage_capacity > 0 else 2.0
# Inset collision so rovers can hold approach points without climbing the platform lip.
collision_inset = 0.45
collision_width = max(platform_width - 2 * collision_inset, 1.0)
collision_depth = max(platform_depth - 2 * collision_inset, 1.0)

parking_start_east = -platform_width / 2.0 + margin + parking_footprint / 2.0
parking_start_north = -content_depth / 2.0 + parking_footprint / 2.0
storage_start_east = -platform_width / 2.0 + margin + p_width + gap + storage_footprint / 2.0
storage_start_north = -content_depth / 2.0 + storage_footprint / 2.0


def slot_pose(index, start_east, start_north):
    row, column = divmod(index, slots_per_row)
    east = start_east + column * slot_spacing
    north = start_north + row * row_spacing
    return east, north, slot_z


print(f'''
      <inertial>
        <mass>1.0</mass>
        <inertia>
          <ixx>1.0</ixx><iyy>1.0</iyy><izz>1.0</izz>
        </inertia>
      </inertial>
      <visual name="station_base_visual">
        <pose>0 0 {base_z:.2f} 0 0 0</pose>
        <geometry><box><size>{platform_width:.2f} {platform_depth:.2f} {base_thickness:.2f}</size></box></geometry>
        <material>
          <ambient>0.10 0.12 0.14 1</ambient>
          <diffuse>0.16 0.18 0.20 1</diffuse>
        </material>
      </visual>
      <collision name="station_base_collision">
        <pose>0 0 {base_z:.2f} 0 0 0</pose>
        <geometry><box><size>{collision_width:.2f} {collision_depth:.2f} {base_thickness:.2f}</size></box></geometry>
      </collision>''')

for index in range(parking_capacity):
    east, north, z = slot_pose(index, parking_start_east, parking_start_north)
    # Visual markers only — cylinder curbs blocked PX4 rovers on approach.
    print(f'''
      <visual name="parking_charging_slot_{index}">
        <pose>{east:.2f} {north:.2f} {z:.2f} 0 0 0</pose>
        <geometry><box><size>1.5 1.5 0.02</size></box></geometry>
        <material>
          <ambient>0.45 0.25 0.95 1</ambient>
          <diffuse>0.55 0.35 1.0 1</diffuse>
        </material>
      </visual>''')

for index in range(storage_capacity):
    east, north, z = slot_pose(index, storage_start_east, storage_start_north)
    print(f'''
      <visual name="storage_slot_{index}">
        <pose>{east:.2f} {north:.2f} {z:.2f} 0 0 0</pose>
        <geometry><box><size>0.7 0.7 0.02</size></box></geometry>
        <material>
          <ambient>0.85 0.2 0.35 1</ambient>
          <diffuse>0.95 0.25 0.45 1</diffuse>
        </material>
      </visual>''')
PY
)"
  cat > "$SDF" <<EOF
<?xml version="1.0" ?>
<sdf version="1.10">
  <model name="$NAME">
    <pose>$X $Y $ALT 0 0 0</pose>
    <static>true</static>
    <link name="station_link">
$STATION_VISUALS
    </link>
  </model>
</sdf>
EOF
  gz service -s "/world/$WORLD/create" \
    --reqtype gz.msgs.EntityFactory \
    --reptype gz.msgs.Boolean \
    --timeout "$SERVICE_TIMEOUT" \
    --req "sdf_filename: '$SDF', name: '$NAME', pose: {position: {x: $X, y: $Y, z: $ALT}}"
}

move_model() {
  gz service -s "/world/$WORLD/set_pose" \
    --reqtype gz.msgs.Pose \
    --reptype gz.msgs.Boolean \
    --timeout "$SERVICE_TIMEOUT" \
    --req "name: '$NAME', position: {x: $X, y: $Y, z: $ALT}"
}

spawn_model() {
  MODEL_PATH="$PX4_HOME/Tools/simulation/gz/models/$MODEL/model.sdf"
  gz service -s "/world/$WORLD/create" \
    --reqtype gz.msgs.EntityFactory \
    --reptype gz.msgs.Boolean \
    --timeout "$SERVICE_TIMEOUT" \
    --req "sdf_filename: '$MODEL_PATH', name: '$NAME', pose: {position: {x: $X, y: $Y, z: $ALT}}"
}

remove_model() {
  gz service -s "/world/$WORLD/remove" \
    --reqtype gz.msgs.Entity \
    --reptype gz.msgs.Boolean \
    --timeout "$SERVICE_TIMEOUT" \
    --req "name: '$NAME', type: MODEL"
}

case "$ACTION" in
  create-package) create_package ;;
  create-station) create_station ;;
  pickup-visual) pickup_visual ;;
  move-cargo) move_cargo ;;
  drop-visual) drop_visual ;;
  move-package) move_model ;;
  move-agent) move_model ;;
  spawn-model) spawn_model ;;
  remove-model) remove_model ;;
  create-agent) spawn_model ;;
  attach-package) pickup_visual ;;
  release-package) drop_visual ;;
  *) echo "Unknown action: $ACTION" >&2; exit 2 ;;
esac
