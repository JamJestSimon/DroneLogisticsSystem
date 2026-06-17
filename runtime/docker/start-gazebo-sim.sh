#!/usr/bin/env sh
set -eu

PX4_HOME="${PX4_HOME:-/opt/PX4-Autopilot}"
WORLD="${GZ_WORLD:-default}"
GZ_PARTITION="${GZ_PARTITION:-uav-logistics}"
GZ_IP="${GZ_IP:-$(hostname -i | awk '{print $1}')}"

export GZ_IP
export GZ_PARTITION
export GZ_SIM_RESOURCE_PATH="${PX4_HOME}/Tools/simulation/gz/models:${GZ_SIM_RESOURCE_PATH:-}"
export LIBGL_ALWAYS_SOFTWARE=1
export GALLIUM_DRIVER=llvmpipe
export MESA_LOADER_DRIVER_OVERRIDE=llvmpipe

WORLD_PATH="$PX4_HOME/Tools/simulation/gz/worlds/$WORLD.sdf"
RUNTIME_WORLD_PATH="/tmp/${WORLD}-with-systems.sdf"

python3 - "$WORLD_PATH" "$RUNTIME_WORLD_PATH" <<'PY'
import sys
from pathlib import Path

source = Path(sys.argv[1])
target = Path(sys.argv[2])
text = source.read_text()
world_tag = '<world name="default">'
systems = f"""{world_tag}
    <plugin filename="gz-sim-physics-system" name="gz::sim::systems::Physics"/>
    <plugin filename="gz-sim-user-commands-system" name="gz::sim::systems::UserCommands"/>
    <plugin filename="gz-sim-scene-broadcaster-system" name="gz::sim::systems::SceneBroadcaster"/>
    <plugin filename="gz-sim-sensors-system" name="gz::sim::systems::Sensors">
      <render_engine>ogre</render_engine>
    </plugin>
    <plugin filename="gz-sim-imu-system" name="gz::sim::systems::Imu"/>
    <plugin filename="gz-sim-air-pressure-system" name="gz::sim::systems::AirPressure"/>
    <plugin filename="gz-sim-magnetometer-system" name="gz::sim::systems::Magnetometer"/>
    <plugin filename="gz-sim-navsat-system" name="gz::sim::systems::NavSat"/>
"""
if "gz::sim::systems::Physics" not in text:
    text = text.replace(world_tag, systems, 1)
target.write_text(text)
PY

exec gz sim -r -s "$RUNTIME_WORLD_PATH" --render-engine ogre
