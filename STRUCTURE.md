# Final Project Structure

## Core Files
- `index.js` - Main script (DuckDuckGo version)
- `google-version.js` - Google search version (may face bot detection)  
- `duckduckgo-version.js` - DuckDuckGo version (recommended)
- `prompts.js` - AI prompts for lead extraction and email generation
- `package.json` - Dependencies and project info

## Configuration
- `.env` - Environment variables (your credentials)
- `.env.example` - Template for environment setup
- `.gitignore` - Git ignore rules (protects credentials and debug files)

## Documentation
- `README.md` - Simple usage guide
- `STRUCTURE.md` - This file

## Generated Files (Created After Running)
- `emails.json` - Generated email list with personalized content

## Usage Examples
```bash
# Recommended (best success rate)
node duckduckgo-version.js "coffee shop"
node duckduckgo-version.js "restaurant"

# Alternative (may get blocked by bot detection)
node google-version.js "pizza place" 

# Default (same as DuckDuckGo version)
node index.js "bakery"
```

## Clean & Production Ready ✅
- All debug files removed
- No test files or experimental code
- Minimal, focused codebase
- Proper error handling
- Clean console output
