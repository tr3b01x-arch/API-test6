const app = require("./app");
const http = require("node:http");
const server = app.listen(0,"127.0.0.1",async()=>{
  const base=`http://127.0.0.1:${server.address().port}`;
  const prefixes=["meta-ads","xero","sunday","easilys","fourth-hospitality","lightspeed","sevenrooms"];
  const checks=["/health",...prefixes.map(p=>`/${p}/health`),...prefixes.map(p=>`/${p}/locations?limit=100`)];
  const resources={
    "meta-ads":["accounts","campaigns","adsets","ads","insights","creatives","audiences"],
    "xero":["organisations","contacts","invoices","credit-notes","payments","bank-transactions","accounts","tracking-categories","reports/profit-and-loss","reports/balance-sheet","reports/trial-balance"],
    "sunday":["locations","bills","payments","refunds","tips","transactions","reports/daily"],
    "easilys":["locations","products","inventory","stock-movements","suppliers","purchase-orders","deliveries","recipes","recipe-ingredients","waste","reports/food-cost"],
    "fourth-hospitality":["locations","employees","employment","departments","roles","shifts","timesheets","time-attendance","absences","labour-costs","reports/labour"],
    "lightspeed":["locations","products","categories","sales","orders","payments","receipts","employees","registers","tax-rates","reports/sales"],
    "sevenrooms":["locations","reservations","guests","tables","shifts","waitlist","events","floorplans","experiences","guest-notes"]
  };
  for(const [prefix,paths] of Object.entries(resources)) for(const path of paths) checks.push(`/${prefix}/${path}?limit=2`);
  checks.push("/sevenrooms/reservations?locationId=uk-ave-mario&limit=2","/lightspeed/sales?locationId=uk-ave-mario&limit=2","/xero/invoices?limit=3&offset=1","/not-a-real-api");
  try{
    for(const path of checks){
      const r=await fetch(base+path); const body=await r.json();
      if(path==="/not-a-real-api"){if(r.status!==404)throw Error(`${path}: expected 404, got ${r.status}`);continue;}
      if(!r.ok)throw Error(`${path}: HTTP ${r.status} ${JSON.stringify(body)}`);
      if(path.endsWith("/locations?limit=100") && body.data?.length!==44)throw Error(`${path}: expected 44 locations, got ${body.data?.length}`);
      if(path.includes("/health") && body.status!=="ok")throw Error(`${path}: invalid health response`);
    }
    console.log(`PASS: ${checks.length} HTTP checks across 7 APIs.`);
  }catch(e){console.error("FAIL:",e.message);process.exitCode=1;}finally{server.close();}
});
