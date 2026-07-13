# STLShypper — Precificação de Impressão 3D

Sistema completo (backend + frontend no **mesmo projeto**, no mesmo padrão do
seu projeto `financialite`) para precificar peças de impressão 3D, com todos
os cálculos da planilha `Precificacao_Impressao_3D_Neptune.xlsx` reproduzidos
em código: material, energia, depreciação/manutenção de máquina, mão de obra,
custos fixos, taxa de falhas, impostos, taxas de venda e margem (markup
divisor).

## Stack

- **Laravel 13** (PHP) — backend, models, banco de dados, autenticação de sessão
- **Inertia.js** — ponte entre Laravel e React (sem API REST separada; as
  páginas são renderizadas pelo controller e recebidas como componentes React)
- **React 18 + Tailwind CSS v4** — frontend, no mesmo repositório
  (`resources/js`), compilado pelo Vite
- **Axios** — usado para a chamada de cálculo em tempo real na Calculadora
  (`/calculadora/calcular`), sem recarregar a página
- **SQLite** — banco de dados padrão (arquivo único, sem servidor externo)

Diferente da versão anterior (pastas `backend/` e `frontend/` separadas com
API + tokens Sanctum), aqui é **um projeto Laravel só**: mesmo `composer.json`
e `package.json` na raiz, autenticação por sessão (cookie), sem necessidade de
CORS ou tokens — exatamente como no `financialite`.

## Como rodar

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed
composer run dev
```

O comando `composer run dev` sobe, ao mesmo tempo: o servidor PHP
(`php artisan serve`), a fila (`queue:listen`), o log (`pail`) e o Vite em
modo desenvolvimento — tudo com um único comando, no mesmo terminal.

Acesse **http://localhost:8000**.

### Login de demonstração

- E-mail: `demo@stlshypper.test`
- Senha: `password`

Esse usuário já vem com os Parâmetros Gerais, 6 impressoras (incluindo a
**Elegoo Neptune 4**), 12 materiais e 3 produtos de exemplo, iguais aos da
planilha original.

Você também pode clicar em "Já tem uma conta? / Criar conta" para registrar
seu próprio usuário — toda conta nova recebe automaticamente os Parâmetros
Gerais padrão da planilha (kWh, mão de obra, % de perdas, impostos, taxas,
margem), prontos para editar em "Parâmetros".

## Páginas

| Rota | O que faz | Equivalente na planilha |
|---|---|---|
| `/dashboard` | Resumo: totais de receita/custo/lucro estimados, produtos mais lucrativos | Aba "Resumo" |
| `/parametros` | kWh, mão de obra, % perdas, % material extra, impostos, taxas, margem, horas/ano | Aba "Parâmetros Gerais" |
| `/impressoras` | Cadastro de impressoras (preço, vida útil, potência, manutenção anual) | Aba "Impressoras" |
| `/materiais` | Cadastro de filamentos/resinas e preço por kg | Aba "Materiais" |
| `/calculadora` | Simula o custo/preço de uma peça avulsa (cálculo via axios, em tempo real) | Aba "Calculadora (1 Peça)" |
| `/produtos` | Cadastro de vários produtos, com custo e preço sugerido calculados automaticamente | Aba "Tabela de Produtos" |

## Lógica de cálculo (`app/Services/PricingCalculator.php`)

1. **Material**: peso total (peça + % de material extra/purga) × preço por grama
2. **Energia**: potência da impressora (W) × tempo de impressão (h) × valor do kWh ÷ 1000
3. **Máquina**: (preço de compra ÷ vida útil em horas) + (manutenção anual ÷ horas de uso/ano), rateado pelo tempo de impressão
4. **Subtotal**: material + energia + máquina + mão de obra + custos fixos extras
5. **Custo com perdas**: subtotal ÷ (1 − % de perdas/falhas)
6. **Preço sugerido** (markup divisor): custo com perdas ÷ (1 − impostos% − taxas% − margem%)

Todo produto pode sobrescrever individualmente % de material extra, perdas,
impostos, taxas e margem; se deixado em branco, usa os Parâmetros Gerais do
usuário.

## Estrutura relevante

```
app/Models/          Setting, Printer, Material, Product, User
app/Services/        PricingCalculator.php (motor de cálculo)
app/Http/Controllers/ Dashboard, Settings, Printer, Material, Product, Calculator
                      + Auth/* e ProfileController (login/registro/perfil, do Breeze)
resources/js/Pages/   Dashboard, Settings, Printers, Materials, Products, Calculator
                      + Auth/Login, Auth/Register (React + Inertia)
database/seeders/     Usuário demo com dados de exemplo (Neptune 4 incluída)
```

## Limitações conhecidas

- Este projeto foi montado em um ambiente sem acesso ao Packagist nem PHP 8.3,
  então o `vendor/` **não está incluído** — rode `composer install` no seu
  computador (com PHP 8.3+ e Composer instalados) para gerá-lo.
- Todos os arquivos PHP (54 arquivos) foram verificados com `php -l` (sem
  erros de sintaxe) e o build do frontend (`npm run build`) foi executado
  com sucesso, mas o backend em si não pôde ser executado de ponta a ponta
  neste ambiente — teste o fluxo de login/cadastro/CRUD no seu ambiente local
  antes de usar em produção.
- Não há testes automatizados específicos para as regras de precificação
  (apenas os testes padrão do Breeze/Laravel).
- E-mail de verificação de conta não é exigido para usar o sistema (rotas de
  verificação existem, mas não são obrigatórias) — assim o login funciona sem
  precisar configurar um servidor de e-mail.
