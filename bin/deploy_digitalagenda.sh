#!/bin/bash

# ===============================
# 🟡 1. SSH into Server & Execute Commands (With TTY)
# ===============================
ssh -t indian@192.168.5.32 << 'EOF'

# ===============================
# 🟡 2. Install NVM (If Missing)
# ===============================
if ! command -v nvm &> /dev/null; then
  echo "Installing NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  source "$NVM_DIR/nvm.sh"
fi

# ===============================
# 🟡 3. Set Node Version (Match Local)
# ===============================
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 18.18.0
nvm use 18.18.0
nvm alias default 18.18.0
echo "Node version: $(node -v)"

# ===============================
# 🟡 4. Set Up Directories
# ===============================
DEPLOY_DIR="/var/www/digitalagenda"
RELEASE_DIR="$DEPLOY_DIR/releases/$(date +%Y%m%d%H%M%S)"
CURRENT_DIR="$DEPLOY_DIR/current"

echo "Creating new release directory: $RELEASE_DIR"
mkdir -p $RELEASE_DIR

EOF

# ===============================
# 🟡 5. Sync Files from WSL to Server (Using TTY for Password)
# ===============================
rsync -avzh -e "ssh -o StrictHostKeyChecking=no -t" ~/digital-agenda/build/ indian@192.168.5.32:$RELEASE_DIR

# ===============================
# 🟡 6. SSH Back to Server and Install Dependencies
# ===============================
ssh -t indian@192.168.5.32 << 'EOF'

cd $RELEASE_DIR

# 🟡 Fix Yarn: Use --immutable for Yarn 2/3
if [ -f "$DEPLOY_DIR/shared/yarn-cache" ]; then
  echo "Using existing Yarn cache..."
  export YARN_CACHE_FOLDER="$DEPLOY_DIR/shared/yarn-cache"
fi

# Install Dependencies Using --immutable for Yarn 2/3
yarn install --immutable --immutable-cache --production

# ===============================
# 🟡 7. Update Symlink for Zero Downtime
# ===============================
ln -sfn $RELEASE_DIR $CURRENT_DIR
echo "Deployment completed. Now serving from $CURRENT_DIR"

# ===============================
# 🟡 8. Clean Up Old Releases
# ===============================
cd $DEPLOY_DIR/releases
ls -t | tail -n +6 | xargs rm -rf

echo "Deployment finished."

EOF
