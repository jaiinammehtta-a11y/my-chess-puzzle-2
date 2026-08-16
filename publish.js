const { getStore } = require("@netlify/blobs");
exports.handler = async event => {
  if(event.httpMethod!=="POST") return {statusCode:405,body:JSON.stringify({error:"POST required"})};
  const key=process.env.ADMIN_KEY;
  const supplied=event.headers["x-admin-key"]||event.headers["X-Admin-Key"];
  if(!key || supplied!==key) return {statusCode:401,body:JSON.stringify({error:"Unauthorized"})};
  let b; try{b=JSON.parse(event.body||"{}")}catch(e){return {statusCode:400,body:JSON.stringify({error:"Invalid JSON"})}};
  const u=/^[a-h][1-8][a-h][1-8][qrbn]?$/;
  if(typeof b.title!=="string"||typeof b.fen!=="string"||(b.playerColor!=="w"&&b.playerColor!=="b")||!Array.isArray(b.acceptedMoves)||!b.acceptedMoves.length||!b.acceptedMoves.every(x=>typeof x==="string"&&u.test(x)))
    return {statusCode:400,body:JSON.stringify({error:"Invalid puzzle data"})};
  const store=getStore("chess-puzzle"), old=await store.get("current",{type:"json"});
  const p={version:(old?.version||0)+1,title:b.title.trim()||"Chess Puzzle",fen:b.fen.trim(),playerColor:b.playerColor,acceptedMoves:b.acceptedMoves.map(x=>x.trim()),targetFen:(b.targetFen||"").trim(),updatedAt:new Date().toISOString()};
  await store.setJSON("current",p);
  return {statusCode:200,headers:{"Content-Type":"application/json"},body:JSON.stringify(p)};
};
