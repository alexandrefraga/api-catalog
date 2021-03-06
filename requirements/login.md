Caso de sucesso
1. [x] **Receives** a POST request on the route */api/login*
2. [x] **Validates** mandatory data: *email* and *password*
3. [x] **Validate** if email field is valid e-mail
4. [x] **Search** the user with provided email
5. [x] **Verify** password
6. [x] **Generates** a *access token*  from user ID
7. [x] **Update** user data with the access token
8. [x] **Return 200** with access token and user name
Exceções
1. [x] **Return** error **400** if no provided email or password
2. [x] **Return** error **400** if email field contain a invalid e-mail
3. [x] **Return** error **401** if no finding a user with the data provided
4. [x] **Return** error **500** if token generator throw an error
5. [x] **Return** error **500** if update user with token throw an error 