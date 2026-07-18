# Comprehensive Website Vision

Last revised: 2026-07-16

Status: Primary source of truth for future creative direction.

Implementation plans: `documentation/implementation-plans/README.md`.

This document consolidates the accepted ideas and feedback from:

- `Creative-Website-Ideas.md`
- `Far-Out-Creative-Website-Ideas.md`
- `Exploration-Driven-Website-Ideas.md`

Those documents remain useful as ideation history. When they conflict with this document, this document takes priority.

## 1. Core Vision

`marknperera.ca` should become one persistent exploratory world that represents Mark through interaction.

It should not divide visitors into separate story and proof modes. It should instead use increasing depth:

- A visitor can understand something quickly from a distance.
- Curiosity reveals the product experience.
- Further manipulation reveals architecture, decisions, evidence, and personal connections.
- Free exploration reveals meaningful material that the guided path does not expose.

The website should feel mysterious without being confusing, expressive without becoming random, and technically impressive without requiring visitors to read long claims about technical skill.

The central principle is:

**Let visitors discover, experience, manipulate, and understand.**

### Information Architecture

The portfolio should be technically multi-route while feeling like one continuous world.

Routes represent durable places with independent loading, deep-link, browser-history, search, and recovery value. Increasing depth usually happens inside those places rather than creating one page per stage. Shared transitions, persistent discovery, global AI, semantic lighting, stimulation, and orientation make the places feel connected.

The core durable places are:

- `/` as the world atrium, First Note, return checkpoint, tour entry, and major portals.
- `/about` as one chronological environment with inspectable events.
- `/projects` as the museum lobby and overview.
- `/projects/[slug]` as a stable project entry family, with flagship entries leading to canonical project subdomains.
- An optional future `/archive` as the expanded state of the same global AI.

Flagship subdomains are canonical project worlds, not duplicates of the museum. The museum normally owns Signal, Approach, and lightweight Handle states. Project subdomains normally own substantial Enter and Understand states, plus canonical project blogs.

Transient proximity, pointer, camera, and manipulation state should not create routes. Meaningful Handle, Enter, and Understand states should support validated browser history or deep links when they are independently useful. Browser Back should close the current meaningful layer before leaving its durable place.

Environmental navigation remains primary, but a quiet universal orientation control must always provide a reliable way to move or return. It should not look like a literal compass, checklist, or conventional persistent navbar unless testing proves one is needed.

The approved routing and state policy is recorded in `implementation-plans/2026-07-16-Information-Architecture-And-Routing-Decision.md`.

## 2. Confirmed Design Principles

### One Cohesive Experience

There should not be separate Story and Proof modes. Personal story, technical evidence, product behavior, music, and creativity should coexist as layers of the same world.

### Exploration Is The Main Interaction

The site should initially conceal parts of itself. Light, proximity, sound, movement, clicking, dragging, opening, rotating, and entering should reveal increasingly meaningful layers.

### Increasing Depth Replaces Time Selection

Visitors should not be asked how much time they have. Every important area should communicate its available depth intuitively. A recruiter can understand a project quickly; a curious visitor can continue much further.

### Products Are Experienced

Flagship projects should contain small, crafted demonstrations of their central product idea. These experiences should communicate more effectively than descriptive copy alone.

### The World Remembers

The site should remember what a visitor has revealed, touched, opened, and entered. The first visit permanently changes their local version of the world.

### AI Belongs Everywhere, Quietly

AI should be context-aware and available throughout the site without repeated buttons or an intrusive assistant constantly asking to help.

### The Knowledge Graph Is Infrastructure

The existing markdown content is a substantial knowledge corpus. It should be expanded with explicit, accurate relationships that power AI, navigation, connections, skill evidence, project depth, and guided exploration.

### Guided And Free Exploration Are Both First-Class

The guided quick tour should make the world understandable without forcing a sequence. Free exploration should contain additional interactions, stories, relationships, and easter eggs.

### Stimulation Is Progressive

The experience should begin relatively calm. Richer sound, movement, particles, lighting, and environmental response can awaken as the visitor interacts.

### Desktop And Mobile Are Separate Design Problems

The mobile experience does not need to reproduce the desktop world one-to-one. Both can share content, knowledge relationships, AI context, and discovery state while using different interaction models.

### Aesthetics Are Structural

The approved ideas require an equally authored visual world. Art direction must begin before component styling, not arrive as a polish pass after interactions are complete.

The site should not depend on the familiar premium-portfolio formula of dark gradients, equal rounded cards, muted body copy, pill controls, generic glow, and one large serif heading. Individual ingredients may still appear when they have a purpose, but they cannot become the default composition.

Each major scene needs a focal artifact or phenomenon, deliberate hierarchy, material logic, and one memorable gesture. Projects share the five-stage depth grammar while retaining distinct silhouettes and behaviors. A visitor should be able to feel the difference between LifeInbox, Dreamlife, and Sudoku Together before reading their names.

The active implementation and review standard is [Art Direction And Aesthetic Quality](implementation-plans/18-Art-Direction-And-Aesthetic-Quality.md).

## 3. The Universal Grammar Of Depth

Every major object, memory, project, or offering should use the same five-stage depth grammar.

### Stage 1: Signal

The site suggests that something exists without fully revealing it.

Signals can include:

- A silhouette in darkness.
- A reflected shape.
- A distant tone.
- A particle disturbance.
- A moving internal component.
- A pulse of semantic light from a related object.

### Stage 2: Approach

Moving closer or focusing reveals enough context for the visitor to decide whether to continue.

This layer should usually communicate:

- What the object represents.
- The central question or problem.
- Why it may be relevant to the visitor.

### Stage 3: Handle

The visitor manipulates the object.

Possible actions include:

- Clicking.
- Opening.
- Rotating.
- Dragging.
- Rearranging.
- Playing or tuning.
- Entering a small input.
- Placing an AI card into or near the object.

### Stage 4: Enter

The object opens into an experience.

Examples:

- A project becomes a minimal product demonstration.
- A timeline moment becomes a memory room.
- An AI card becomes a navigable doorway.
- A service or product becomes a preview, audition, diagnostic, or interactive sample.

### Stage 5: Understand

The deepest layer reveals meaning and evidence.

It can contain:

- Architecture.
- Tradeoffs.
- Important failures.
- Authored source material.
- Repository and build evidence.
- Current project state.
- Connections to earlier memories and later work.
- Skills demonstrated by what the visitor just experienced.

This depth grammar is the site's primary source of cohesion. Different areas can look and behave differently while still teaching the visitor the same underlying interaction logic.

## 4. Discovery Physics

Exploration should feel learnable rather than arbitrary. The environment needs a small set of consistent rules.

Candidate rules:

- Light travels between meaningfully related objects.
- Sound becomes clearer when the visitor faces or approaches its source.
- Objects with visible internal motion can be opened into system layers.
- Moving one object can reveal what it concealed.
- Rotating an artifact can reveal another side of its story.
- Bringing two related objects together can expose their knowledge-graph relationship.
- Returning to an altered object can reveal a second layer.
- Newly added content creates a disturbance in an otherwise familiar environment.

These rules should be tested through prototypes. Only rules that feel intuitive and provide real explanatory value should survive.

## 5. The First Note And Persistent Discovery

### First Visit

The first visit begins mostly dark.

The visitor discovers a musical object or interaction. Activating it produces the First Note: a note, chord, phrase, or visual-musical gesture that wakes the core environment.

The First Note should:

- Be optional to hear but visually meaningful with sound off.
- Reveal enough destinations for exploration to begin.
- Establish the relationship between music, light, and discovery.
- Be brief and immediately interactive.

### Later Visits

The First Note should not replay automatically.

The site should restore:

- The visitor's last meaningful area or a clean nearby checkpoint.
- Areas they have revealed.
- Objects they have altered.
- Exhibits they have opened.
- Knowledge connections they have discovered.
- AI cards they interacted with during the local session where appropriate.
- Sound and stimulation preferences.

Persistent state should be anonymous and local by default. It should feel like continuity, not account progression or a game completion system.

### New Content For Returning Visitors

Meaningful new content should appear as an environmental disturbance rather than a conventional notification badge.

Possibilities:

- A distant new light.
- A changed sound in a familiar area.
- A new semantic-lighting path.
- An exhibit with one newly moving part.
- An unresolved card near the AI presence.

The visitor can ignore or investigate it.

## 6. The Guided Quick Tour

The quick tour should behave like a non-linear guide, not a checklist and not a literal compass graphic.

### Entry

The visitor can begin the tour from a clearly available but unobtrusive option.

It asks one question:

- `Recruiter`
- `Potential Client`
- `Builder Or Collaborator`
- `Just Exploring`

The exact language can be refined later.

### Role Behavior

Recruiters receive relevant destinations without another question. The likely focus is AI-related technical work, flagship products, architecture, and evidence.

Potential clients receive a short follow-up only when the relevant offerings are ready. Possible branches include:

- AI systems and workflow improvement.
- Music lessons or music services.
- Software, games, and digital products.

Builders and collaborators receive projects, technical systems, experiments, and ways to work together.

Explorers receive a balanced selection of personal history, projects, music, and hidden depth.

### Non-Linear Guidance

The tour presents several destinations at once. The visitor chooses their order.

At each destination they can:

- Continue with guidance.
- Explore the area more deeply.
- Move to another suggested area.
- Dismiss the guide and continue freely.

The guide should explain unfamiliar controls contextually but should not interrupt every interaction.

### Benefit Of Free Exploration

The guided tour should not reveal:

- Every easter egg.
- Every personal artifact.
- Alternate exhibit manipulations.
- Lesser-known project relationships.
- Hidden technical failures and abandoned approaches.
- Some deeper AI archive cards.
- Experimental or unfinished areas.

The tour gives clarity. Free exploration gives surprise, intimacy, and a fuller understanding.

## 7. The Quiet Site-Wide AI

### Presence

The AI should have one persistent, subtle visual presence. It may be an orb, light, particle behavior, or another element that belongs naturally in the environment.

It should have restrained states:

- Dormant.
- Context available.
- Listening.
- Responding.
- Guiding.

It should not cover the page, repeatedly animate for attention, or place `Ask about this` buttons throughout the site.

### Context Awareness

The AI should know the currently inspected:

- Object.
- Project layer.
- Product demonstration.
- Timeline event or memory room.
- Offering.
- Blog post.
- Knowledge relationship.

The visitor should be able to ask a natural question without restating that context.

### Archive Cards

AI answers can include authored or generated cards representing:

- Projects.
- Timeline memories.
- Architecture views.
- Product demonstrations.
- Blog posts.
- Skills and evidence.
- Offerings.
- Source documents.

Selecting a card should transition seamlessly into the represented area.

In richer interactions, a card can become part of the environment:

- A Dreamlife card unfolds into possible futures.
- A LifeInbox card enters a capture system.
- A Sudoku card becomes a playable board.
- A memory card reveals its connection to a project.

### Expanded Archive State

A deeper visualized talking-archive experience can exist as an expanded state of the global AI. It does not need to be a completely separate AI page.

The archive should visibly cite the knowledge sources supporting an answer and admit when it lacks sufficient evidence.

## 8. The Knowledge Graph

### Existing Foundation

The current MD and MDX files are the content corpus. They already provide substantial structured knowledge through frontmatter and authored text.

The next step is not to replace this corpus. It is to add explicit, reviewed relationships.

### Node Types

Initial node types should include:

- Timeline event.
- Project.
- Project state.
- Product feature.
- Technical decision.
- Problem or constraint.
- Lesson.
- Skill or capability.
- Community or formative interest.
- Blog post.
- Media artifact.
- Repository or external source.
- Offering.

### Relationship Types

Initial relationship types can include:

- `inspired`
- `led_to`
- `demonstrates`
- `learned_from`
- `solved_in`
- `continued_in`
- `contrasts_with`
- `depends_on`
- `documented_in`
- `evidenced_by`
- `currently_exploring`

### Accuracy

Relationships should be authored or reviewed. Automatic tag overlap can suggest relationships but should not publish them without validation.

Every visible connection must be explainable in plain language.

### Uses

The graph should power:

- Contextual AI retrieval.
- Related memories and projects.
- The About connections layer.
- Semantic lighting.
- Guided-tour recommendations.
- Skill evidence.
- Living project state.
- Easter eggs based on real relationships.
- Future multi-visitor interactions.

### Visual Representation

A separate constellation view is not currently part of the confirmed design. The graph should first become visible through useful interactions such as semantic lighting, revealed connections, AI cards, and the experimental skill tree.

If a broader graph view is explored later, it must be concrete and readable rather than an abstract field of dots and lines.

## 9. Semantic Lighting

Semantic lighting is a promising way for the knowledge graph to affect the whole world without requiring a separate graph page.

Examples:

- Inspecting Discord-related history softly illuminates Sudoku Together, Discord bot work, and community-building memories.
- Inspecting local-first architecture sends a restrained pulse toward LifeInbox and relevant technical writing.
- Inspecting a piano artifact illuminates music, teaching, disciplined practice, and arrangement offerings.
- Asking the AI about resilience creates a temporary path through accurate memories and later projects.

Semantic lighting requires careful art direction:

- It should show only a few meaningful relationships at once.
- Every illuminated destination should explain why it is connected.
- Color cannot be the only carrier of meaning.
- It must remain subtle enough that the environment does not become visually noisy.

## 10. About And Memory Depth

### The Main Timeline

About should remain chronologically understandable. It should not become a reading-heavy multi-voice system.

### Inspecting An Event

At deeper levels, an event can reveal:

- What interest began there.
- What capability developed there.
- What community or relationship influenced it.
- What later project carries it forward.
- What belief or working habit changed.

These connections come directly from the knowledge graph.

The guiding question is:

`What did this become?`

### Memory Rooms

Selected major events can open into small memory rooms as a deeper optional layer.

Each room should contain one central object rather than a second wall of text.

Candidate objects:

- A piano or score.
- A game creation artifact.
- A Discord community artifact.
- An object representing a difficult reset.
- An early AI product prototype.

Manipulating the object reveals a short story, a real artifact where available, and its later consequence.

Memory rooms are a prototype candidate, not yet a requirement for every timeline event.

## 11. The Projects Museum

Projects should be presented as inspectable systems with increasing depth.

### Level 1: Signal

A silhouette, model, sound, or environmental response invites attention.

### Level 2: Identity

Approaching reveals:

- Project name.
- Central human or product problem.
- Current or historical status.
- One reason it matters.

### Level 3: Experience

Opening the exhibit reveals a small demonstration of the product's defining idea.

### Level 4: Exploded System

Further manipulation reveals:

- Product loop.
- Interface decisions.
- Data flow.
- Architecture.
- Important constraints.
- Failure modes and safeguards.

### Level 5: Evidence And State

The deepest layer includes:

- Repository and source material.
- Tests and build evidence where relevant.
- Authored decisions and tradeoffs.
- Living project state or final retrospective.
- Related memories and writing.
- Skills demonstrated.

### Project-Specific Interaction

The phrase `project-specific manipulation language` means that the action should reflect the project's actual idea.

- Dreamlife is understood by comparing, reacting to, and refining future paths.
- LifeInbox is understood by capturing and routing information.
- Sudoku Together is understood by participating in a shared board.
- A music project is understood by listening, isolating, rearranging, or performing layers.
- A 3D project is understood by rotating, opening, disassembling, or recomposing a scene.

The interaction differs because the products differ. The five-stage depth grammar keeps those interactions cohesive.

## 12. Flagship Experiential Case Studies

### Dreamlife

The visitor chooses a relatable tension, such as security versus exploration.

The experience:

- Presents Current, Fallback, and Wild Card paths.
- Lets the visitor mark what resonates or feels wrong.
- Shows how that reaction becomes a smaller experiment.
- Allows the visitor to reveal the AI and data decisions beneath the experience.
- Tells the six-figure offer story with accurate context about what it validated and what it did not.

### LifeInbox

The visitor enters a synthetic raw capture.

The experience reveals:

- Immediate local capture.
- Structured kinds.
- Privacy handling.
- Dirty-flag synchronization.
- Server enrichment.
- Reminder creation and recovery.
- Notification and alarm-like behavior.
- Safeguards around timestamps and expiration.

The product experience should open into an entry autopsy that shows how the system behaves end to end.

### Sudoku Together

The visitor enters a minimal single-player demonstration of the collaborative product.

The experience:

- Shows a computer participant joining the session.
- Lets the visitor place a few numbers and pencil marks.
- Has the computer periodically enter valid numbers.
- Communicates shared presence and board updates.
- Can reveal Discord context, session state, proxy routes, persistence, and progression beneath the board.

The computer should be clearly labeled. The demo can be deterministic and local while still communicating the real product insight.

### Other Projects

Not every project needs a custom product demonstration. Flagship projects should receive the deepest treatment. Other exhibits can use lighter interactions appropriate to their significance.

## 13. Exploded Case Studies

Exploded case studies should reveal carefully crafted layers, not merely animate pieces apart.

Every layer should answer one question:

- Who needed this?
- What was the product idea?
- What did the user experience?
- What system enabled it?
- What was unexpectedly difficult?
- What failed or changed?
- What is true now?
- What did Mark learn?

The strongest pattern is to reveal architecture physically beneath the product behavior it enables.

Examples:

- Lift Dreamlife's future cards to reveal the context and AI flow beneath them.
- Pull the LifeInbox phone upward to expose local and server layers.
- Lift the Sudoku board to reveal session state, versioning, proxying, and persistence.

The presentation of these layers needs project-specific art direction and careful pacing.

## 14. Living Project State

Projects should declare a lifecycle state:

- `evolving`
- `maintained`
- `complete`
- `archived`

### Evolving Projects

An evolving project should include:

- `Stable Foundation`: what is real and working.
- `Current Question`: what Mark is trying to understand or improve.
- `Latest Meaningful Change`: a change that altered capability, reliability, or product direction.
- `Next Experiment`: what will be tested next and why.

### Maintained Projects

A maintained project is stable but still receives practical improvements. It should show its stable role and only surface meaningful maintenance work.

### Complete Projects

A complete project should not pretend to be active. It should present:

- Final outcome.
- Last meaningful state.
- Most important constraint.
- What it taught.
- What later work inherited from it.

### Archived Projects

An archived project remains part of the story but is no longer actively represented as current capability without context.

### Editorial Quality

Living state should be authored and selective. It is not a commit feed, automated changelog, or stream of small updates.

Project state should feed the AI, knowledge graph, project exhibit, and environmental disturbances for returning visitors.

## 15. Skill Tree Prototype Candidate

The skill tree is interesting but not yet confirmed. It should be prototyped before becoming part of the main experience.

### Principles

- Skills are never self-rated with percentages or arbitrary levels.
- Every skill is backed by projects, decisions, writing, and timeline evidence.
- The visitor can inspect the evidence supporting a skill.
- The system distinguishes demonstrated capability from current exploration.
- Skills can become visible as visitors encounter their evidence.

### Possible Branches

- AI product systems.
- AI workflow automation and integration.
- Mobile and local-first architecture.
- Backend reliability and deployment.
- Interactive 3D web.
- Discord and social systems.
- Product thinking and experience design.
- Music, arrangement, performance, and teaching.
- Community building.

### Relationship To The Knowledge Graph

The skill tree is one possible view of the graph. It answers:

`What capabilities are demonstrated, and what evidence supports them?`

It should not attempt to visualize every relationship in Mark's life.

### Prototype Questions

- Does discovery make the tree grow, or is the full tree quietly available?
- Should it look organic, architectural, mechanical, musical, or something else?
- Is `skill tree` the right presentation, or would an `evidence map` feel more credible?
- Does it help visitors evaluate Mark, or mainly add novelty?

## 16. Meaningful Easter Eggs

Easter eggs are confirmed as part of the free-exploration experience.

They should vary in kind:

### Personal

- A real artifact from a formative period.
- A hidden musical performance or arrangement.
- A lesser-known community story.

### Product

- An early interface beside the current version.
- An alternate prototype direction.
- A hidden way to manipulate an exhibit.

### Technical

- A failure that changed the architecture.
- A safeguard that exists because of a real bug.
- A behind-the-scenes view of a 3D illusion.

### Relational

- An unexpected knowledge-graph connection.
- A later project hidden inside an earlier memory.
- An AI archive card that only appears after its evidence is inspected.

The reward should be deeper understanding, intimacy, surprise, or capability. Easter eggs should not become tokens, badges, or a completion checklist.

## 17. The Site Can Ask For Help

Occasionally, an evolving project can invite thoughtful input.

Good uses:

- Asking which demonstration communicates a product idea more clearly.
- Asking which of two next experiments seems more useful.
- Inviting a visitor to submit a question the current archive does not answer.
- Testing interest in a future product or offering without claiming it is available.

Rules:

- Requests should be rare.
- They should appear only where context makes them meaningful.
- Submission must be explicit.
- The site should never guilt visitors into responding.
- The feedback mechanism should distinguish casual preference from serious inquiry.

## 18. A New Studio For Services, Learning, And Products

The old website-template direction should be retired. The new area should represent the broader ways someone might learn from, work with, or buy something from Mark.

Working name: `The Studio`.

The name can change later. The important change is the structure.

### Path A: Learn With Mark

Potential offerings:

- Piano lessons.
- Music theory or arrangement lessons.
- Music production guidance using REAPER.
- AI workflow education.
- Practical sessions on integrating AI into personal or professional systems.

Experiential previews:

- A short piano or music diagnostic that recommends a learning path.
- An interactive arrangement showing how one passage changes across difficulty levels.
- A layered REAPER session demonstrating production concepts.
- A small workflow exercise showing how AI can remove repetitive work without removing human judgment.

### Path B: Work With Mark

Potential services:

- AI workflow audits.
- AI automation and system integration.
- Knowledge-base and retrieval system design.
- Prototyping AI-assisted products or internal tools.
- Custom song arrangements.
- Commissioned music performances or covers where appropriate.
- Select software, game, or interactive web collaboration.

The AI-services experience should demonstrate the work rather than rely on broad consulting claims.

A visitor could:

- Describe a repetitive workflow.
- Arrange its steps visually.
- Identify where human judgment is essential.
- See a carefully constrained example of where AI or automation could help.
- Produce a short problem brief for a later conversation.

This should not automatically promise a solution or collect sensitive business information.

### Path C: Use Or Buy Mark's Work

Potential products:

- SaaS applications.
- Games.
- Music arrangements.
- Recorded covers and performances.
- REAPER sample packs, templates, presets, or production resources.
- Reusable website components.
- Interactive React or 3D components.
- Educational music or AI resources.

Every product should be experienced appropriately:

- Arrangements can show notation, difficulty, and audio preview.
- Covers can offer performance excerpts and production breakdowns.
- Sample packs can be auditioned through a small mixer.
- Games should provide a playable slice.
- SaaS should provide a focused product demonstration.
- Web components should run in a live sandbox with code and accessibility notes where relevant.

### Readiness States

The Studio must distinguish:

- `available`
- `limited availability`
- `in development`
- `exploring interest`
- `not currently offered`

Only available offerings should use purchase, booking, or inquiry language.

Future ideas can still be shown as experiments or interest tests without pretending Mark is ready to accept work.

### Guided-Tour Client Branch

The Potential Client tour can eventually branch into:

- `Improve A Workflow With AI`
- `Learn Music Or AI With Mark`
- `Explore Software, Games, Or Creative Products`

The follow-up should remain short and should only show paths that have something meaningful to experience.

## 19. Stimulation As A Seamless Spectrum

The site should not ask visitors to choose a formal visual mode before entering.

### Calm Default

- Sound is off until invited by an interaction.
- Motion is purposeful and restrained.
- Hidden objects signal themselves subtly.
- Navigation remains clear enough to recover from confusion.

### Progressive Immersion

As the visitor interacts:

- Music can gain layers.
- Particle systems can become richer.
- Lighting can reveal more graph relationships.
- Objects can respond more physically.
- Camera motion can become more expressive.

### Intuitive Controls

A persistent but quiet control should allow:

- Sound off.
- Lower stimulation.
- Standard experience.
- Richer immersion where appropriate.

This does not need to be presented as four named modes. It can be a simple, understandable control.

Essential navigation and information must remain usable with sound off. The project does not require a text duplicate for every visual explanation.

## 20. Ambient Multi-Visitor Presence

Subtle multiplayer presence may be explored before full shared-navigation links.

The goal is awareness, not communication.

Possible forms:

- Anonymous distant lights representing other current visitors.
- A soft ripple when someone else enters the same exhibit.
- An object becoming slightly more luminous when several visitors are nearby.
- Faint temporary echoes of recent interaction without showing identity or content.

Rules:

- Do not invent activity when no one is present.
- Do not expose identity, cursor detail, typed content, or precise behavior.
- Do not add chat.
- Make presence optional and non-distracting.
- Explain the feature and its privacy behavior clearly.

This can create a feeling of a living shared world while preserving the single-person exploration experience.

## 21. Shared Exploration Later

Full guided shared navigation belongs in a later phase after the single-person experience is coherent and stable.

A future version could allow:

- Mark and a guest to occupy the same website state.
- Mark to reveal and navigate areas for both participants.
- Guests to inspect details independently without losing the shared context.
- AI cards and evidence to be opened during the session.
- A link to restore a specific exhibit and state.

Ambient co-presence should be tested before real-time shared navigation. Shareable state links and full synchronization can be evaluated separately later.

## 22. A Separate Mobile Experience

Mobile should eventually receive its own design process.

A promising direction is a tactile field-guide experience:

- Vertical cards and layered objects replace free camera movement.
- Folding, stacking, sliding, and haptic interactions communicate depth.
- The AI is thumb-accessible and context-aware.
- Product demonstrations are redesigned for touch.
- Discovery state and knowledge relationships remain shared with desktop.
- The visitor can resume their exploration without reproducing exact desktop geometry.

Mobile is not a near-term constraint on the desktop concept, but the content architecture should avoid making a later mobile design impossible.

## 23. Musical Identity As A Later Collaborative Track

A thoughtful musical identity is desired but should not be rushed into early versions.

It will require close collaboration with Mark to establish:

- Emotional purpose.
- Instrumentation.
- A motif or family of motifs.
- How themes transform across projects.
- How visual rhythm substitutes when sound is off.
- How often sound should occur.
- Which interactions deserve musical response.

There is no requirement that the motif contain four notes.

The early site should create clean integration points for sound and visual rhythm without committing to a final musical system prematurely.

## 24. Deferred Backlog

### Anti-Resume

A deeper layer about mistaken assumptions, failures, changed beliefs, and lessons remains interesting. It should wait until the main project stories are mature.

### Full Shared Navigation

Real-time guided sessions remain a later possibility.

### Public Graph View

A large visual knowledge graph is not committed. Semantic lighting, event connections, AI cards, and the skill-tree prototype should test whether a broader view is useful.

### Expanded Musical System

The final musical identity belongs after the core exploration system works.

## 25. Explicitly Not Planned

- Story Mode and Proof Mode.
- A required Resonance Engine metaphor.
- A Dream Inbox metaphor.
- A reading-heavy polyphonic timeline.
- A separate generic AI chat page as the only way to access AI.
- Repeated `Ask about this` buttons.
- A fixed linear tour.
- Time-availability questions.
- Website-template sales.
- A separate creative Lab duplicating project experiences.
- A Portfolio Album as the global site structure.
- A literal compass interface.
- Collectible badges or completion percentages.
- Self-rated skill percentages.
- Fake visitors or fake live activity.
- A text-first duplicate of every visual experience.
- Seamless scale changes as a core interaction principle.

## 26. Content And Data Architecture

### Existing Content

Continue using MD and MDX for authored content.

### Suggested Project Fields

- `lifecycle`
- `stableFoundation`
- `currentQuestion`
- `latestMeaningfulChange`
- `nextExperiment`
- `capabilities`
- `problems`
- `decisions`
- `lessons`
- `relatedTimelineIds`
- `relatedPostSlugs`
- `experienceId`
- `evidence`
- `hiddenDiscoveries`

### Suggested Timeline Fields

- `influencedProjectSlugs`
- `developedCapabilities`
- `changedBeliefs`
- `relatedArtifacts`
- `memoryRoomId`
- `hiddenDiscoveries`

### Suggested Offering Fields

- `type`
- `readiness`
- `audience`
- `experienceId`
- `purchaseUrl`
- `bookingUrl`
- `inquiryType`
- `relatedProjects`
- `requiredDisclaimer`

### Suggested Relationship Records

Each relationship should include:

- Source node.
- Relationship type.
- Target node.
- Authored explanation.
- Evidence source.
- Review status.
- Visibility rules.

## 27. Implementation Sequence

### Phase 1: Structural Foundation

- Establish the comprehensive content schema.
- Build reviewed knowledge-graph relationships.
- Add lifecycle and living-state support to projects.
- Replace the separate-chat assumption with a global AI architecture plan.
- Define persistent discovery state.
- Prototype the five-stage depth grammar with one object.

### Phase 2: Home And Navigation Foundation

- Build the one-time First Note.
- Implement remembered discovery and return behavior.
- Build the non-linear guided quick tour.
- Establish stimulation controls.
- Prototype semantic lighting with a few reviewed relationships.

### Phase 3: First Flagship Exhibit

- Build one complete project exhibit through all five depth stages.
- Recommended first candidate: LifeInbox or Sudoku Together, depending on which demonstration can be made convincing fastest.
- Validate product experience, exploded system, evidence, AI context, and persistent state together.

### Phase 4: Remaining Flagship Experiences

- Build Dreamlife's future-path experience.
- Build LifeInbox's entry autopsy.
- Build Sudoku Together's computer-participant session.
- Connect each to living state, knowledge relationships, and AI cards.

### Phase 5: About Depth

- Add event inspection and `What did this become?` connections.
- Prototype one memory room.
- Add meaningful personal and relational easter eggs.

### Parallel Feedback Gate: The Studio

This gate can open whenever Mark provides the needed feedback. It is not inherently later than the other phases.

- Remove or de-emphasize the existing template-sales direction.
- Define which offerings are actually ready.
- Build one strong experience for each ready path.
- Add honest readiness states and role-aware tour routing.

### Phase 6: Experimental Systems

- Prototype the evidence-built skill tree or evidence map.
- Add rare feedback invitations for evolving work.
- Test ambient anonymous presence.
- Develop the musical identity collaboratively.

### Phase 7: Future Expansion

- Design the independent mobile experience.
- Evaluate shareable states and shared navigation.
- Consider the Anti-Resume.
- Consider a broader public graph view only if prior graph-driven interactions prove useful.

## 28. Open Design Questions

These questions should be resolved through prototypes and continued feedback rather than abstract debate:

1. What physical interactions feel best for the site's exploration grammar?
2. What should the inactive AI presence look like?
3. Which project should become the first full-depth exhibit?
4. How should the site restore a returning visitor's location?
5. Which discoveries should remain exclusive to free exploration?
6. How should semantic lighting explain why two things are connected?
7. Does the skill tree help evaluation enough to become a main feature?
8. Which offerings in The Studio will be ready first?
9. What kinds of ambient presence feel alive without becoming distracting?
10. What emotional character should the later musical identity express?

## 29. Quality Standard

Every proposed feature should pass these tests:

- Does it reveal something true about Mark?
- Does it reward curiosity?
- Does it help visitors understand or experience the work?
- Does it fit the universal depth grammar?
- Does it connect to the knowledge graph where appropriate?
- Is it honest about what is live, complete, evolving, or unavailable?
- Does it preserve a calm path for visitors who do not seek immersion?
- Is its value greater than its technical and visual complexity?

The desired outcome is not merely an unusual portfolio.

It is a world where the unusual interaction is the clearest way to understand the person, the work, and the connections between them.
