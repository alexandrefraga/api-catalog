##Success cases
1. [x] **Receives** a POST request on the route */api/addStore*
2. [x] **Validates** mandatory fields: *company, tradingName, description, address, email, phoneNumber and geoLocalization*
3. [x] **Validate** if email field is valid e-mail
4. [x] **Validate** if there is no store with the *company, tradingName, address* provided
5. [x] **Validate** if the phone numbers are valid
6. [ ] **Validate** if the geoLocalization is valid
7. [ ] **Validate** if the address is valid
8. [x] **Create new store** with the data entered
9. [x] **Update user account** with store admin key
10. [x] **Return 200** with store data
##Exceptions
1. [x] **Return** error **400** if validation of mandatory data fails
2. [x] **Return** error **400** if an email invalid is provided
3. [x] **Return** error **400** if a phone number invalid is provided
4. [ ] **Return** error **400** if a geoLocalization invalid is provided
5. [ ] **Return** error **400** if a address invalid is provided
6. [x] **Return** error **403** if the company, trading name and address is already in use
7. [x] **Return** error **500** if the update user account fail
8. [x] **Return** error **500** if the Validator or AddStore throws