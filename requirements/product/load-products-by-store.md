##Success cases
1. [x] **Receives** a GET request on the route */api/products/:storeId*
2. [x] **Validate** mandatory field: *storeId*
3. [x] **Validate** if a valid storeId is provided
4. [x] **Return 200** with products data by store
##Exceptions
1. [x] **Return** error **400** if validation of mandatory field fail
2. [x] **Return** error **403** if an invalid param storeId is provided
3. [x] **Return** error **500** if the Validator or Load Products throws