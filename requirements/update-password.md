Caso de sucesso
1. [ ] **Recebe** uma requisição do tipo POST na rota /api/updatepassword
2. [ ] **Valida** o usuário pelo token
3. [ ] **Valida** dados obrigatórios newPassword e newPasswordConfirmation
4. [ ] **Atualiza** os dados do usuário com o newPassword
5. [ ] **Retorna 204** 
Exceções
1. [ ] **Retorna** erro **404** se a API não existir
2. [ ] **Retorna** erro **403** se usuário inválido.
3. [ ] **Retorna** erro **400** se newPassword ou newPasswordConfirmation não forem fornecidos pelo client
4. [ ] **Retorna** erro **401** se não encontrar um usuário com os dados fornecidos
5. [ ] **Retorna** erro **500** se der erro ao atualizar o password do usuário

