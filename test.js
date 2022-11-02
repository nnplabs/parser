const ref = {"FunctionCall":{"args":"eyJyZWNlaXZlcl9pZCI6InYyLnJlZi1maW5hbmNlLm5lYXIiLCJhbW91bnQiOiI3NDgzMTEzMTgxNDQxOTYzMDAwMDAwMDAwIiwibXNnIjoie1wiYWN0aW9uc1wiOlt7XCJwb29sX2lkXCI6MTIwNyxcInRva2VuX2luXCI6XCJ3cmFwLm5lYXJcIixcInRva2VuX291dFwiOlwiYXVyb3JhXCIsXCJtaW5fYW1vdW50X291dFwiOlwiMTQ5MzMyOTk0MDM2OTYwMjdcIn1dfSJ9","deposit":"1","gas":300000000000000,"methodName":"ft_transfer_call"}}

const { args, methodName, gas, deposit } = ref.FunctionCall;

const pArgs = JSON.parse(Buffer.from(args, 'base64').toString('utf8'));
console.log(pArgs);

const pMsg = JSON.parse(pArgs.msg);
console.log(pMsg);

const {token_in, amount_in} = pMsg.actions[0];
const {token_out, amount_out} = pMsg.actions.at(-1);