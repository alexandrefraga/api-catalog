##Success cases
1. [ ] **Receives** a PUT request on the route */api/product/:id*
2. [ ] **Validates** mandatory fields: *description, trademark, reference, storeId, status*
3. [ ] **Validate** if a valid storeId is provided
4. [ ] **Validate** if there is no product with the new *trademark* and *reference* provided in this store
5. [ ] **Update the product** with the data entered
6. [ ] **Return 200** with product data
##Exceptions
1. [ ] **Return** error **400** if validation of mandatory fields fails
2. [ ] **Return** error **403** if an invalid param storeId is provided
3. [ ] **Return** error **403** if the new trademark and reference is already in use in this store
4. [ ] **Return** error **403** if an invalid storeId is provided
5. [ ] **Return** error **500** if the Validator or Update Product throws