---
title: "Промпты для создания страниц цен: 12 готовых шаблонов для ИИ"
pubDate: 2026-08-28
description: "Готовые промпты для проектирования тарифов, работы с возражениями и оптимизации страниц цен с помощью ИИ."
tags: ["Инструменты", "Маркетинг"]
draft: false
---

Средняя конверсия страниц с тарифами в SaaS-сервисах составляет всего 3.8%. Это значит, что более 90% посетителей, которые дошли до прайс-листа, уходят без совершения действия. И дело почти никогда не в самом продукте.

Проблема кроется в текстах, структуре и неумении донести ценность предложения. 

Использование ИИ помогает быстро пересобрать прайс-лист, но только тогда, когда вы даете нейросети правильные инструкции. В этой статье я собрала 12 готовых промптов для создания сетки тарифов, обработки возражений, A/B-тестирования и оптимизации страниц цен.

---

## Что делает промпт для страницы цен эффективным?

Шаблонные запросы вроде «напиши тарифы для моего сервиса» приводят к созданию безликих страниц со стандартными названиями вроде «Базовый, Про, Корпоративный».

Качественное ТЗ для нейросети должно включать три ключевых блока информации:
- **Контекст продукта и сегменты аудитории**: Кто именно покупает каждый тариф (соло-разработчики, растущие команды, крупный бизнес)?
- **Модель ценообразования**: Подписка, оплата за использование (usage-based) или гибридный вариант.
- **Ожидаемый результат**: Регистрация на бесплатный триал, запрос демонстрации продукта или прямая покупка.

<!-- PLACEHOLDER: Иллюстрация: Схема идеального ТЗ для страницы цен -->

При проектировании шапки страницы цен важно использовать те же правила визуальной ясности, что и для главных экранов лендингов. Подробно об этом можно прочитать в статье [что делает лендинг эффективным](/blog/what-makes-a-good-landing-page-best-practices).

---

## Промпты для проектирования сетки тарифов

Эти шаблоны помогают распределить функции по пакетам и правильно сформулировать выгоду каждого тарифа.

> [!TIP]
> Шаблоны промптов даны на английском языке, поскольку ИИ-модели точнее генерируют структуры интерфейсов и маркетинговую логику на английском. Ниже приведено описание работы каждого шаблона на русском языке.

### Промпт 1: Проектировщик сетки тарифов (Tier-Based Pricing Page Builder)

```text
Create a pricing page for [product name], a [product category] for [target audience]. Include three tiers named to match these customer segments: [Segment A], [Segment B], [Segment C]. For each tier, list [X] features and immediately follow each with the business outcome it enables. Mark [Tier B] as recommended. Include a one-sentence objection response under each tier, addressing the most common hesitation for that segment. Offer an annual discount toggle. Tone: [brand voice].
```

* **Как использовать**: Замените данные в скобках на информацию о вашем продукте. Этот промпт заставляет ИИ писать не просто сухой список функций, а результаты, которые получает клиент на каждом тарифном плане.

---

## Промпты для работы с возражениями покупателей

Перед покупкой клиент сомневается: «Окупится ли это?», «Смогу ли я легко отменить подписку?». Эти промпты помогают закрыть страхи прямо на странице цен.

### Промпт 2: Размещение элементов доверия (Social Proof Placement Prompt)

```text
Add social proof to this pricing page for [product]. Place a customer testimonial directly below the tier cards, addressing price anxiety. Add a logo strip of recognisable customers above the fold. Insert a usage statistic such as '[X] teams saved [Y] hours per month' between the feature comparison table and the FAQ section. Each proof element must directly respond to the objection a visitor would have at that scroll position.
```

* **Как использовать**: Отправьте этот промпт ИИ вместе с текущим текстом вашей страницы цен. Нейросеть распределит отзывы и цифры по ключевым зонам страницы для снижения тревожности покупателя.

### Промпт 3: FAQ для закрытия сомнений (Objection-Specific FAQ Prompt)

```text
Write a 5-question FAQ section for the pricing page of [product], a [product category]. The questions must address these specific objections in this order: (1) Is this worth the price compared to [alternative]? (2) Can I cancel or downgrade anytime? (3) What happens when I exceed my plan limits? (4) Is my data secure? (5) How long does onboarding take? Each answer should be 2 to 3 sentences, factual, and written in a [tone] voice. No marketing language.
```

* **Как использовать**: Этот промпт создает блок вопросов и ответов, ориентированный на реальные сомнения пользователей, а не на абстрактные темы.

### Промпт 4: Текст для сравнения с конкурентами (Competitor Comparison Copy Prompt)

```text
Write a 3-sentence comparison section for [product]'s pricing page that explains how our pricing model differs from typical [product category] tools. Do not name any competitors. Highlight: (1) what we include that others charge extra for, (2) what we do not charge for that others do, and (3) the total cost of ownership difference over 12 months. Tone: confident, factual, no superlatives.
```

* **Как использовать**: Поместите сгенерированный блок сразу под карточками тарифов. Это задержит пользователя, который собирался открыть новую вкладку для поиска сравнений в Google.

### Промпт 5: Ценностное анкорирование цены (Value Anchoring Prompt)

```text
Rewrite the pricing section headline and subheadline for [product] using value anchoring. Frame the price against the cost of the problem it solves, not against competitor pricing. The headline should make [price] feel like a fraction of the value delivered. Include one specific metric such as hours saved, revenue gained, or errors reduced that a typical customer achieves in the first 30 days. Under 15 words for the headline, under 25 words for the subheadline.
```

* **Как использовать**: Промпт перестраивает восприятие цены: сначала клиент видит ценность и финансовую выгоду от решения проблемы, а затем — стоимость. Для получения точных цифр используйте внутренние данные вашего продукта, подробнее о которых написано в статье об [аналитике ценообразования](/blog/pricing-analytics).

---

##Persuasion-фреймворки для страниц цен

Выбор структуры подачи зависит от степени прогретости входящего трафика.

### Промпт 6: Структура по формуле PAS (Problem-Agitate-Solution)

```text
Write a pricing page for [product] using the PAS framework. Section 1, Problem: Name the specific problem [target audience] faces when they try to [core job to be done] without a tool like ours. Two sentences, no product mention. Section 2, Agitate: Describe the cost of that problem in concrete terms, such as time lost, revenue missed, or errors made. Two sentences. Section 3, Solution: Present our three pricing tiers as the resolution. Each tier headline should echo the problem language from Section 1. Tone: [brand voice].
```

* **Как использовать**: Подходит для аудитории, которая осознает свою проблему, но еще не думала о вашем продукте как о решении. Сначала мы показываем понимание их боли, а затем предлагаем решение в виде тарифных планов.

### Промпт 7: Персональный оффер по формуле AIDA для холодного трафика

```text
Write a pricing page for [product] using the AIDA framework for cold traffic arriving from [ad platform]. Attention: A bold headline that names the outcome, not the product category. Under 8 words. Interest: A feature highlights section with three bullet points, each written as a benefit, not a feature name. Desire: A social proof block with one customer result and a usage statistic. Action: A primary CTA button label and one line of microcopy below it. Tone: [brand voice]. No jargon.
```

* **Как использовать**: Используйте для страниц цен, на которые идет холодный трафик с рекламы. Фреймворк AIDA последовательно проводит пользователя от привлечения внимания к действию на одной странице. Это схоже с тем, как проектируются первые экраны по правилам [промптов для первого экрана](/blog/hero-section-prompts-that-convert).

### Промпт 8: Мэппинг функций на выгоды (Feature-Benefit Mapping Prompt)

```text
Take this feature list for [product]'s [tier name] plan: [paste features]. For each feature, write one sentence that explains the business outcome it enables for [target buyer role] at a [company size] company. Format: Feature name, Outcome sentence. The outcome must be specific and measurable where possible. Avoid marketing language. Tone: direct, professional.
```

* **Как использовать**: Скопируйте список функций вашего тарифа в промпт. Нейросеть превратит техническое описание в понятный для руководителя бизнес-результат.

---

## Промпты для оптимизации и A/B-тестирования

Ценообразование требует постоянного тестирования. Эти промпты помогут подготовить варианты для сплит-тестов и улучшить мобильную версию.

### Промпт 9: Генератор вариантов для A/B-тестов (A/B Variant Generator Prompt)

```text
Here is my current pricing page copy: [paste current page]. Generate three alternative versions for A/B testing. Version A: Change only the tier headline copy, making each tier name outcome-focused rather than label-based. Version B: Change only the primary CTA button label on each tier, using action-outcome format, max 4 words, avoid 'Get Started'. Version C: Reorder the page sections, moving social proof above the tier cards instead of below. Keep all other copy identical across all three versions.
```

* **Как использовать**: Тестируйте только одну переменную за раз, чтобы точно знать, какое изменение повлияло на конверсию.

### Промпт 10: Мобильная верстка тарифов (Mobile-First Pricing Page Prompt)

```text
Create a mobile-first pricing page for [product]. Requirements: (1) Each tier card must be readable as a standalone unit on a 375px screen with no horizontal scrolling. (2) The primary CTA button on each tier must be at least 44px tall and full-width on mobile. (3) The feature comparison table must collapse into an expandable accordion on mobile. (4) Place the most important social proof element above the tier cards so it is visible without scrolling on a standard iPhone screen. Generate the full page structure with these mobile constraints built in from the start.
```

### Промпт 11: SEO-разметка и сниппеты (Metadata and SEO Prompt)

```text
Write the SEO metadata for a pricing page targeting the keyword [primary keyword]. Include: (1) Meta title, under 60 characters, contains keyword, communicates value. (2) Meta description, under 160 characters, contains a keyword, includes a benefit, and a soft CTA. (3) OG title, under 20 characters, punchy, keyword-adjacent. (4) Three email subject lines for a follow-up sequence to visitors who viewed the pricing page but did not convert, each under 50 characters, no clickbait. Tone: [brand voice].
```

### Промпт 12: Крючки для заголовков (Pricing Page Headline and Subheadline Prompt)

```text
Write five headline and subheadline combinations for the pricing page of [product], a [product category] for [target audience]. Each pair should use a different angle: (1) Outcome, lead with the result the customer gets. (2) Urgency, emphasise what they are losing by waiting. (3) Contrast, highlight what makes this different from the default approach. (4) Question, open with the objection the visitor already has in their head. (5) Social proof, lead with a customer result or usage statistic. Headline under 10 words. Subheadline under 25 words. No jargon. Tone: [brand voice].
```

---

## 4 ошибки в промптах, из-за которых падают продажи

При создании страниц цен с помощью ИИ избегайте следующих ошибок:

1. **Генерация текстов без анализа конкурентов**. Без понимания рынка вы рискуете предложить неконкурентоспособные цены или не те функции в базовых пакетах. Изучите рынок с помощью методов из статьи об [исследовании цен конкурентов](/blog/issledovanie-cenoobrazovaniya-konkurentov).
2. **Отсутствие плана реагирования на демпинг**. Если конкуренты изменят цены, бездумное снижение стоимости с вашей стороны разрушит бизнес. Проработайте защитные механизмы заранее по нашей схеме [реакции на изменение цен конкурентов](/blog/reakciya-na-izmenenie-cen-konkurentov).
3. **Размытые призывы к действию**. Не пишите на кнопках всех тарифов банальное «Купить». Используйте точные формулировки, соответствующие целевому действию конкретного сегмента.
4. **Игнорирование мобильных ограничений**. Большинство пользователей будут смотреть цены со смартфонов. Если тарифная сетка разъезжается на экране мобильного, покупки не произойдет.

Для повышения качества генераций используйте базовые принципы составления ТЗ, описанные в статье о [лучших практиках промпт-инжиниринга](/blog/prompt-engineering-best-practices).

---

## FAQ: Часто задаваемые вопросы

### Какая модель ИИ лучше всего подходит для создания текстов тарифов?
Для разработки структуры тарифов и написания емких емких текстов выгод лучше всего использовать Claude 3.5 Sonnet или GPT-4o. Они реже используют штампы и лучше адаптируют профессиональную лексику под выбранный бренд-войс.

### Стоит ли делать один тарифный план или лучше дать выбор?
Для большинства SaaS-сервисов оптимально иметь 3 тарифных плана. Один тариф ограничивает аудиторию, а 5 и более — вызывают ступор из-за сложности выбора (паралич анализа). Три тарифа позволяют разделить клиентов на соло-пользователей, команды и крупные организации.

### Как ИИ помогает автоматизировать изменение цен?
ИИ может написать скрипты для динамического отображения цен в зависимости от региона пользователя или предложить логику интеграции с платежной системой (например, Stripe), но саму стратегию ценообразования и пороги лимитов должен рассчитывать человек на основе аналитики продукта.
