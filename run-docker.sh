#!/bin/bash

# run-docker.sh - Script to run the test-platform Docker containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting test-platform containers...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: docker-compose is not installed${NC}"
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p ./data

# Build and start containers
echo -e "${YELLOW}Building and starting containers...${NC}"
docker-compose up --build -d

# Wait a moment for containers to start
sleep 2

# Check container status
echo -e "${YELLOW}Checking container status...${NC}"
docker-compose ps

echo -e "${GREEN}Containers are running!${NC}"
echo -e "Frontend: ${GREEN}http://localhost:3005${NC}"
echo -e "Backend:  ${GREEN}http://localhost:5005${NC}"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
