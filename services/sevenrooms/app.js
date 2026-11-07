const express=require("../../mini-express");
const cors=require("../../mini-cors");
const app=express();
app.use(cors());
app.use(express.json());
const locations=require("./locations.json");
const SERVICE="sevenrooms";
const ROUTES=[{"path": "locations", "key": "locations"}, {"path": "reservations", "key": "reservations"}, {"path": "guests", "key": "guests"}, {"path": "tables", "key": "tables"}, {"path": "shifts", "key": "shifts"}, {"path": "waitlist", "key": "waitlist"}, {"path": "events", "key": "events"}, {"path": "floorplans", "key": "floorplans"}, {"path": "experiences", "key": "experiences"}, {"path": "guest-notes", "key": "guest-notes"}];
const DAY=86400000, today=new Date(); today.setUTCHours(0,0,0,0);
const iso=d=>d.toISOString().slice(0,10), dateAt=n=>iso(new Date(today.getTime()+n*DAY));
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const choose=(a,s)=>a[s%a.length], num=(s,min,max)=>min+(s%(max-min+1)), money=n=>Number(n.toFixed(2));
const staff=["Alex Morgan","Sofia Bennett","Luca Rossi","Maya Patel","Noah Williams","Emma Clarke","Leo Martin","Amira Khan"];
const products=["Margherita Pizza","Burrata Salad","Carbonara","Tiramisu","Espresso","House Wine","Chicken Milanese","Olive Oil"];
const guests=["Oliver Smith","Amelia Johnson","Lucas Brown","Isabella Garcia","Ethan Wilson","Mia Davis","Noah Martin","Sofia Rossi"];
const channels=["WEB","PHONE","WALK_IN","CONCIERGE","EMAIL"];
const methods=["VISA","MASTERCARD","AMEX","APPLE_PAY","CASH"];
function build(resource){
 const rows=[];
 for(const loc of locations){
  if(["locations","categories","employees","registers","tax-rates","tables","shifts","floorplans","experiences"].includes(resource)){
   for(let i=0;i<(["tables","employees"].includes(resource)?12:resource==="experiences"?4:resource==="floorplans"?2:3);i++)rows.push(make(resource,loc,null,i));
   continue;
  }
  const start=resource==="reservations"||resource==="sales"||resource==="orders"||resource==="payments"||resource==="receipts"||resource==="waitlist"?-100:-100;
  const end=resource==="reservations"||resource==="waitlist"?14:0;
  const perDay=resource==="reservations"?4:resource==="waitlist"?1:resource==="sales"||resource==="orders"||resource==="payments"||resource==="receipts"?3:1;
  for(let d=start;d<=end;d++)for(let i=0;i<perDay;i++)rows.push(make(resource,loc,dateAt(d),i));
 }
 return rows;
}
function make(r,l,date,i){
 const seed=hash(`${SERVICE}|${r}|${l.id}|${date||"static"}|${i}`), amount=money(num(seed,1800,14500)/100);
 const x={id:`${r}-${l.id}-${date||"ref"}-${i+1}`,locationId:l.id,locationName:l.name,country:l.country,currency:l.currency};
 if(date)x.date=date;
 if(SERVICE==="lightspeed"){
  if(r==="products")return {...x,productId:`prd-${seed%500+1}`,sku:`SKU-${seed%99999}`,name:choose(products,seed),category:choose(["Food","Dessert","Beverages","Alcohol-free"],seed),unitPrice:amount,active:true,taxRate:choose([0,5,10,20],seed)};
  if(r==="categories")return {...x,categoryId:`cat-${i+1}`,name:choose(["Food","Dessert","Beverages"],seed),sortOrder:i+1};
  if(r==="employees")return {...x,employeeId:`emp-${l.id}-${i+1}`,name:choose(staff,seed),role:choose(["Manager","Server","Bartender","Chef","Cashier"],seed),status:"ACTIVE"};
  if(r==="registers")return {...x,registerId:`reg-${l.id}-${i+1}`,name:`Register ${i+1}`,status:"ACTIVE"};
  if(r==="tax-rates")return {...x,taxRateId:`tax-${l.id}-${i+1}`,name:`VAT ${choose([5,10,20],seed)}%`,rate:choose([0.05,0.1,0.2],seed)};
  const saleId=`sale-${l.id}-${date}-${i+1}`,orderId=`order-${l.id}-${date}-${i+1}`,employeeId=`emp-${l.id}-${seed%12+1}`;
  const qty=num(seed,1,5), unit=money(amount/qty), tax=money(amount*0.1);
  if(r==="sales"||r==="sales-report")return {...x,saleId,orderId,receiptNumber:`R-${seed%999999}`,employeeId,employeeName:choose(staff,seed),items:[{productId:`prd-${seed%500+1}`,name:choose(products,seed),quantity:qty,unitPrice:unit,lineTotal:amount}],subtotal:money(amount-tax),tax,total:amount,discount:money(seed%5===0?amount*.1:0),paymentStatus:"PAID",channel:choose(["DINE_IN","TAKEAWAY","DELIVERY"],seed)};
  if(r==="orders")return {...x,orderId,saleId,tableNumber:num(seed,1,42),orderType:choose(["DINE_IN","TAKEAWAY","DELIVERY"],seed),status:"CLOSED",openedAt:`${date}T${String(num(seed,10,21)).padStart(2,"0")}:15:00Z`,closedAt:`${date}T${String(num(seed,11,23)).padStart(2,"0")}:45:00Z`,covers:num(seed,1,6),subtotal:money(amount-tax),tax,total:amount,employeeId};
  if(r==="payments")return {...x,paymentId:`pay-${l.id}-${date}-${i+1}`,saleId,orderId,method:choose(methods,seed),status:choose(["SUCCESS","SUCCESS","REFUNDED"],seed),amount,tip:money(amount*.08),fee:money(amount*.015),processedAt:`${date}T18:30:00Z`};
  if(r==="receipts")return {...x,receiptId:`rcpt-${l.id}-${date}-${i+1}`,receiptNumber:`R-${seed%999999}`,saleId,orderId,total:amount,issuedAt:`${date}T18:30:00Z`,currency:l.currency};
 }
 // SevenRooms
 const guestId=`guest-${seed%8000+1}`, reservationId=`res-${l.id}-${date}-${i+1}`;
 if(r==="guests")return {...x,guestId,name:choose(guests,seed),email:`guest${seed%8000+1}@example.test`,phone:`+${num(seed,1,99)}${String(seed).slice(0,8)}`,visits:num(seed,1,18),lifetimeSpend:money(amount*num(seed,1,10)),vip:seed%11===0,marketingOptIn:seed%2===0};
 if(r==="tables")return {...x,tableId:`tbl-${l.id}-${i+1}`,tableNumber:String(i+1),seats:num(seed,2,8),section:choose(["Main Dining","Terrace","Bar","Private Dining"],seed),status:choose(["AVAILABLE","SEATED","HELD"],seed)};
 if(r==="shifts")return {...x,shiftId:`shift-${l.id}-${i+1}`,name:choose(["Lunch","Dinner","Late Dining"],seed),startTime:choose(["12:00","17:00","19:00"],seed),endTime:choose(["15:00","22:00","23:30"],seed),capacity:num(seed,30,120)};
 if(r==="floorplans")return {...x,floorplanId:`floor-${l.id}-${i+1}`,name:choose(["Main Floor","Terrace","Private Dining"],seed),active:true};
 if(r==="experiences")return {...x,experienceId:`exp-${l.id}-${i+1}`,name:choose(["Chef's Menu","Birthday Celebration","Wine Pairing","Private Dining"],seed),price:amount,currency:l.currency,active:true};
 if(r==="reservations")return {...x,reservationId,guestId,guestName:choose(guests,seed),guestEmail:`guest${seed%8000+1}@example.test`,reservationDate:date,time:`${String(num(seed,12,21)).padStart(2,"0")}:${choose(["00","15","30","45"],seed)}`,partySize:num(seed,1,8),tableId:`tbl-${l.id}-${seed%12+1}`,status:choose(["CONFIRMED","CONFIRMED","SEATED","COMPLETED","CANCELLED","NO_SHOW"],seed),channel:choose(channels,seed),occasion:choose(["","Birthday","Anniversary","Business"],seed),notes:seed%4===0?"Window table requested":null,spend:amount,shiftId:`shift-${l.id}-${seed%3+1}`};
 if(r==="waitlist")return {...x,waitlistId:`wait-${l.id}-${date}-${i+1}`,guestId,guestName:choose(guests,seed),partySize:num(seed,1,6),quotedWaitMinutes:num(seed,10,60),status:choose(["WAITING","SEATED","CANCELLED"],seed),addedAt:`${date}T18:00:00Z`,seatedAt:seed%2?`${date}T18:35:00Z`:null};
 if(r==="events")return {...x,eventId:`event-${l.id}-${date}-${i+1}`,name:choose(["Birthday dinner","Private event","Anniversary","Corporate dinner"],seed),eventDate:date,startTime:"19:00",guestCount:num(seed,8,45),status:choose(["CONFIRMED","LEAD","COMPLETED"],seed),estimatedRevenue:amount};
 if(r==="guest-notes")return {...x,noteId:`note-${l.id}-${date}-${i+1}`,guestId,guestName:choose(guests,seed),note:choose(["Prefers a quiet table","Allergy noted; confirm with guest","Celebrating a special occasion","Regular guest"],seed),createdAt:`${date}T10:00:00Z`,createdBy:"Restaurant team"};
 return {...x,description:r,amount};
}
const data={};
function getData(key){if(!data[key])data[key]=build(key);return data[key];}
function filter(rows,q){
 let out=rows;
 for(const f of ["locationId","employeeId","productId","guestId","reservationId","tableId","status","channel","departmentId"])if(q[f])out=out.filter(v=>String(v[f]??"").toLowerCase()===String(q[f]).toLowerCase()||v.id===q[f]);
 const from=q.startDate||q.from||q.dateFrom,to=q.endDate||q.to||q.dateTo;
 if(from||to)out=out.filter(v=>{const d=v.date||v.reservationDate||v.eventDate||v.openedAt?.slice(0,10)||v.addedAt?.slice(0,10);return !!d&&(!from||d>=from)&&(!to||d<=to)});
 return out;
}
function page(rows,q){const limit=Math.max(1,Math.min(1000,Number(q.limit)||100)),offset=Math.max(0,Number(q.offset)||0);return {data:rows.slice(offset,offset+limit),pagination:{total:rows.length,limit,offset,returned:Math.min(limit,Math.max(0,rows.length-offset))}};}
const appRoutes=ROUTES.map(r=>"/"+r.path);
app.get("/health",(req,res)=>res.json({status:"ok",service:SERVICE,locations:locations.length,generatedAt:new Date().toISOString()}));
app.get("/locations",(req,res)=>res.json(page(filter(locations,req.query),req.query)));
for(const route of ROUTES){
  app.get("/"+route.path,(req,res)=>res.json(page(filter(route.key==="locations"?locations:getData(route.key),req.query),req.query)));
}
app.use((req,res)=>res.status(404).json({error:"Not found",path:req.path,availableEndpoints:["/health","/locations",...appRoutes]}));
module.exports=app;
