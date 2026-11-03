# Worth pursuing?
*A search assistant people can trust · Raghad Ershed*

**The answer.** The trust problem I found isn't fake listings; there were none in 30. It's that the page never tells a searcher which listings are worth a call *for them*, so they contact everyone, copies included. Scout should sit in Saved and give each saved home a next step, label every fact with who said it, and ask the agent only what decides it.

## 1. The problem behind the problem
I audited 30 live 1-bed listings in Bloom Towers, JVC (15 rent, 15 sale) and counted claims across all 208 there. Claude ran a second pass on the same checks ([AUDIT.md](AUDIT.md)).

- **No fakes, no bait.** 0 of 30 were clearly misleading, and every price outlier was *above* the market.
- **One flat, several listings.** 5 of the 15 sale listings were 2 flats, one at AED 960k and at 1.0M. All 5 were "Verified", because the badge checks documents, not copies.
- **Prices that don't compare.** Paid "Featured" holiday-home lets sat among yearly leases.
- **What decides it isn't on the page.** Availability was unknown for all 30. Listing age is capped at "more than 6 months", which hid one listed 23 months ago. And 104 of 208 listings say "high floor".

**Who gains, who pays.** Listings and placements earn PF money, and leads earn agents money, so copies and noise pay off. Searchers pay in time, and honest agents pay by competing with copies. Even Scout called an agent's "sea view" claim "confirmed". **What searchers want:** someone they can trust, who works only for them. Fewer listings would hide honest options. *Unproven:* how much time this costs, and whether it drives distrust. The test measures that.

## 2. The product, and where the AI sits
When you save a home, Scout asks only what changes your decision (budget firm? move-in date? cheques? live in or invest?). Each home then gets a **next step, never a score**: *Ready for viewing enquiry*, *Ask first* (1–3 questions), *Set aside* (with the reason), or *Proceed despite conflict*. Copies are grouped, never deleted, and nothing is called "fake" from the page alone ([RULES.md](RULES.md)).

**Rules decide; AI reads.** Rules keep every outcome explainable and testable. The AI reads descriptions for claims, drafts the questions, and turns agent replies back into facts, at exactly the precision given ("until August" stays a month). In this prototype that reading is done by hand, and replies are simulated.

## 3. Where it lives
It sits inside search, at the moments of intent, not on the homepage:

- **Results:** chips like "Also listed by 2 other agencies".
- **Save:** one question.
- **Saved → "Worth pursuing?":** the main screen.
- **Listing page:** "Ask with my questions", next to Call.

The shortlist, answers and agent threads belong to the account, so a reply arrives as an app notification and in the same thread on web.

## 4. Why use it, and when not to
Use it to stop messaging three agencies about one flat, to ask the question that decides it, and to see who said what. **Just call the agent** when you've found the one and speed matters, when you're negotiating, or when the deal is complex. "Send it myself" is the default.

## 5. Agents and revenue

- **Easier for agents:** leads arrive with the searcher's situation and real questions.
- **Harder:** they answer in writing, and an agency that prices its copy of a flat higher loses leads to the others. That pressure is intended.
- **Placement buys visibility, not a better assessment.**
- **Risk:** fewer raw leads look like worse ROI. **Response:** report *qualified* leads, with a guardrail on leads per paid listing.

## 6. Metrics
| Portal metric (my definition) | Effect | Roughly |
|---|---|---|
| **Leads:** enquiries per listing | Down | −5% to −20%: duplicate enquiries disappear (≤20% of sale listings were copies here, ≤5% of rentals) |
| **Lead quality:** leads that reach a viewing | Up | +10% to +25% relative. A guess the test checks |
| **Searcher success:** viewings per searcher | Up | The number below |
| **Agent value:** response time, retention, revenue | Guardrail | Must not get worse |

## 7. One number, the 1% test, and what would prove me wrong
**Viewings per searcher within 4 weeks of their first save.** It's an outcome, not a ratio: viewings per enquiry could rise just because people send fewer enquiries.

- **The test:** 1% of searchers who save 2 or more listings in one community get "Worth pursuing?". The control group keeps today's Saved tab. Run it for 4 weeks.
- **What would prove me wrong:** under 10% of exposed searchers open it; or viewings per searcher stay flat; or leads per paid listing fall faster than viewings rise.

## 8. What I couldn't build (priority order)
| # | Feature | Why it's needed | Why it isn't built |
|---|---|---|---|
| 1 | Real agent messaging, and AI reading the replies | Only asking confirms availability, price and terms | **PF connection** and agent consent. Simulated, and labelled |
| 2 | AI extraction of claims from descriptions | Sourced facts at scale | **Data and engineering:** the listing feed and an accuracy test. Done by hand here |
| 3 | An "unavailable" outcome | "It's gone" must never show as available | **Time.** Tested and documented |
| 4 | Automatic copy detection | Grouping thousands of listings | **Data:** original images; photo matching fails on rentals |
| 5 | Continuing across devices; the listing-page entry | Placement | **PF connection:** accounts and notifications. Listing-page entry cut at the freeze |
| 6 | Full lease cost, price outliers, a flexible budget that widens search | Real cost; "confirm the size", not "bargain" | **Data:** rarely listed. The flexible-budget gap is disclosed |

*1 and 2 are the product, 3 is correctness, 4 to 6 complete it.*

**How I worked.** I led it end to end: the audit, the problem, the rules, the decisions, and three review rounds of the build ([decision log](docs/DECISION-LOG.md)). Claude was a second pass on the listing checks, and it built and tested the prototype. ChatGPT reviewed the work. Where each was wrong is in [AI-LOG](AI-LOG.md).

[Prototype](https://raghad-ershed-bot.github.io/scout-worth-pursuing/) · [Repo](https://github.com/raghad-ershed-bot/scout-worth-pursuing) · [Supporting files](https://drive.google.com/drive/folders/1pHH4C9YdmlPQPbrNXoMPkbB_g3OvEQED)
