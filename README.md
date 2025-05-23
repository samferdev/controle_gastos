# Controle de Gastos

Um aplicativo web moderno para gerenciamento financeiro pessoal, desenvolvido com TypeScript e Vite.

## 📋 Funcionalidades

### Gerenciamento de Transações
- Adicionar receitas e despesas
- Visualizar saldo atual
- Editar saldo inicial
- Histórico completo de transações
- Remover transações

### Planejamento Financeiro
- Criar metas financeiras
- Acompanhar gastos previstos
- Visualizar histórico de transações
- Planejamento de despesas futuras

### Interface Moderna
- Design responsivo
- Navegação intuitiva
- Tema escuro para melhor visualização
- Menu lateral retrátil

## 🚀 Tecnologias Utilizadas

- TypeScript
- Vite
- HTML5
- CSS3
- LocalStorage para persistência de dados

## 📦 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd controle_gastos
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

## 🔧 Configuração

O projeto utiliza Vite como bundler e servidor de desenvolvimento. As principais configurações estão em:

- `vite.config.js`: Configurações do bundler
- `tsconfig.json`: Configurações do TypeScript

## 📁 Estrutura do Projeto

```
controle_gastos/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── services/          # Serviços (auth, etc)
│   ├── modules/           # Módulos específicos
│   └── navigation.ts      # Lógica de navegação
├── components/
│   ├── assets/           # Recursos estáticos
│   └── pagina-inicial/   # Componentes da página inicial
├── public/               # Arquivos públicos
└── dist/                # Build do projeto
```

## 🔐 Autenticação

O sistema possui autenticação básica com:
- Login de usuário
- Persistência de sessão
- Proteção de rotas
- Logout

## 💾 Armazenamento

Os dados são armazenados localmente usando LocalStorage:
- Transações
- Saldo atual
- Informações do usuário
- Configurações

## 📱 Responsividade

O aplicativo é totalmente responsivo:
- Desktop: Layout completo com sidebar
- Tablet: Layout adaptativo
- Mobile: Menu inferior e layout otimizado

## 🛠️ Desenvolvimento

Para contribuir com o projeto:

1. Crie um fork
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Crie um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## ✨ Funcionalidades Futuras

- [ ] Exportação de relatórios
- [ ] Gráficos de gastos
- [ ] Categorização de despesas
- [ ] Metas financeiras
- [ ] Notificações
- [ ] Backup na nuvem

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas features
- Melhorar documentação
- Enviar pull requests

## 📞 Suporte

Em caso de dúvidas ou problemas, abra uma issue no repositório ou entre em contato com samuelferreiraj6@gmail.com / 11910118664
