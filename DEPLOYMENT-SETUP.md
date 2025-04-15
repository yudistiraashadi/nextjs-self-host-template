# Deploying Your NextJS App with Automatic SSL on a VPS

This guide explains how to deploy your NextJS application to a VPS with automatic SSL certificate setup using Caddy.

## Why Caddy?

Caddy is a modern web server that automatically handles HTTPS for you. It:

- Automatically obtains and renews SSL certificates from Let's Encrypt
- Configures secure TLS settings by default
- Requires minimal configuration

## Prerequisites

1. A VPS with Docker and Docker Compose installed
2. A domain name pointing to your VPS's IP address
3. Ports 80 and 443 open on your VPS's firewall

## Setup Steps

1. Clone this repository to your VPS:

   ```
   git clone <your-repo-url>
   cd <your-project-directory>
   ```

2. Create an `.env` file from the example:

   ```
   cp .env.example .env
   ```

3. Edit the `.env` file to fill in all the required environment variables:

   ```
   nano .env
   ```

4. Edit the Caddyfile to use your actual domain name:

   ```
   nano Caddyfile
   ```

   Replace `example.com` with your actual domain name.

5. Start all services with Docker Compose:

   ```
   docker-compose -f docker-compose.production.yml up -d
   ```

6. Your application should now be accessible at `https://your-domain.com`

## Certificate Renewal

Caddy automatically handles certificate renewal in the background without any additional configuration.

## Troubleshooting

If you encounter issues, you can check the container logs:

```
docker-compose -f docker-compose.production.yml logs caddy
docker-compose -f docker-compose.production.yml logs nextjs
```

If you need to restart Caddy:

```
docker-compose -f docker-compose.production.yml restart caddy
```
