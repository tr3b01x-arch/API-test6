const express = require("./mini-express");
const cors = require("./mini-cors");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({
  name: "Restaurant Group Mock API Suite",
  status: "ok",
  services: ["meta-ads", "xero", "sunday", "easilys", "fourth-hospitality", "lightspeed", "sevenrooms"],
  health: "/health",
  documentation: "/docs"
}));
app.get("/health", (req, res) => res.json({status:"ok", services:7, generatedAt:new Date().toISOString()}));
app.get("/docs", (req, res) => res.type("text").send(require("fs").readFileSync(require("path").join(__dirname,"API-ENDPOINTS.md"),"utf8")));

app.use("/meta-ads", require("./services/meta-ads/app").app);
app.use("/xero", require("./services/xero/app").app);
app.use("/sunday", require("./services/sunday/app").app);
app.use("/easilys", require("./services/easilys/app").app);
app.use("/fourth-hospitality", require("./services/fourth-hospitality/app").app);
app.use("/lightspeed", require("./services/lightspeed/app"));
app.use("/sevenrooms", require("./services/sevenrooms/app"));

app.use((req,res)=>res.status(404).json({error:"Not found",path:req.path,try:"/docs"}));
const PORT=process.env.PORT || 3000;
if(require.main===module) app.listen(PORT,"0.0.0.0",()=>console.log(`Restaurant mock API suite listening on ${PORT}`));
module.exports=app;
