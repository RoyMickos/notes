# Tags

## architecture
Software architecture and system design, design patterns, domain-driven design and domain modelling, modular and layered design, monolith vs microservices decisions, API and contract design, architecture decision-making and the architect role; not cloud-provider reference architectures (use cloud) or messaging internals (use distributed-systems).
- Tag: #architecture
- Source: vault
- Evidence: [[Go domain model invariants]], [[The phoenix architecture]], [[Headless UI Components]], [[The big fat frontend]], [[North-South vs East-West communication]]

## distributed-systems
Event-driven systems, messaging, queues, event buses and streaming, pub-sub and fan-out, event-carried state transfer, microservice communication, consistency and distributed transactions, sagas, workflows and durable execution, idempotency, retries and resilience patterns.
- Tag: #distributed-systems
- Source: vault
- Evidence: [[Buses and Queues]], [[EventBridge]], [[Event-carried state transfer in Microservices]], [[Cloud event distributions and automations]], [[Two-phase commits]], [[North-South vs East-West communication]], #microservices, #EventBridge, #SQS

## cloud
Cloud platforms and their general services, accounts, organisations and landing zones, virtual machines, object and block storage, well-architected reviews, multi-cloud comparisons, cloud migration, cloud cost and FinOps, cloud certifications content; not serverless compute (use serverless) or cloud networking (use networking).
- Tag: #cloud
- Source: vault
- Evidence: [[Cloud well architected]], [[Cloud accounts and subscriptions]], [[Cloud storage]], [[AWS Account setup]], [[AWS EC2]], [[aws cli tricks]], [[AWS developer certificate]], #aws, #cloud-omnibus

## serverless
Function-as-a-service, serverless containers, managed event and workflow services, serverless databases, serverless application frameworks and templates, local development, testing and debugging of serverless functions, cold starts and serverless cost.
- Tag: #serverless
- Source: vault
- Evidence: [[serverless cloud functions]], [[Run containers in cloud without servers]], [[Serverless nosql databases]], [[Local development of lambda and step functions]], [[Testing serverless functions]], [[Pomo AWS Sam rewrite]]

## networking
Virtual networks and VPC design, shared and private connectivity, load balancing, proxies and forwarded headers, DNS, service mesh, north-south and east-west traffic, zero-trust and identity-aware access proxies, HTTP and network protocols, Kubernetes networking.
- Tag: #networking
- Source: vault
- Evidence: [[AWS networking]], [[Shared VPC]], [[Private service connect]], [[Service mesh]], [[Cloud Service Mesh]], [[Kubernetes networking]], [[X-Forwarded-For and proxy protocols]], [[Secure web proxy and Identity aware proxy]], [[Wifi public networks]]

## containers-kubernetes
Containers and container images, Kubernetes, pod scheduling, cluster operations, managed container services, Helm and operators, inner-loop Kubernetes development tools, logging and testing inside clusters.
- Tag: #containers-kubernetes
- Source: vault
- Evidence: [[kubernetes pod scheduling]], [[Kubernetes networking]], [[Logging in kubernetes]], [[performance testing in kube]], [[Skaffold as kubernetes dev tool]], [[Skaffold debugging]], [[keep container running]], [[AWS Container hierarchy]]

## platform-devops
CI/CD pipelines, deployment strategies, infrastructure as code, configuration management, GitOps, release and versioning conventions, platform engineering and internal developer platforms, developer experience at organisation level.
- Tag: #platform-devops
- Source: coverage

## dev-tooling
The individual developer's environment: editors and IDEs (vim and Neovim), terminal, shell and CLI tools, git workflows, debugging tools, dev containers and local environments, Linux and other workstation operating systems, package managers and reproducible environments, virtual machines, OS administration and upgrades; not AI coding assistants (use ai-assisted-development).
- Tag: #dev-tooling
- Source: vault
- Evidence: [[New vim config]], [[nvim alternate config]], [[NVIM, GIT and mergetool]], [[Dev containers]], [[nix]], [[distro update]], [[ansible for distro upgrading]], [[Partitioning scheme]], [[Fedora virtual machine]], [[jq tricks]], [[uploads and downloads with curl]], [[who is holding my port]], [[node debugging]], #linux

## observability-operations
Monitoring, metrics, logging, distributed tracing, alerting, SRE practices, SLIs, SLOs and error budgets, incident response and postmortems, reliability, performance tuning, load and performance testing, capacity planning.
- Tag: #observability-operations
- Source: vault
- Evidence: [[site reliablity engineering]], [[Logging in kubernetes]], [[performance testing in kube]]

## data
Relational and NoSQL databases, SQL, query and key design, transactions, isolation levels and locking, data modelling, data engineering and pipelines, stream and batch processing, analytics, data warehouses, data sharing and marketplaces, search.
- Tag: #data
- Source: vault
- Evidence: [[Postgres advisory locks]], [[postgres tricks]], [[SQL isolation levels]], [[AWS DynamoDB primary and sort keys]], [[AWS DynamDB query vs scan]], [[Serverless nosql databases]], [[AWS Glue vs Kinesis vs Dataproc]], #nosql

## ai-augmented-systems
Building products and systems that use AI: LLM integration, prompt and context design, tool use and function calling, structured output, agents and multi-agent systems, retrieval-augmented generation, embeddings and vector search, evaluation and guardrails, LLM application security, ML systems and MLOps.
- Tag: #ai-augmented-systems
- Source: vault
- Evidence: [[Retrieval augmented generation]], [[Claude academy]], [[AI Prompting]], [[LLM as a coach]], [[AI Exploration]], [[Overview of LLM app security.excalidraw]], #ai

## ai-assisted-development
Using AI to build software: AI coding assistants and editor integrations, agentic coding tools and their configuration, vibe coding, reviewing and verifying AI-generated code, prompting for code, how AI changes the developer role, team practices and code ownership.
- Tag: #ai-assisted-development
- Source: vault
- Evidence: [[AI Tool setup]], [[AI Discernment]], [[Neovim with CodeCompanion and Vectorcode]], [[Gitlab duo in Neovim]], [[The phoenix architecture]], [[ai resources]], #ai

## security
Application and web security, OWASP vulnerabilities such as injection, XSS, CSRF and information disclosure, HTTP security headers and CORS, cryptography and encryption schemes, secrets management, supply chain security, threat modelling, privacy, security testing and vulnerability disclosures; not authentication and authorisation design (use identity-access).
- Tag: #security
- Source: vault
- Evidence: [[Web Security]], [[sql-injection]], [[cross-site-scripting]], [[Cross-site request forgery]], [[Information disclosure]], [[HTTP Security Headers]], [[CORS]], [[Hybrid and envelope encryption]], [[Securely delete files on btrfs]], [[Overall security view of an app.excalidraw]]

## identity-access
Authentication and authorisation, OAuth 2 and OpenID Connect, ID and access tokens, single sign-on and federation, delegated authentication, user pools and identity providers, cloud IAM policies and permission models, broken authentication, passkeys and MFA.
- Tag: #identity-access
- Source: vault
- Evidence: [[Identity token vs Access Token]], [[Salesforce delegated authentication]], [[Broken Authentication]], [[AWS Cognito and IAM]], [[AWS IAM Identity and resource based policies]], [[AWS Permissions Hierarchy]], [[google identity services for apps]]

## engineering-practices
Testing strategy, unit and integration testing, TDD, browser and end-to-end test automation, code review, refactoring, legacy code, technical debt, commit and branching conventions, software craftsmanship, delivery flow and estimation.
- Tag: #engineering-practices
- Source: vault
- Evidence: [[Testing strategy]], [[how to review code]], [[Conventional commits]], [[Testing serverless functions]], [[tracing chrome and chromedriver]]

## languages-runtimes
Programming language features and idioms, Go, JavaScript and TypeScript, Node.js, module systems, .NET and C#, JVM languages, Rust, Python, functional programming concepts, type systems, compilers and runtimes, backend frameworks.
- Tag: #languages-runtimes
- Source: vault
- Evidence: [[bootstrap go module]], [[Go structs vs types vs interfaces]], [[Go sets]], [[Go and .env files]], [[CommonJs modules, EcmaScript modules and typescript]], [[Javascript vs typescript privates]], [[Never use the g flag when running exec with js regexp]], [[Nest that would not start]], [[IO and Task]], #javascript, #typescript

## frontend-mobile
Web UI development, HTML and CSS, JavaScript frontend frameworks, single-page apps vs server-side rendering, UI component design, accessibility and UX, browser features, mobile and cross-platform apps.
- Tag: #frontend-mobile
- Source: coverage

## teams-leadership
Team dynamics, engineering management, goal setting and OKRs, organisation design, socio-technical systems, team topologies, hiring, culture, agile ways of working.
- Tag: #teams-leadership
- Source: coverage

## consulting-communication
Customer and stakeholder communication, active listening, facilitation and workshops, requirements discovery, building the right thing, levels of discussion, argumentation and reasoning errors, persuasion, technical leadership toward clients, presenting and writing.
- Tag: #consulting-communication
- Source: vault
- Evidence: [[Communication style]], [[Logical leap]], [[_objectives]]

## industry-domains
Software in specific industries and their domain problems: railway and transport, mobility and logistics, energy, finance, healthcare, public sector, manufacturing and IoT fleets, industry case studies, domain regulations and data standards.
- Tag: #industry-domains
- Source: vault
- Evidence: [[Raideliikenne PoC]], [[_objectives]]

## learning-career
Learning techniques and spaced repetition, certifications and exam preparation, education, career paths and growth, mentoring and coaching, wellbeing and burnout, personal stories.
- Tag: #learning-career
- Source: vault
- Evidence: [[Anki best practices]], [[AWS developer certificate]], [[Google certificate retake]], [[Claude academy]]

## other
Anything not covered above: creative coding, demoscene, games and game development, hardware, keyboards and maker projects, broad panels and keynotes without a technical focus, non-technical topics.
- Tag: #other
- Source: coverage

# Review notes
Changes relative to the draft:
- Split `cloud` into `cloud` and `serverless`: the vault has a distinct cluster on functions, serverless containers, serverless databases and serverless testing, separate from accounts, storage and well-architected notes.
- Added `networking`: about ten notes on VPCs, private connectivity, service mesh, proxies and Kubernetes networking that the draft had no home for.
- Split `linux-containers` into `containers-kubernetes` and `dev-tooling`: the vault's Linux notes are about the workstation (distro upgrades, partitioning, nix, VMs), which sits with editor, shell and CLI notes, not with Kubernetes.
- Split `security` into `security` and `identity-access`: the vault covers web vulnerabilities and authentication/IAM separately and in depth, and the largest note in the vault is about delegated authentication.
- Renamed `ai-applied` to `ai-augmented-systems` and `ai-for-developers` to `ai-assisted-development` to match the wording in the objectives.
- Renamed `career-personal` to `learning-career`: the vault content is about learning methods and certifications rather than personal stories (those are still in the description).
- Added `industry-domains`: an objective targets software in a specific industry, and re:Invent and Cloud Next run many industry-specific talks that no other tag fits.
- Narrowed `platform-devops`: individual developer tools and "developer experience" in the editor sense moved to `dev-tooling`; platform-level DX stays here.
- Moved load and performance testing explicitly into `observability-operations`, and browser test automation into `engineering-practices`.
- Marked `platform-devops`, `frontend-mobile` and `teams-leadership` as coverage: the vault has at most one or two notes on each (one OKR note, a few frontend notes, one deployment-service note).

Unsure placements:
- Vendor tags: about 17 notes are specific to one cloud vendor and the vault uses `#aws`. I did not make vendor tags, because at a vendor conference every talk would get the vendor tag and use up one of the 1–3 slots. If you want vendor tags for notes, they work better as a second, separate dimension than as content tags.
- Event-driven vs distributed systems: your event-driven objective is covered by `distributed-systems`. A separate `event-driven` tag would nearly always be assigned together with it, so I kept one.
- `frontend-mobile` could arguably be `vault`, given [[The big fat frontend]], [[Headless UI Components]] and [[Static SPA and robots]]; I left it as coverage because the notes are short.
- Certification notes could go under `cloud` or `learning-career`; I listed them as evidence for both.
- Personal notes (recipes, bike travel, interrail, keyboards, Mac setup) fall under `other` or `dev-tooling`; none of these deserved its own tag.
- [[Wifi public networks]] (captive portals) is filed under networking but is really a workstation note.

Existing vault tags that overlap but were not reused as names:
- `#aws` (7 uses) and `#cloud-omnibus` (5): covered by `cloud` and `serverless`; see the vendor point above.
- `#ai` (1): split into the two AI tags.
- `#microservices` (2): covered by `distributed-systems`, with design decisions under `architecture`.
- `#linux` (2): covered by `dev-tooling`.
- `#javascript`, `#typescript` (1 each): covered by `languages-runtimes`.
- `#EventBridge`, `#SQS`, `#nosql` (1–2 each): product-level, too narrow; covered by `distributed-systems` and `data`.
- `#excalidraw`, `#journal`, `#clippings`: structural tags, not about content.

