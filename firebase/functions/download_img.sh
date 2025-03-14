#!/bin/bash

# Check if jq is installed (needed to parse JSON)
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install it using your package manager."
    echo "For example: apt-get install jq (Debian/Ubuntu) or brew install jq (macOS)"
    exit 1
fi

# Check if wget is installed
if ! command -v wget &> /dev/null; then
    echo "Error: wget is not installed. Please install it using your package manager."
    echo "For example: apt-get install wget (Debian/Ubuntu) or brew install wget (macOS)"
    exit 1
fi

# Check if JSON file exists
JSON_FILE="company_logos.json"
if [ ! -f "$JSON_FILE" ]; then
    echo "Error: $JSON_FILE not found. Please run the Python script first."
    exit 1
fi

# Create logos directory if it doesn't exist
LOGOS_DIR="logos"
mkdir -p "$LOGOS_DIR"

# Get the number of entries in the JSON file
COUNT=$(jq length "$JSON_FILE")
echo "Found $COUNT logo entries to download."

# Read JSON file and download each logo
for i in $(seq 0 $(($COUNT - 1))); do
    URL=$(jq -r ".[$i].url" "$JSON_FILE")
    FILENAME=$(jq -r ".[$i].file" "$JSON_FILE")
    
    echo "Downloading ($((i+1))/$COUNT): $FILENAME"
    
    # Download the file with wget
    # -q for quiet mode
    # --show-progress to still show a progress bar
    # -O to specify output filename
    wget -q --show-progress "$URL" -O "$LOGOS_DIR/$FILENAME"
    
    # Check if download was successful
    if [ $? -eq 0 ]; then
        echo "Success: $FILENAME downloaded"
    else
        echo "Error: Failed to download $FILENAME"
    fi
    
    # Add a small delay to avoid overwhelming the server
    sleep 0.5
done

echo "Download complete. Check the '$LOGOS_DIR' directory for your logo files."