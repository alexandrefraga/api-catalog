##Success cases
1. [x] **Receives** a GET request on the route */api/confirmation/:signature*
2. [x] **Validates** mandatory data: *signature*
3. [x] **Validate** if provided signature is valid token
4. [x] **Seach** the provided signature and update to used 
5. [x] **Update** field emailConfirmation in user account with confirmation date
6. [x] **Return 200** with message: "Confirmated user account!"
##Exceptions
1. [x] **Return** error **400** if no provided signature
2. [x] **Return** error **401** if invalid token is provided
3. [x] **Return** error **500** if validator throws
4. [x] **Return** error **500** if validate account throws