module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./backend",
      script: "dist/main.js",
      watch: true,
      env_production: {
        NODE_ENV: "production",
      },
      mex_memory_restart: "200M",
    },
    {
      name: "frontend",
      cwd: "./frontend",
      script: "index.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "kanapex",
      host: "95.216.174.76",
      ref: "origin/master",
      repo: "https://github.com/tommimarkus/kanaliiga-apex.git",
      path: "/var/opt/apps/kanaliiga-apex",
      "pre-deploy-local": "",
      "post-deploy":
        "sh post-deploy.sh && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      env_production: {
        NODE_ENV: "production",
      },
    },
  },
};
