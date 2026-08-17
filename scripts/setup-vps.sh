#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=================================================="
echo " Starting VPS Automated Setup for Flic Microwaves "
echo " Server: 31.97.207.46 "
echo "=================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run this script as root."
  exit 1
fi

# Update package list
echo "--> Updating APT package index..."
apt-get update -y && apt-get upgrade -y

# Install prerequisite tools
echo "--> Installing basic packages (curl, git, ufw, nginx, postgresql)..."
apt-get install -y curl git ufw nginx postgresql postgresql-contrib

# Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
  echo "--> Installing Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo "--> Node.js is already installed ($(node -v))."
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
  echo "--> Installing PM2 process manager..."
  npm install -g pm2
  pm2 startup systemd -u root --hp /root
else
  echo "--> PM2 is already installed."
fi

# Setup PostgreSQL Database
echo "--> Setting up PostgreSQL database 'flic_microwaves'..."
DB_NAME="flic_microwaves"
DB_USER="flic_admin"
DB_PASS="FlicMicrowavesSecurePass2026!"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER DATABASE $DB_NAME OWNER TO $DB_USER;"

# Create Web Root directories
echo "--> Creating deployment directories under /var/www/flicmicrowaves..."
mkdir -p /var/www/flicmicrowaves/frontend
mkdir -p /var/www/flicmicrowaves/admin
mkdir -p /var/www/flicmicrowaves/backend
mkdir -p /var/www/flicmicrowaves/backend/uploads

# Set directory permissions
chown -R root:www-data /var/www/flicmicrowaves
chmod -R 755 /var/www/flicmicrowaves

# Configure Firewall
echo "--> Configuring UFW Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable || true

echo "=================================================="
echo " VPS Provisioning Completed Successfully! "
echo " Next Steps: "
echo " 1. Configure Nginx: Copy scripts/nginx-flic.conf to /etc/nginx/sites-available/flicmicrowaves.conf "
echo " 2. Enable site: ln -s /etc/nginx/sites-available/flicmicrowaves.conf /etc/nginx/sites-enabled/ "
echo " 3. Reload Nginx: systemctl reload nginx "
echo " 4. Setup Backend .env at /var/www/flicmicrowaves/backend/.env "
echo " 5. Run GitHub Actions deployment to populate files & database! "
echo "=================================================="
