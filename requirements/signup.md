##Success cases
1. [x] **Receives** a POST request on the route */api/signup*
2. [x] **Validates** mandatory data: *name, email, password e passwordConfirmation*
3. [x] **Validate** if email field is valid e-mail
4. [x] **Validate** if there is no user with the *email* provided
5. [x] **Validate** that password and confirmation password are the same
6. [x] **Create new account** for the user with the data entered, and the encrypted password
7. [x] **Send e-mail** with token to confirmation
8. [x] **Return 201** with message: "Sent confirmation email!"
##Exceptions
1. [x] **Return** error **400** if name, email, password or passwordConfirmation no are provided
2. [x] **Return** error **400** if an email invalid is provided
3. [x] **Return** error **403** if the email is already in use

