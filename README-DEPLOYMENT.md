# Flic Microwaves - Hostinger VPS CI/CD Deployment Guide

This guide describes how to complete the initial setup on your **Hostinger VPS (`31.97.207.46`)** and configure **GitHub Actions CI/CD** for automatic deployments.

---

## 🛠️ Step 1: Initial VPS Provisioning (Run Once on Server)

1. **SSH into your Hostinger VPS**:
   ```bash
   ssh root@31.97.207.46
   ```

2. **Download & Run the Setup Script**:
   ```bash
   # Clone or copy the setup script to the server
   curl -sSL https://raw.githubusercontent.com/cambliss/flicmicrowaves-new-black/master/scripts/setup-vps.sh | bash
   ```
   *Or manually copy `scripts/setup-vps.sh` to the server and execute `bash setup-vps.sh`.*

3. **Configure Nginx Site**:
   ```bash
   cp /var/www/flicmicrowaves/scripts/nginx-flic.conf /etc/nginx/sites-available/flicmicrowaves.conf
   ln -sf /etc/nginx/sites-available/flicmicrowaves.conf /etc/nginx/sites-enabled/flicmicrowaves.conf
   rm -f /etc/nginx/sites-enabled/default
   nginx -t
   systemctl reload nginx
   ```

4. **Create Backend Environment File (`.env`)**:
   On the server, create `/var/www/flicmicrowaves/backend/.env`:
   ```bash
   cat << 'EOF' > /var/www/flicmicrowaves/backend/.env
   # PostgreSQL Connection
   DATABASE_URL=postgresql://flic_admin:FlicMicrowavesSecurePass2026!@localhost:5432/flic_microwaves
   DATABASE_SSL=false

   # Server Port
   PORT=4000

   # JWT Secret for Admin Auth
   JWT_SECRET=flic_microwaves_super_secret_jwt_key_2026_prod

   # Admin Pass Hash (Generated via bcryptjs)
   ADMIN_USER=admin
   ADMIN_PASS_HASH=$2a$10$e.wXq0Z.8dGv6u0P6k1SReXgKqX1.V/z9kE6j8L5.2Y0m7a
   ALLOWED_ORIGINS=http://31.97.207.46,http://localhost:4000
   EOF
   ```

5. **Initialize Database Schema**:
   Run the database schema file to set up the tables:
   ```bash
   PGPASSWORD='FlicMicrowavesSecurePass2026!' psql -h localhost -U flic_admin -d flic_microwaves -f /var/www/flicmicrowaves/backend/db/schema.sql
   ```

---

## 🔑 Step 2: Configure SSH Key for GitHub Actions

To allow GitHub Actions to securely deploy code to `31.97.207.46`:

1. **Generate SSH Key Pair on Server or Local**:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key -N ""
   ```

2. **Add Public Key to `authorized_keys`**:
   ```bash
   cat ~/.ssh/github_deploy_key.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Copy Private Key Content**:
   ```bash
   cat ~/.ssh/github_deploy_key
   ```
   *(Copy the entire private key output including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)*

---

## ⚙️ Step 3: Set Up GitHub Secrets

1. Open your GitHub Repository: `https://github.com/cambliss/flicmicrowaves-new-black`
2. Go to **Settings** -> **Secrets and variables** -> **Actions**.
3. Click **New repository secret** and add:
   - **`SSH_HOST`**: `31.97.207.46`
   - **`SSH_USERNAME`**: `root`
   - **`SSH_KEY`**: Paste the private SSH key copied from Step 2.

---

## 🚀 Step 4: Trigger CI/CD Deployment

Whenever you push to the `master` branch:
```bash
git add .
git commit -m "Deploy to Hostinger VPS"
git push origin master
```
GitHub Actions will automatically:
1. Build the React Frontend (`dist/`)
2. Build the Admin Panel (`admin/dist/`)
3. Upload files to `31.97.207.46` via SSH
4. Restart PM2 backend process (`flic-backend`)
5. Reload Nginx web server

---

## 🌐 Server URLs

- **Main Website**: [http://31.97.207.46/](http://31.97.207.46/)
- **Admin Panel**: [http://31.97.207.46/admin/](http://31.97.207.46/admin/)
- **Backend API**: [http://31.97.207.46/api/health](http://31.97.207.46/api/health)
