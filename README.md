# SoapProject

Converts REST to SOAP request.

### Setup:
 * Clone this project
 * Run npm install
 * Run a127 project startup from the root of the project


The project currently takes input from path parameters.  In the case of entering data, the response provides the id of the record created.  Id's are created by using a UUID npm package.  In the case of a lookup, you enter the id you are looking for and the record is returned as formatted JSON.

### Usage:
To enter a record in the crm system, you would call the addCustomer API as follows:
http://localhost:10010/addCustomer/{first_name}/{last_name}
The id will be automatically generated for you.  If there are any spaces in either the first or last name, it will need to be url encoded.

To lookup a record in the CRM system, you would call the getCustomer API as follows:
http://localhost:10010/getCustomer/{id}.  It helps to leave a few of the records you created with addCustomer on the screen so that you can cut/paste them for the getCustomer API call.

### Implementation:
There are multiple ways that this can be done.  My technique is to use SOAPUI to examine the WSDL and create a sample XML request.  I then use an XML generator to create all requests and substitute in the variables.  The request npm module is used to make the actual SOAP request.  The requests from the end user are all GETS for convenience and the controllers transform it to a POST request.  The getCustomer response is in XML with a lot of information that is not needed, so I use a simple xml parser to extract the key bits of information and a JSON formatter to return a well formatted JSON response.

The xml generator took a shourt time to get used to, but the code for the two APIs shows most of what you'll need to know.  Alternatively, you can use the whole sample xml and break it up to insert the variables.  I believe that approach will ultimately be more brittle but it can still work.

### Extensions
Depending on what is requested, there are a number of features to be added such as a POST request that sends the data in JSON.  Much of the code would stay the same and I would simply make the variables part of the body.  There are also more fields, such as address data.  Since the technique would be the same except for more data, I chose not to focus on that initially.  I'm open to suggestions of what people would like to see.

Since this was originally intended to show REST<->SOAP interaction, there are no volos extensions used such as cache, quota, and OAuth.  If that would be of interest, they can all be worked in.
