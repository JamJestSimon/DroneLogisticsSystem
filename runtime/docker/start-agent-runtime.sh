#!/usr/bin/env sh
set -eu

AGENT_ID="${AGENT_ID:-20000000-0000-4000-8000-000000000001}"
AGENT_TYPE="${AGENT_TYPE:-UAV}"
BACKEND_URL="${BACKEND_URL:-http://host.docker.internal:8080}"
PX4_HOME="${PX4_HOME:-/opt/PX4-Autopilot}"
PX4_MODEL="${PX4_MODEL:-x500}"
PX4_INSTANCE="${PX4_INSTANCE:-0}"
MAVLINK_PORT="${MAVLINK_PORT:-14580}"
PROJECT_ROOT="${PROJECT_ROOT:-/workspace}"
GZ_IP="${GZ_IP:-}"
GZ_RELAY="${GZ_RELAY:-}"
GZ_PARTITION="${GZ_PARTITION:-uav-logistics}"
PX4_GZ_WORLD="${PX4_GZ_WORLD:-${GZ_WORLD:-default}}"
INITIAL_LATITUDE="${INITIAL_LATITUDE:-47.397971}"
INITIAL_LONGITUDE="${INITIAL_LONGITUDE:-8.546164}"
# Spawn slightly above ground so the x500 settles upright (z=0 embeds the model in the plane).
INITIAL_ALTITUDE="${INITIAL_ALTITUDE:-2.0}"
SIM_ORIGIN_LAT="${SIM_ORIGIN_LAT:-47.397971}"
SIM_ORIGIN_LON="${SIM_ORIGIN_LON:-8.546164}"

if [ -z "$GZ_IP" ]; then
  GZ_IP="$(hostname -i | awk '{print $1}')"
fi

AUTOSTART="4001"
if [ "$AGENT_TYPE" = "UGV" ]; then
  AUTOSTART="4009"
fi

PX4_MAVLINK_PORT=$((14540 + PX4_INSTANCE))
CONTROLLER_MAVLINK_PORT=$((14640 + PX4_INSTANCE))
PX4_TARGET_SYSTEM=$((PX4_INSTANCE + 1))
PX4_GZ_MODEL_POSE="$(python3 - "$SIM_ORIGIN_LAT" "$SIM_ORIGIN_LON" "$INITIAL_LATITUDE" "$INITIAL_LONGITUDE" "$INITIAL_ALTITUDE" <<'PY'
import math
import sys

origin_lat, origin_lon, lat, lon, alt = map(float, sys.argv[1:])
earth = 6371000.0
x = math.radians(lon - origin_lon) * earth * math.cos(math.radians(origin_lat))
y = math.radians(lat - origin_lat) * earth
print(f"{x},{y},{alt},0,0,0")
PY
)"

cd "$PX4_HOME"
. .px4-venv/bin/activate

if [ ! -x build/px4_sitl_default/bin/px4 ]; then
  make px4_sitl_default
fi

export PX4_SYS_AUTOSTART="$AUTOSTART"
export PX4_GZ_MODEL="$PX4_MODEL"
export PX4_GZ_MODEL_POSE="$PX4_GZ_MODEL_POSE"
export PX4_GZ_STANDALONE=1
export PX4_GZ_WORLD
export PX4_SIM_MODEL="gz_${PX4_MODEL}"
export GZ_IP
export GZ_RELAY
export GZ_PARTITION
export GZ_SIM_RESOURCE_PATH="${PX4_HOME}/Tools/simulation/gz/models:${GZ_SIM_RESOURCE_PATH:-}"

{
  echo "AGENT_ID=$AGENT_ID"
  echo "PX4_INSTANCE=$PX4_INSTANCE"
  echo "PX4_GZ_MODEL=$PX4_GZ_MODEL"
  echo "PX4_GZ_MODEL_POSE=$PX4_GZ_MODEL_POSE"
  echo "PX4_GZ_STANDALONE=$PX4_GZ_STANDALONE"
  echo "PX4_GZ_WORLD=$PX4_GZ_WORLD"
  echo "PX4_SIM_MODEL=$PX4_SIM_MODEL"
  echo "GZ_IP=$GZ_IP"
  echo "GZ_RELAY=$GZ_RELAY"
  echo "GZ_PARTITION=$GZ_PARTITION"
} >/tmp/px4-start-env.log

./build/px4_sitl_default/bin/px4 -i "$PX4_INSTANCE" >/dev/null 2>&1 &

sleep 5

./build/px4_sitl_default/bin/px4-mavlink \
  --instance "$PX4_INSTANCE" \
  start \
  -u "$PX4_MAVLINK_PORT" \
  -r 400000 \
  -t 127.0.0.1 \
  -o "$CONTROLLER_MAVLINK_PORT" \
  -m onboard || true

cd "$PROJECT_ROOT"
export AGENT_ID
export AGENT_TYPE
export BACKEND_URL
export AGENT_INITIAL_LAT="$INITIAL_LATITUDE"
export AGENT_INITIAL_LON="$INITIAL_LONGITUDE"
export AGENT_INITIAL_ALT="$INITIAL_ALTITUDE"
export PX4_CONNECTION="udp://0.0.0.0:${CONTROLLER_MAVLINK_PORT}"
export MAVSDK_SERVER_BIN="${MAVSDK_SERVER_BIN:-/usr/local/bin/mavsdk_server}"
export MAVSDK_GRPC_PORT="${MAVSDK_GRPC_PORT:-$((50051 + PX4_INSTANCE))}"
export PX4_TARGET_SYSTEM
export POLLING_PERIOD_MS="${POLLING_PERIOD_MS:-3000}"
export SIMULATION_GAZEBO_ENABLED="${SIMULATION_GAZEBO_ENABLED:-true}"
export SIMULATION_OFFBOARD_ONLY="${SIMULATION_OFFBOARD_ONLY:-true}"
export PX4_GZ_MODEL="${PX4_GZ_MODEL:-$PX4_MODEL}"

exec ./gradlew :agent-controller:run
