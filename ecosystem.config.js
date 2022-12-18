module.exports = {
  apps : [
    {
      name  : "cryptotracker",
      script  : "npx",
      interpreter: "none",
      args: "serve -s build -p 3002"
    }
  ]
}
