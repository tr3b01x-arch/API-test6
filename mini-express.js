const http = require("node:http");
const { URL } = require("node:url");
function express(){
  const stack=[];
  const app=function(req,res,next){ return app.handle(req,res,next); };
  app._stack=stack;
  app.get=(path,handler)=>{stack.push({type:"route",method:"GET",path,handler});return app;};
  app.use=(path,middleware)=>{
    if(typeof path==="function" || (path && typeof path.handle==="function")){middleware=path;path="/";}
    stack.push({type:"middleware",path:path||"/",handler:middleware});return app;
  };
  app.handle=(req,res,outerNext)=>{
    let index=0;
    const next=(err)=>{
      if(err){if(!res.writableEnded){res.statusCode=500;res.json({error:"Internal server error"});}return;}
      if(res.writableEnded)return;
      const layer=stack[index++];
      if(!layer){if(outerNext)return outerNext(); if(!res.writableEnded){res.status(404).json({error:"Not found",path:req.path});}return;}
      if(layer.type==="route"){
        if(req.method!==layer.method || (req.path!==layer.path && req.path!==layer.path+"/"))return next();
        try{return layer.handler(req,res,next);}catch(e){return next(e);}
      }
      const prefix=layer.path;
      if(!(prefix==="/" || req.path===prefix || req.path.startsWith(prefix+"/")))return next();
      if(layer.handler && typeof layer.handler.handle==="function"){
        const oldUrl=req.url, oldPath=req.path;
        const suffix=req.path.slice(prefix==="/"?0:prefix.length)||"/";
        req.path=suffix; const search=req.url.includes("?")?req.url.slice(req.url.indexOf("?")):""; req.url=suffix+search;
        return layer.handler.handle(req,res,()=>{req.url=oldUrl;req.path=oldPath;next();});
      }
      try{return layer.handler(req,res,next);}catch(e){return next(e);}
    };
    next();
  };
  app.listen=(port,host,cb)=>{
    if(typeof host==="function"){cb=host;host=undefined;}
    const server=http.createServer((req,res)=>{
      const u=new URL(req.url,"http://localhost");req.path=u.pathname;req.query=Object.fromEntries(u.searchParams.entries());
      res.status=function(code){res.statusCode=code;return res;};
      res.json=function(value){if(!res.headersSent)res.setHeader("content-type","application/json; charset=utf-8");res.end(JSON.stringify(value));return res;};
      res.type=function(value){res.setHeader("content-type",value==="text"?"text/plain; charset=utf-8":value);return res;};
      res.send=function(value){res.end(value);return res;};
      if(req.method==="OPTIONS"){res.statusCode=204;return res.end();}
      app.handle(req,res);
    });
    return server.listen(port,host,cb);
  };
  return app;
}
express.json=()=>((_req,_res,next)=>next());
module.exports=express;
