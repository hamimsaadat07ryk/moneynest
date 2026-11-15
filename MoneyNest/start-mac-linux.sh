#!/bin/sh
cd "$(dirname "$0")"
echo "Opening http://localhost:8765 ..."
(sleep 1; (xdg-open http://localhost:8765 || open http://localhost:8765) >/dev/null 2>&1) &
python3 server.py
