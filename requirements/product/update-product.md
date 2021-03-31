##Success cases
1. [ ] **Receives** a POST request on the route */api/updateProduct/:storeId*
2. [ ] **Validates** mandatory data: *storeId, description, trademark, reference*
3. [ ] **Validate** if there is no product with the new *trademark* and *reference* provided in this store
4. [ ] **Update the product** with the data entered
5. [ ] **Return 200** with product data
##Exceptions
1. [ ] **Return** error **400** if validation of mandatory data fails
2. [ ] **Return** error **403** if the new trademark and reference is already in use in this store
3. [ ] **Return** error **500** if the Validator or Update Product throws