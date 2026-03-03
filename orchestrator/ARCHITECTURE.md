# FluxFact AI Team — Architecture

## Принцип: Все сотрудники = AI-агенты на Claude SDK
Каждый агент — это Claude с уникальным system prompt + набором MCP-инструментов.
Оркестратор координирует работу всех агентов.

## Стек
- **Runtime:** Claude Code SDK (@anthropic-ai/claude-code)
- **Orchestrator:** TypeScript, запуск локально (I:\fluxfact\orchestrator\)
- **MCP Tools:** каждый агент получает свой набор инструментов
- **Data:** JSON файлы в data/ (тренды, планы, метрики)
- **Output:** Astro static site → Cloudflare Pages

---

## AI-КОМАНДА (7 агентов)

### 1. 🔍 Trend Scout (Разведчик)
**Роль:** Находит растущие тренды ДО конкуренции
**Расписание:** Каждые 4 часа
**MCP Tools:**
- fetch (web) — GitHub API, HN API, Reddit JSON
- filesystem — сохранение результатов в data/
**Источники:** GitHub Trending, HN, Reddit, Google Trends
**Output:** data/trends-YYYY-MM-DD.json → передаётся Content Architect

### 2. 📐 Content Architect (Архитектор контента)
**Роль:** Тренд → план контента (тип, формат, кластер страниц)
**MCP Tools:**
- fetch — проверка конкуренции (Google SERP)
- filesystem — чтение трендов, запись планов
**Input:** ScoredTrend от Trend Scout
**Output:** ContentPlan (тип: tool/lifehack/news, slug, keywords, SEO-стратегия)

### 3. 👨‍💻 Developer (Разработчик)
**Роль:** Генерирует React TSX компоненты для интерактивных инструментов
**MCP Tools:**
- filesystem — запись .tsx файлов в src/components/tools/
- bash — запуск `npx astro build` для проверки
- git — коммит кода
**Input:** PagePlan от Content Architect
**Output:** Рабочий React компонент с анимациями, share-карточкой

### 4. ✍️ Writer (Копирайтер)
**Роль:** SEO-статьи, FAQ, "А ты знал?" хуки на 7 языках
**MCP Tools:**
- filesystem — запись .mdx файлов в src/content/tools/
- fetch — fact-checking, цитаты, данные
**Input:** PagePlan + ComponentName
**Output:** MDX файл с frontmatter + статья + FAQ (на 7 языках)
**Правила:** Локализация, не перевод. Местные примеры.

### 5. 🎨 Designer (Дизайнер)
**Роль:** OG-картинки, инфографики, визуалы
**MCP Tools:**
- fetch — Kie AI API (Nano Banana 2 для генерации изображений)
- filesystem — сохранение в public/og/, public/images/
- sharp (через bash) — ресайз, оптимизация
**Input:** Тема + категория + стиль
**Output:** OG Image (1200x630), hero illustration

### 6. 📢 SMM / Social Manager (СММщик)
**Роль:** Авто-постинг, отслеживание реакций, что заходит
**MCP Tools:**
- fetch — Twitter/X API, Telegram Bot API
- n8n-mcp — триггер автопостинга workflows
- filesystem — логирование метрик постов
**Задачи:**
- Генерация share-текстов и OG-карточек
- Постинг в Telegram канал, X/Twitter
- Сбор метрик (лайки, репосты, клики)
- Анализ: какой контент "заходит" → feedback Trend Scout

### 7. 📊 Analyst (Аналитик / Маркетолог)
**Роль:** Отслеживание трафика, метрик, self-learning
**MCP Tools:**
- fetch — Google Analytics API / Plausible API
- filesystem — отчёты, метрики
- n8n-mcp — автоматизации отчётов
**Задачи:**
- Какие страницы дают трафик?
- Какие темы конвертят в share?
- Feedback loop: больше подобного контента
- Отслеживание позиций в поиске
- Мониторинг конкурентов

---

## ОРКЕСТРАТОР (координатор)

```
Цикл работы:

1. Trend Scout → находит тренды (каждые 4ч)
2. Content Architect → план контента
3. Параллельно:
   - Developer → React компонент (если tool/lifehack)
   - Writer → MDX статья на 7 языках
   - Designer → OG Image + визуалы
4. Publisher → собирает всё, build, git push
5. SMM → постинг в соцсети
6. Analyst → сбор метрик → feedback в Trend Scout

Петля самообучения:
  Analyst видит что "заходит" → корректирует скоринг Trend Scout
  SMM видит какие посты репостят → корректирует формат Writer/Designer
```

## MCP конфигурация (единый .mcp.json)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-filesystem", "I:/fluxfact"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-fetch"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-git", "--repository", "I:/fluxfact"]
    },
    "n8n-mcp": {
      "command": "n8n-mcp.cmd"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-context7"]
    }
  }
}
```

## Бюджет (на день)
- Claude API (все агенты): ~$2-5
- Kie AI (картинки): ~$1-3
- Итого: $3-8/день → 5-15 страниц контента
- ROI: $5 потратили → сотни страниц в месяц → тысячи посетителей → реклама

## Файловая структура оркестратора
```
orchestrator/
├── ARCHITECTURE.md      # Этот файл
├── config.ts            # Общая конфигурация
├── pipeline.ts          # Типы и промпты агентов
├── trend-scout.ts       # Entry point: Trend Scout
├── content-architect.ts # Content Architect agent
├── orchestrator.ts      # Главный координатор
├── sources/
│   ├── github.ts        # GitHub Trending API
│   ├── hackernews.ts    # Hacker News API
│   ├── reddit.ts        # Reddit JSON API
│   └── google-trends.ts # Google Trends (TODO)
├── agents/
│   ├── developer.ts     # Developer agent (Claude SDK)
│   ├── writer.ts        # Writer agent (Claude SDK)
│   ├── designer.ts      # Designer agent (Claude SDK)
│   ├── smm.ts           # SMM agent (Claude SDK)
│   └── analyst.ts       # Analyst agent (Claude SDK)
└── lib/
    ├── types.ts         # Shared types
    ├── scorer.ts        # Trend scoring engine
    └── claude-sdk.ts    # Claude SDK wrapper
```
