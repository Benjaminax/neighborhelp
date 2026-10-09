# NeighborHelp — Final Product Design

## Project overview

NeighborHelp is a responsive local-services marketplace concept for connecting people in Accra with nearby people who can help with everyday tasks. This project combines a product website, a searchable helper directory, supporting information pages and an interactive request prototype.

## The problem

Finding dependable help for practical needs—such as a home repair, tutoring, technology setup or errands—often depends on scattered recommendations and informal contacts. People need a clearer way to discover nearby providers, compare useful details and decide whom to contact. Skilled local providers need a simple way to introduce their services to people in their neighborhoods.

This is a product-design problem statement and working hypothesis; it should be validated with local residents and providers before a production launch.

## Target users

- **Residents looking for help:** Accra residents who need an everyday service, want to compare options quickly and value proximity, ratings and clear starting prices.
- **Independent local providers:** Skilled people and small businesses who want to present their service and neighborhood, build trust and receive introductions to potential clients.

## Proposed solution

NeighborHelp brings local discovery into one place. Residents can browse by category, search by provider/service/neighborhood, sort by distance, price, rating or experience, and switch between image-led cards and a compact list. Provider cards surface the decision-making details—service, neighborhood, rating, completed jobs, distance and starting price—before a resident opens a profile and drafts an introduction request.

The product also explains how the marketplace works, shares neighbor reviews, offers a helper-interest form and provides a contact path. Each supporting page includes tailored guidance and FAQs, with clear next steps for residents and providers. The interface is an interactive front-end prototype: forms demonstrate validation and confirmation states but do not send or store data.

## Main user flow

1. **Discover:** Arrive on the home page and understand the service, location and value proposition.
2. **Browse:** Choose “Find help,” select a service category or search a name, service or neighborhood.
3. **Compare:** Review provider photos, locations, ratings, jobs completed, distance and starting prices; change sorting or switch to list view.
4. **Request:** Open a provider profile, enter a short description of the task and submit the request preview.
5. **Confirm:** See a clear completion state that explains this prototype has not sent a real request.

**Flow at a glance:** Home → Find help → Search/filter → Provider card → Provider profile → Request details → Confirmation.

### Supporting flows

- **Become a helper:** Home or navigation → Become a helper → Enter name, skill, neighborhood and email → Prototype confirmation.
- **Contact the team:** Navigation/footer → Contact → Enter contact details and topic → Prototype confirmation.
- **Contact from the directory:** Find help → Contact helper → Helper name is carried into the contact screen → Write a message → Prototype confirmation.
- **Learn and build trust:** Navigation/footer → How it works, Reviews, About or Trust & safety.
- **Choose a role:** Home → Find a nearby helper or explore the helper application, depending on whether the visitor needs or offers a service.

## Navigation and screens

| Screen | Purpose | Key actions |
| --- | --- | --- |
| Home (`/`) | Introduce NeighborHelp and surface providers, reviews and service information | Search, category filter, grid/list toggle, open profile, navigate to directory or helper application |
| Find help (`/find-help`) | Full provider directory | Search, filter, sort, switch view and contact a helper |
| Reviews (`/reviews`) | Social proof through neighbor stories | Read reviews and continue exploring |
| How it works (`/how-it-works`) | Explain discovery, comparison and introductions | Navigate to directory or provider onboarding |
| Become a helper (`/become-a-helper`) | Explain provider value and collect interest details | Complete a required-field application form |
| Contact (`/contact`) | Provide support/contact information and message form | Select a topic and submit a required message |
| About / Trust & safety (`/about`, `/safety`) | Explain the local-first product and decision-making guidance | Continue to directory and other information pages |

The primary navigation prioritizes discovery and participation; footer links provide a secondary route to company, trust and contact information. Unknown URLs show a page-not-found state with routes back to the directory or home.

## Final UI and design system

- **Visual direction:** Warm off-white surfaces, charcoal panels, black type and a lime accent create a recognizable system while keeping provider information legible.
- **Typography:** Inter Tight supports interface and body text; Clash Grotesk is used for display headings and selected calls to action. Headings use tight tracking and compact leading; labels use small uppercase text with expanded tracking.
- **Spacing and layout:** Utility-based spacing follows a consistent compact card rhythm with wider section spacing. Content is constrained to a shared maximum width; cards use borders, restrained shadows and clear grouping.
- **Components:** Brand mark, primary and secondary buttons, navigation links, category filters, grid/list toggles, provider cards, rating/price metadata, provider dialog, forms, status messages, review cards, route-specific guidance cards, FAQ disclosures and footer link groups.
- **Responsive behavior:** Sections stack on small screens; provider grids reduce columns; directory controls wrap; cards and forms remain full width; mobile navigation collapses to a menu; map labels scale down. Layouts expand into multi-column compositions at tablet/desktop breakpoints.
- **Accessibility:** Semantic headings, labels (including screen-reader labels for visually minimal forms), descriptive profile-image alt text, native required/email validation, live announcements for confirmations, visible keyboard focus styles, dialog labeling, Escape/outside-click close behavior and scroll locking.

## Empty and error states

- A search with no matches displays “No helpers found,” suggests trying a different query and offers a clear-filters action.
- Required fields and email formats use native browser validation before submission.
- Successful prototype submissions show a live status message and explicitly state that information was not transmitted or stored.
- Unknown routes provide a not-found explanation and recovery links.

## Key design decisions

1. **Lead with practical trust signals.** Location, rating, completed jobs, price and distance are visible during comparison, rather than hidden behind a profile.
2. **Offer two scanning modes.** Photos support quick recognition in grid view; the list view is intentionally compact and remains photo-free.
3. **Keep the primary flow short.** Search and category filtering are available early, while the request dialog asks only for a short task description.
4. **Make the prototype boundary explicit.** Confirmation screens demonstrate the intended state without implying a live booking, payment or message delivery.
5. **Avoid imposing platform payments.** The product facilitates an introduction; scope and pricing are discussed directly between neighbors.

## Handoff and validation notes

Before production, validate the problem and language with residents and providers in Accra; test findability, trust cues and request completion on mobile; confirm provider verification and review policies; and define privacy, consent, notification, moderation and payment expectations. Replace prototype submissions with secure backend workflows, source real provider data and consented photography, and provide graceful failure handling for external map tiles and image assets.
