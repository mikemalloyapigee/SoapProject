'use strict';

var util = require('util');
var uuid = require('node-uuid');
var builder = require('xmlbuilder');
var request = require('request');
var xmldoc = require('xmldoc');
var format = require('json-nice');
var SimpleXmlParser = require('simple-xml-parser');


module.exports = {
  addCustomer : addCustomer,
  getCustomer : getCustomer
};

function addCustomer(req, res){
  var fname = req.swagger.params.fname.value;
  var lname = req.swagger.params.lname.value;
  var id = getUUID();
  var soapXML = createCustomerXML(fname, lname, id);
  console.log(soapXML);
  var retVal = sendRequest(soapXML, function(retVal){
    console.log(retVal);
    if(retVal.code === 200){res.send("Created Cuaromer: " + id + "\n");} else{res.send("Problem creating customer\n" + retVal.body);}
  });
}

function getUUID(){
  var id = uuid.v1();
  return id;
}

function createCustomerXML(fname, lname, id) {
  var doc = builder.create('soapenv:Envelope')
    .att('xmlns:soapenv', 'http://schemas.xmlsoap.org/soap/envelope/')
    .att('xmlns:ns', 'http://predic8.com/wsdl/crm/CRMService/1/')
    .ele('soapenv:Header')
    .up()
    .ele('soapenv:Body')
      .ele('ns:create')
        .ele("customer")
        .ele('person')
          .ele('firstName')
            .txt(fname)
          .up()
          .ele('lastName')
            .txt(lname)
          .up()
        .up()
        .ele('id')
          .txt(id)
    .end({ pretty: true});
  return doc;
}

function sendRequest(soapXML, cb){
  var requestOptions = {
    url : "http://www.predic8.com:8080/crm/CustomerService",
    body : soapXML,
    'Content-Type' : "text/xml"
  }
  var response;
  request.post(requestOptions, function(e,r,b){
    response = {code : r.statusCode, body: b};
    cb(response);
  });
  
}

function getCustomer(req, res){
  var id = req.swagger.params.id.value;
  var soapXML = createGetXML(id);
  console.log(soapXML);
  var retVal = sendRequest(soapXML, function(retVal){ 
    if(retVal.code === 200){
      var parsedxml = extractXML(retVal.body);
      res.send(format(parsedxml) + "\n");} 
    else{res.send("Problem getting customer " + id +"\n" + retVal.body);}
  });
}

function extractXML(xml){
  var parser = SimpleXmlParser.create(['firstName', 'lastName', 'id']); 
    var response = {};
    parser.on('done', function(result, raw) {
        response.fname = result.firstName;
        response.lname = result.lastName;
        response.id = result.id;
    });
    parser.parseData(xml);
    return(response);
}

function createGetXML(id){
  var doc = builder.create('soapenv:Envelope')
    .att('xmlns:soapenv', 'http://schemas.xmlsoap.org/soap/envelope/')
    .att('xmlns:ns', 'http://predic8.com/wsdl/crm/CRMService/1/')
    .ele('soapenv:Header')
    .up()
    .ele('soapenv:Body')
      .ele('ns:get')
        .ele('id')
          .txt(id)
    .end({ pretty: true});
  return doc;
}

