# Deploy Tesslate Studio to Railway

## Quick Setup (5 minutes)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `Tesslate-RIP/Studio` repository
   - Railway will auto-detect docker-compose.yml

3. **Add Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-create and link it

4. **Set Environment Variables**
   Click on the orchestrator service → Variables:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}  (auto-filled by Railway)
   SECRET_KEY=<generate-random-32-char-string>
   LITELLM_API_KEY=<your-litellm-key-if-needed>
   DOMAIN=<your-railway-domain>.railway.app
   ```

   Note: The DATABASE_URL is automatically converted from `postgresql://` to `postgresql+asyncpg://` by the application code to support async database operations.

5. **Deploy**
   - Railway auto-deploys on push to main
   - Get your URL: `https://<project-name>.railway.app`

## Cost
- Free $5/month credit
- ~$5-10/month after that for small usage
- Pay only for what you use

## Management
- **Zero** - Railway handles all infrastructure
- Automatic SSL, scaling, monitoring included
- Logs and metrics in dashboard

## To Deploy Now:
1. Push your code to GitHub
2. Connect Railway to your repo
3. Done!
