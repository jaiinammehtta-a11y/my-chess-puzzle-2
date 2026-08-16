const { getStore } = require("@netlify/blobs");
const DEFAULT = {version:1,title:"My Chess Puzzle",fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",playerColor:"w",acceptedMoves:["e2e4","e7e5","g1f3"],targetFen:"",updatedAt:null};
exports.handler = async () => {
  try {
    const store = getStore("chess-puzzle");
    const p = await store.get("current",{type:"json"});
    return {statusCode:200,headers:{"Content-Type":"application/json","Cache-Control":"no-store"},body:JSON.stringify(p||DEFAULT)};
  } catch(e) { return {statusCode:500,body:JSON.stringify({error:"Could not load puzzle"})}; }
};
