#!/bin/bash

echo -e "\033[1;36m=================================================================\033[0m"
echo -e "\033[1;36m           Claude RTL & Persian Font Auto-Patcher                \033[0m"
echo -e "\033[1;36m=================================================================\033[0m"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null
then
    echo -e "\033[1;31m[!] Node.js is not installed on your system.\033[0m"
    echo -e "\033[1;33mPlease install Node.js from https://nodejs.org/ and try again.\033[0m"
    exit 1
fi

echo -e "\033[1;32m[+] Node.js detected. Running the patcher...\033[0m"
echo ""

# Run the npx command
npx --yes claude-rtl-patcher "$@"
