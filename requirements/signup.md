##Casos de sucesso
1. [ ] **Recebe** uma requisição do tipo POST na rota */api/signup*
2. [ ] **Valida** dados obrigatórios *name, email*
3. [ ] **Valida** que o campo *email* é um e-mail válido
4. [ ] **Valida** se já existe um usuário com o *email* fornecido
5. [ ] **Gera uma senha temporária** e sua criptografia (essa *senha* não pode ser descriptografada)
6. [ ] **Cria uma conta** para o usuário com os dados informados, e a senha criptografada
7. [ ] **Envia e-mail** com a senha temporária de acesso
8. [ ] **Retorna 201** com a msg "Senha será enviada ao e-mail fornecido"
---
##Exceções
1. [ ] **Retorna** erro **404** se a API não existir
2. [ ] **Retorna** erro **400** se name e/ou email não forem fornecidos pelo cliente
3. [ ] **Retorna** erro **400** se o campo email for um e-mail inválido
4. [ ] **Retorna** erro **403** se o email fornecido já estiver em uso, ou pendente de liberação
5. [ ] **Retorna** erro **500** se der erro ao tentar gerar uma senha criptografada
6. [ ] **Retorna** erro **500** se der erro ao tentar criar a conta do usuário
7. [ ] **Retorna** erro **500** se der erro ao tentar enviar o token de acesso
9. [ ] **Retorna** erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerado
