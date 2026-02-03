# Git Commands to Push to GitHub

## Step 1: Check Current Status
```bash
cd Infosys_Project
git status
```

## Step 2: Add All Files
```bash
# Add all files to staging
git add .

# Or add specific directories
git add backend/
git add Frontend/
git add *.md
git add *.ps1
```

## Step 3: Commit Changes
```bash
git commit -m "Initial commit: Complete Inventra inventory management system

- Added Spring Boot backend with JWT authentication
- Added React frontend with Tailwind CSS
- Implemented role-based access control (Admin/Manager/Staff)
- Added fashion product management with variants
- Implemented stock transaction system
- Added alert system for low stock notifications
- Created user management system
- Added comprehensive documentation"
```

## Step 4: Add Remote Repository (if not already added)
```bash
git remote add origin https://github.com/ravvahemanth/inventra_-infy-internship.git
```

## Step 5: Push to GitHub
```bash
# Push to main branch
git push -u origin main

# Or if your default branch is master
git push -u origin master
```

## Alternative: If you need to force push (use carefully)
```bash
git push -f origin main
```

## Step 6: Verify on GitHub
Visit: https://github.com/ravvahemanth/inventra_-infy-internship.git

## Additional Commands

### Check Remote URL
```bash
git remote -v
```

### Check Branch
```bash
git branch
```

### Switch to Main Branch (if needed)
```bash
git checkout main
# or
git checkout master
```

### Pull Latest Changes (if repository has content)
```bash
git pull origin main
```

## Troubleshooting

### If you get "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/ravvahemanth/inventra_-infy-internship.git
```

### If you get merge conflicts
```bash
git pull origin main --allow-unrelated-histories
# Resolve conflicts manually, then:
git add .
git commit -m "Merge remote changes"
git push origin main
```

### If you want to see what will be pushed
```bash
git diff --cached
git log --oneline
```