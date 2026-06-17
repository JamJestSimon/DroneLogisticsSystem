#!/usr/bin/env sh
set -eu

DISPLAY_ID="${DISPLAY_ID:-99}"
GZ_PARTITION="${GZ_PARTITION:-uav-logistics}"
GZ_IP="${GZ_IP:-$(hostname -i | awk '{print $1}')}"
NOVNC_PORT="${NOVNC_PORT:-6080}"
VNC_PORT="${VNC_PORT:-5900}"
SCREEN_SIZE="${SCREEN_SIZE:-1920x1080x24}"

export DISPLAY=":${DISPLAY_ID}"
export GZ_IP
export GZ_PARTITION
export LIBGL_ALWAYS_SOFTWARE=1
export GALLIUM_DRIVER=llvmpipe
export MESA_LOADER_DRIVER_OVERRIDE=llvmpipe
export QT_QPA_PLATFORM=xcb

rm -f "/tmp/.X${DISPLAY_ID}-lock" "/tmp/.X11-unix/X${DISPLAY_ID}"
mkdir -p /tmp/runtime-root
chmod 700 /tmp/runtime-root
export XDG_RUNTIME_DIR=/tmp/runtime-root

Xvfb "$DISPLAY" -screen 0 "$SCREEN_SIZE" -ac +extension GLX +render -noreset &
sleep 1

fluxbox >/tmp/fluxbox.log 2>&1 &
x11vnc -display "$DISPLAY" -forever -shared -nopw -listen 0.0.0.0 -rfbport "$VNC_PORT" >/tmp/x11vnc.log 2>&1 &
websockify --web=/usr/share/novnc "0.0.0.0:${NOVNC_PORT}" "127.0.0.1:${VNC_PORT}" >/tmp/novnc.log 2>&1 &

gz sim -g --render-engine-gui ogre --render-engine-gui-api-backend opengl &
GZ_PID="$!"

(
  for _ in $(seq 1 60); do
    WINDOW_ID="$(wmctrl -l 2>/dev/null | awk 'BEGIN{IGNORECASE=1} /Gazebo|gz sim|Gazebo Sim/ {print $1; exit}')"
    if [ -n "${WINDOW_ID:-}" ]; then
      wmctrl -i -r "$WINDOW_ID" -b add,fullscreen,maximized_vert,maximized_horz || true
      break
    fi
    sleep 1
  done
) &

wait "$GZ_PID"
