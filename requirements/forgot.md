Caso de sucesso
1. [ ] **Recebe** uma requisição do tipo POST na rota /api/forgot
2. [ ] **Valida** dado obrigatório email
3. [ ] **Valida** que o campo email é um email válido
4. [ ] **Busca** o usuário com o email fornecido
5. [ ] **Gera uma senha temporária** e sua criptografia (essa *senha* não pode ser descriptografada)
6. [ ] **Atualiza a conta** do usuário com a senha temporária criptografada
7. [ ] **Envia e-mail** com a senha temporária de acesso
8. [ ] **Retorna 201** com a msg "Senha será enviada ao e-mail fornecido"
Exceções
1. [ ] **Retorna** erro **404** se a API não existir
2. [ ] **Retorna** erro **400** se o email não for fornecido pelo client
3. [ ] **Retorna** erro **400** se o campo email for um e-mail inválido
4. [ ] **Retorna** erro **401** se não encontrar um usuário com o email fornecido
5. [ ] **Retorna** erro **500** se der erro ao tentar gerar uma senha criptografada
6. [ ] **Retorna** erro **500** se der erro ao tentar atualizar a conta do usuário
7. [ ] **Retorna** erro **500** se der erro ao tentar enviar o email
