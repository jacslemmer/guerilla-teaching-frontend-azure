#!/bin/bash

# Simple process monitor for development
while true; do
    if [ -f "logs/backend.pid" ]; then
        pid=$(cat logs/backend.pid)
        if ! kill -0 $pid 2>/dev/null; then
            echo "$(date): Backend process died (PID: $pid)" >> logs/monitor.log
        fi
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        pid=$(cat logs/frontend.pid)
        if ! kill -0 $pid 2>/dev/null; then
            echo "$(date): Frontend process died (PID: $pid)" >> logs/monitor.log
        fi
    fi
    
    sleep 30
done
