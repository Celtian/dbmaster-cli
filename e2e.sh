#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\n${YELLOW}--- HELP ---${NC}\n"

echo -e "\n${RED}1. ${GREEN}yarn start --help${NC}\n"

yarn start --help

echo -e "\n${YELLOW}--- INFO ---${NC}\n"

echo -e "\n${RED}2. ${GREEN}yarn start info${NC}\n"

yarn start info

echo -e "\n${YELLOW}--- COMPARE ---${NC}\n"

echo -e "\n${RED}3. ${GREEN}yarn start compare --left fifa16 --right fifa21 --table leagues --mode column${NC}\n"

yarn start compare --left fifa16 --right fifa21 --table leagues --mode column

echo -e "\n${RED}4. ${GREEN}yarn start  compare --left fifa16 --right fifa21 --table leagues --mode default${NC}\n"

yarn start compare --left fifa16 --right fifa21 --table leagues --mode default

echo -e "\n${RED}5. ${GREEN}yarn start  dbmaster compare --left fifa16 --right fifa21 --table leagues --mode order${NC}\n"

yarn start compare --left fifa16 --right fifa21 --table leagues --mode order

echo -e "\n${RED}5. ${GREEN}yarn start compare --left fifa16 --right fifa21 --table leagues --mode range${NC}\n"

yarn start compare --left fifa16 --right fifa21 --table leagues --mode range

echo -e "\n${RED}5. ${GREEN}yarn start compare --left fifa16 --right fifa21 --table leagues --mode type${NC}\n"

yarn start compare --left fifa16 --right fifa21 --table leagues --mode type

echo -e "\n${YELLOW}--- DISTRIBUTION ---${NC}\n"

echo -e "\n${RED}6. ${GREEN}yarn start distribution --input './examples/fifa16' --fifa fifa16 --table leagues${NC}\n"

yarn start distribution --input './examples/fifa16' --fifa fifa16 --table leagues

echo -e "\n${RED}7. ${GREEN}yarn start distribution --input './examples/fifa16' --fifa fifa16 --table leagues --column leaguetimeslice${NC}\n"

yarn start distribution --input './examples/fifa16' --fifa fifa16 --table leagues --column leaguetimeslice

echo -e "\n${YELLOW}--- CONVERT ---${NC}\n"

echo -e "\n${RED}8. ${GREEN}rm -Rf output && yarn start convert --config './cfg/default-config.yml'${NC}\n"

rm -Rf output && yarn start convert --config './cfg/default-config.yml'

echo -e "\n${YELLOW}--- PLAYERNAMES ---${NC}\n"

echo -e "\n${RED}9. ${GREEN}rm -Rf output && dbmaster playername --fifa fifa21 --input './examples/fifa21' --output './output' --mode minimize${NC}\n"

rm -Rf output && yarn start playername --fifa fifa21 --input './examples/fifa21' --output './output' --mode minimize

echo -e "\n${RED}10. ${GREEN}rm -Rf output && yarn start playername --fifa fifa21 --input './examples/fifa21' --output './output' --mode remove-unused${NC}\n"

rm -Rf output && yarn start playername --fifa fifa21 --input './examples/fifa21' --output './output' --mode remove-unused
