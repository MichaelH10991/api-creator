#!/bin/bash

type=$1

case $type in
major)
    echo "Publishing major version."
    npm version major
    git push
    ;;
minor)
    echo "Publishing minor version."
    npm version minor
    git push
    # Stop logic
    ;;
patch)
    echo "Publishing patch version."
    npm version patch
    git push
    # Stop logic
    ;;
*)
	# Default logic
    echo $"Usage: $0 {major|minor|patch}"
    exit 1
    ;;
esac