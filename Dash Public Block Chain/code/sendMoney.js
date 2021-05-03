let dashcore = require('@dashevo/dashcore-lib');
const got = require('got');
const https = require('https')
var sender = 'yTYZjnTuepHbVAcoWq4g7f5teXru4KSJMa'
var receiver = 'yNpEzKCvS2Vn3WYhXeG11it5wEWMButDvq'
var senderPrivatekey = 'Private key here'
let token = 'Token here'//Use the authentication obtained on registering with chain rider.
let url = `https://api.chainrider.io/v1/dash/testnet/addr/${sender}/utxo?token=${token}`
///url1=https://api.chainrider.io/v1/dash/testnet/addr/yTYZjnTuepHbVAcoWq4g7f5teXru4KSJMa/utxo?token=8PGdgeEbzxm7SvMWdM4MBIJU5lvnL2w7
//url2=https://api.chainrider.io/v1/dash/testnet/addr/yNpEzKCvS2Vn3WYhXeG11it5wEWMButDvq/utxo?token=8PGdgeEbzxm7SvMWdM4MBIJU5lvnL2w7
let send_amount = 2000
//  GRADED FUNCTION
//  TASK-1: Write a function that sends {send_amount} of dash from {sender} to {receiver}.
//  Register on ChainRider to get a ChainRider token (instructions provided) and input its value as {token}
//  Create a transaction using the {dashcore} library, and send the transaction using ChainRider
//  Send Raw Transaction API - https://www.chainrider.io/docs/dash/#send-raw-transaction
//  The resulting transaction ID is needed to be supplied through the Assignment on Coursera

/*
Verify which of the following addresses has money use that address as sender and the other address as receiver
{
  pk: 'adb27adb845cf776e49ba7f09e58cf53182fcdfd5c3c1ac919340117b41e1a7b',
  address: 'yTYZjnTuepHbVAcoWq4g7f5teXru4KSJMa'
}

{
  pk: 'ce479af60e74653d9b8f0f09ec00dbd5ec0b60b8e4d0463d392e0dac60cf77f3',
  address: 'yNpEzKCvS2Vn3WYhXeG11it5wEWMButDvq'
}*/


TxID=null
console.log(url)
const req=https.get(url, (resp) => {
  
   // process.stdout.write(resp)
    //console.log('My %s has %d years', 'cat', 2)
    var resp = '{"address":"yTYZjnTuepHbVAcoWq4g7f5teXru4KSJMa","txid":"e9bcfe43ff97f8a8919d57f44371a19c568ac47c604145815d0ebc5ebe003f5a","vout":0,"scriptPubKey":"76a9144f4409f6a42a8f3ff565e4d1df47e8e8b1d509cb88ac","amount":0.00019,"satoshis":19000,"confirmations":0,"ts":1619133809}'

    var responseObject = JSON.parse(resp);
    console.log(typeof responseObject)
    console.log('resp in JSON', responseObject)
    // This is the total available Amount and this should be greater than or equal to the amount that is being sent.
    var available_amt = responseObject.satoshis;
    console.log('Total Available Amount', available_amt)
    console.log('Total Send Amount', send_amount)

    if(available_amt>=send_amount){
      var utxo_object ={
        "txid": responseObject.txid,
        "outputIndex": responseObject.vout,
        "address": responseObject.address,
        "script": responseObject.scriptPubKey,
        "amount": responseObject.amount,
        "satoshis" :responseObject.satoshis,
        "confirmations": responseObject.confirmations
      }

    var trans=new dashcore.Transaction()
    .from(utxo_object)
    .to(receiver, send_amount) // Add an output with the given amount of satoshis
    .change(sender) 
    .sign(senderPrivatekey);
    var rtx='{"rawtx":"'+String(trans)+'","token":"'+token+'"}';
    console.log(rtx)

    var options = {
      hostname: "api.chainrider.io",
      port:443,
      path: "/v1/dash/testnet/tx/send",
      method: 'POST',
      headers: {'Content-Type':'application/json', 'Accept':'application/json'},
    };
    const req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)
    
      res.on('data', d => {
        process.stdout.write(d)
      
        var responseObject1 = JSON.parse(d);
        console.log('resp in JSON', responseObject1)
        
        dashTx=responseObject1.txid                        
      })
    })

    req.write(rtx)
    req.on('error', error => {
          console.error(error)
    })

    req.end()
    }
});
