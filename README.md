# Atmos

Aplicação climática premium construída em HTML, CSS e JavaScript Vanilla, com arquitetura modular, UI refinada e experiência de produto real para portfólio front-end.

## Visão do projeto

- HTML semântico e acessível
- Design system com tokens de interface
- Estado de aplicação bem definido
- Fluxo robusto de loading, erro e sucesso
- Persistência local de preferências e dados do usuário
- Interface dinâmica por contexto climático (dia/noite, chuva, neve, etc.)

## Funcionalidades

- Clima atual com:
  - cidade, região/país e data/hora local
  - temperatura, descrição e ícone
  - sensação térmica, umidade, vento, pressão, visibilidade e UV
- Busca por cidade via botão ou tecla Enter
- Geolocalização com fallback elegante para cidade padrão
- Alternância de unidade (`°C/°F`) baseada em estado real
- Histórico de pesquisas persistente (sem duplicatas e com limite)
- Favoritos persistentes com remoção rápida
- Previsão por hora (próximas horas em lista horizontal)
- Previsão diária (próximos dias)
- Tema visual dinâmico conforme condição climática
- Loading com skeletons
- Estado de erro com botão de tentar novamente

## Stack

- HTML5
- CSS3 (sem frameworks)
- JavaScript ES Modules (Vanilla)
- WeatherAPI (dados em tempo real)
- `localStorage` para persistência

## Estrutura de pastas

```bash
weather-app/
├── index.html
├── assets/
│   ├── images/
│   ├── icons/
│   └── backgrounds/
│       └── hero.jpg
├── styles/
│   ├── reset.css
│   ├── variables.css
│   ├── main.css
│   ├── components.css
│   └── responsive.css
├── scripts/
│   ├── app.js
│   ├── api.js
│   ├── storage.js
│   ├── ui.js
│   ├── utils.js
│   └── weather.js
└── README.md
```

## Configuração da API

Por ser um projeto front-end puro, a chave é configurada diretamente pela interface.

1. Gere sua chave em [WeatherAPI](https://www.weatherapi.com/).
2. No app, clique em **Configurar API**.
3. Cole a chave e salve.

Se a chave não estiver configurada, o app mostra feedback visual e abre o painel automaticamente.  
A chave fica salva no `localStorage` do navegador atual.

## Como rodar localmente

1. Sirva o projeto com um servidor local (necessário para ES Modules):

```bash
# opção 1
python3 -m http.server 5500

# opção 2
npx serve .
```

2. Acesse no navegador: `http://localhost:5500`.
3. Configure a chave em **Configurar API**.

## Arquitetura JavaScript

- `api.js`: comunicação com WeatherAPI, timeout e normalização dos dados
- `storage.js`: histórico, favoritos e unidade de medida no `localStorage`
- `ui.js`: renderização de componentes, estados e tema dinâmico
- `weather.js`: orquestração de fluxo, cache e geolocalização
- `utils.js`: formatações e helpers
- `app.js`: bootstrap e binding de eventos

## Diferenciais UX/UI

- Visual premium com glassmorphism moderado
- Tipografia com hierarquia forte e legibilidade alta
- Microinterações em botões e transições de tema
- Layout verdadeiramente responsivo (desktop, tablet e mobile)
- Foco visível para navegação por teclado

## Evoluções futuras

- Qualidade do ar (AQI)
- Alertas meteorológicos
- Mapa interativo por coordenadas
- Internacionalização completa (i18n)
- PWA com suporte offline e instalação

## Créditos

- Design e Engenharia front-end: Andrei Costa
- Dados climáticos: WeatherAPI
