module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./backend",
      script: "dist/src/main.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      max_memory_restart: "200M",
    },
  ],

  deploy: {
    production: {
      user: "kanapex",
      host: "95.216.174.76",
      ref: "origin/main",
      repo: "git@github.com:tommimarkus/kanaliiga-apex.git",
      path: "/var/opt/apps/kanaliiga-apex",
      "pre-deploy-local": "",
      "post-deploy":
        ". ~/.bash_profile && ~/setup.sh && sh post-deploy.sh && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      env_production: {
        NODE_ENV: "production",
      },
    },
  },
};
