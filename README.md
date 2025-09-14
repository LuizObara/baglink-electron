## Baglink Desktop (Electron + Next.js)

Este é um projeto de aplicativo de desktop construído com Electron e Next.js. O objetivo é criar uma experiência de desktop rica utilizando tecnologias web modernas.

A interface do usuário (UI) é renderizada pelo Next.js, enquanto o Electron cuida da janela, interações com o sistema operacional e funcionalidades de backend nativas.

## Tecnologias Utilizadas
- **Electron:** Framework para criar aplicativos de desktop com JavaScript, HTML e CSS.
- **Next.js:** Framework React para renderização da interface.
- **TypeScript:** Superset de JavaScript que adiciona tipagem estática.
- **Tailwind CSS:** Framework de CSS para estilização rápida.
- **Electron-Builder:** Ferramenta para empacotar e distribuir o aplicativo.

## Começando
Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/LuizObara/baglink-electron.git
```

2. Navegue até a pasta do projeto:

```bash
cd baglink-electron
```
3. Instale as dependências:

```bash
npm install
```
## Rodando em Modo Desenvolvimento
Para iniciar o ambiente de desenvolvimento, execute o seguinte comando:

```bash
npm run dev
```
Este comando executa duas tarefas simultaneamente:

- Inicia o servidor de desenvolvimento do Next.js em http://localhost:3000.

- Abre a janela do Electron, que carregará a aplicação Next.js.

## Compilando para Produção
Para gerar os arquivos de instalação do seu aplicativo (ex: .exe, .dmg, .AppImage), execute o comando:

```bash
npm run build
```