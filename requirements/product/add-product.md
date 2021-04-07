##Success cases
1. [x] **Receives** a POST request on the route */api/addProduct/:storeId*
2. [x] **Validates** mandatory fields: *storeId, description, trademark, reference*
3. [x] **Validate** if there is no product with the *trademark* and *reference* provided in this store
4. [x] **Create new product** with the data entered
5. [x] **Return 200** with product data
##Exceptions
1. [x] **Return** error **400** if validation of mandatory fields fails
2. [x] **Return** error **403** if an invalid param storeId is provided
3. [x] **Return** error **403** if the trademark and reference is already in use in this store
4. [x] **Return** error **500** if the Validator or Add Product throws