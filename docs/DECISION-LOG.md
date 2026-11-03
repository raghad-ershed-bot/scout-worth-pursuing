# Decision log

How the build was reviewed and what I decided. All times are GST on 3 Nov 2026. The test scripts are in `tests/`.

## 18:08 · Code review (round 1)
I gave the core logic to ChatGPT for an independent review. It raised 8 issues. Before changing anything, I had each claim run against the live build.

| Finding | Result | Action |
|---|---|---|
| The agency you pick doesn't control the reply | Real: both agencies replied | Fixed |
| Edits to the message are lost when you change an option | Real | Fixed |
| A cluster shows "Fits" when one price is over budget | Real, but not triggered by the data | Fixed |
| The agent's cheque answer is always "Fits" | Real, only off the script | Fixed |
| #24's tenancy isn't compared with the move-in date | Real, minor | Fixed |
| Questions repeat; availability is re-asked; "All facts" misses availability | **Didn't reproduce** | Left alone |
| *Missed by the reviewer:* "Keep anyway" could show a conflicting home as Ready | Real | Fixed |

**Decisions:** fix what a user could hit first. Don't change working code to satisfy a wrong finding. Add a visible "Grouped and labelled, not removed · 0 confirmed misleading" section, because the brief asks for visible filtering and my audit found nothing to remove as fake. Keep "Send it myself" as the default, with the Scout route labelled as simulated.

**Learned:** a confident review is a hypothesis until something runs it.

## 18:15 · Round 2, then a provisional freeze at 18:20
- **"Keep anyway" became "Proceed despite conflict".** An overridden conflict is still a conflict, so it stays visible, and my decision is logged separately.
- **A month-only answer stays a month.** The round 1 fix had turned "until August 2027" into 31 August, which is the same kind of overclaim as calling an agent's listing "confirmed".
- Added two counterexample tests: 3 cheques against a minimum of 4 (a synthetic listing, since none in the audit has 3), and changing the cheque requirement after a reply. Both passed.

## 18:24 · Round 3 (documentation review), then the final freeze at 18:30
- **The end of a tenancy isn't handover.** A move-in after August is now Potential, and the agent is asked for the exact end and handover dates. I reopened the provisional freeze for this one fix because the previous result overstated what's known.
- **Search vs a flexible budget:** search filters on the starting budget, so "I could stretch" can't surface pricier listings. I chose to disclose it rather than change the build late.
- Tightened the documentation: which views show sources, what agent replies do and don't resolve, and which tests set values directly.

**Learned:** each round found a smaller overclaim. Scout can say what's stated and what's ruled out; anything not stated stays a question.

## 18:31 · Availability check (no code change)
Unknown availability and no reply never set a home aside, and the tests confirm this. **Gap:** an explicit "it's gone" from an agent isn't handled, and an injected test showed it as available. No scripted reply says it, so a user can't reach it. I documented the gap rather than reopen the build.

## 18:43 · Presentation pass (logic unchanged)
I wasn't convinced the prototype showed the idea, so I asked for a blunt review of the screens. The logic held up; the presentation didn't. Its headline "6 messages without Scout vs 5 with" sold a one-message saving based on an assumed baseline, disclaimers sat on every card, and the cards led with explanations. I approved wording and layout changes only:
- a summary of listings saved → homes → ready to enquire
- questions first on each card
- one prototype banner
- plain labels ("Listed 3 times")

Every outcome was re-tested and is unchanged.

## 20:00 · Pre-submission review (presentation and flow; rules unchanged)
I reviewed the prototype end to end the way a PF leadership room would, and benchmarked it against Better.com's Betsy (AI does the work, escalates when unsure, every interaction visible to a human) and my own earlier agent-workflow designs. Five gaps would have been challenged, so I closed them:
- **"Where's the AI?"** Listing pages now show *Scout read the description* (stated, not confirmed), and every reply shows *Scout read the reply* at the precision given. Both are labelled honestly: extracted by hand, or simulated.
- **"The searcher still does the work."** One approval, *Let Scout ask N agents for me*, sends only each card's questions (simulated) and brings the answers back. "Send it myself" stays available on every card.
- **"What does the agent see?"** The Scout route now previews the PF enquiry exactly as the agent would receive it.
- **No "aha".** The top of "Worth pursuing?" is now a Scout brief: what each agent said, and what changed.
- **"It doesn't look like it's inside search."** Search cards open Scout's check in-app. Before you save, it says it hasn't checked the home against your needs yet.

Two final touches: replies now read back as short structured fields (for example "Vacant: yes · per agency of #21", or "Tenanted until: August 2027 · month only"), and a "See what an agent receives" preview sits under the approve button. Search cards now show original building illustrations instead of empty photo boxes, labelled as illustrations; real listing photos stay on PF and are never copied.

No rule, data or outcome changed. Every test suite was re-run, including a new `tests/presentation-v2.js`.
