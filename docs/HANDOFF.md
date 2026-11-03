# Implementation handoff: frozen state

**Final freeze at 18:55 GST on 3 Nov 2026.** The logic was frozen at 18:30, after two rounds of independent code review and one round of documentation review. (A provisional freeze at 18:20 was reopened once, at 18:24, for the tenancy correction.) A presentation-only pass at 18:45–18:55 changed wording and layout, not logic, and every test was re-run.
- **Build:** `index.html`, md5 `53c20d5349d98d5a33699835a26b7bab` (after the 20:00 pre-submission presentation pass; rules unchanged). Running `build.py` rebuilds it byte for byte from `src/template.html` and `data/listings.json`.
- **Published:** the same file is in this public repo, served by GitHub Pages at https://raghad-ershed-bot.github.io/scout-worth-pursuing/, and also published as a shared claude.ai artifact (version 7).
- **Tests:** everything in `tests/` passes on this exact file (md5 above). There are no page errors and no sideways scrolling at 360px or 390px.
- **History:** the review findings, how each one was tested, and what changed are in `docs/DECISION-LOG.md`.

## 1. What it is
Two scripted journeys: a renter, **Sara** (furnished, up to AED 80,000 a year), and a buyer, **Omar** (up to AED 1,000,000). Each one goes:
1. Search.
2. Save listings.
3. Scout asks a few questions, only when a saved listing makes the answer matter.
4. **"Worth pursuing?"** gives each saved home a next step and a reason:
   - **Ready for viewing enquiry**
   - **Ask first**, with the specific questions to ask
   - **Set aside**
   - **Proceed despite conflict**, when you choose to keep a home that conflicts with what you need
5. You ask the agent: send it yourself (the default), or let Scout ask (simulated).
6. Replies come in, the affected next steps update, and a log shows what changed and why.

There's no score anywhere. Assessment findings and the "All facts" view are labelled or grouped by source: Listing / Agent's description / Our check · 3 Nov 2026 / Agent says · Simulated / You recorded · Simulated / You said / Unknown. Agent statements, what you told Scout, and Scout's own checks are kept apart. Search cards show listing fields (price, size, furnishing, agency, listing age) the way a listing page does, without a source label on each one.

## 2. What's implemented

| Area | Behaviour | Where in `src/template.html` |
|---|---|---|
| Start | Pick a persona; table of what's real, simulated and not built | `vStart` |
| Search | PF-style cards, filtered by the persona's budget (and furnished, for the renter). Chips: "Also listed by N other agencies", "Holiday-home let · bills included", "Photos also used on another listing". Cards link out to PF. | `vSearch`, `cardSearch` |
| Progressive questions | One question at a time in a bottom sheet, each asked once, with a scripted default and a firm/flexible toggle. **Renter:** budget firm?, move-in, cheques (only if a saved listing shows ≤2 or doesn't say), holiday homes OK? (only if one is saved). **Buyer:** budget firm?, purpose, move-in (only if living in it and the listing doesn't say vacant). | `questionsFor`, `openQuestion` |
| Assessment | For each property: rows of Fits / Potential / Conflict / Unknown, each with a source. **Next step:** any conflict → Set aside, or **Proceed despite conflict** if you kept it (the conflict stays visible). Otherwise a blocking Potential or Unknown → Ask first. Otherwise → Ready. "Available now" is never blocking. At most 3 questions per property. | `assess` |
| Budget on clusters | All prices over budget → Conflict (firm) or Potential. **Some over** → Potential, plus "Which asking price is current?". All within → Fits. | `assess` |
| Duplicates | Cluster **A** (#21/#25/#26: AED 949,999 / 950,000 / 950,000) and **B** (#19/#29: AED 960,000 vs 1,000,000) each show as one property, with every listing and price visible. In A, prices within 0.5% of each other count as the same, and "which is current" is a non-blocking Unknown. | `assess`, `membersOf` |
| **"Grouped and labelled, not removed · 0 confirmed misleading"** | In Worth pursuing?. Shows the duplicate groups (agency and price of each listing, why they were grouped), the holiday-home labels, and #22/#23 flagged to check. States that the audit found no confirmed misleading listings, so nothing was removed as fake, and that duplicates were matched by hand. | `vGrouped` |
| Availability | "Available now" is always a separate, non-blocking row. Unknown availability or no reply never sets a property aside or makes it a conflict on its own. An agent saying it's still available shows as Fits, sourced to that reply. **An explicit "unavailable" answer isn't supported** (see limitation 9). | `assess` |
| Cheques | Compares the listing's stated cheques, or the agent's numeric answer, with your minimum, so changing your requirement after a reply re-checks it | `assess` |
| Tenancy (buyer) | The agent's month-only answer ("until August 2027") is stored as a month, never as an exact date. Move-in before August → Conflict (firm) or Potential. 1 Aug–1 Sep → **Unknown**, asking for the exact end and handover date. Later → **Potential**: no stated overlap, but the exact end date and handover date aren't confirmed, so it asks for them. | `assess` |
| Keep anyway | Turns Set aside into "Proceed despite conflict" (still in the conflict colour). The decision is recorded on its own line with a time, in the log and in the summary counts. | `cardSaved`, `data-keep` |
| Detail | "All facts": every fact grouped by source, with links to each PF listing | `vDetail` |
| Ask flow | For clusters, choose who to ask (B: one agency or both). An editable draft that **keeps your edits** when you change options, with "Use Scout's draft again". **Send it myself** (default): Copy, plus a `wa.me` link with no number. **Let Scout ask for me · simulated**: a consent screen saying nothing is sent. | `vAsk` |
| Simulated replies | Hard-coded for each listing, and they follow the agency you chose. Source label: "Agent says" (via Scout) or "You recorded the agent's reply" (sent yourself) · device time · Simulated. | `simulateReply` |
| Answers and log | The reply thread, and how each step changed, with the reason | `vAnswers`, the log in `vSaved` |
| Summary | A headline count for each next step, plus a strip showing listings saved → homes (copies grouped) → ready to enquire. Every number comes from the rules, applied to the persona's answers. (The earlier "messages without vs with Scout" comparison was removed in the presentation pass because it rested on an assumed baseline.) | `vSaved` |

**Scripted replies**
| Listing | Simulated reply | Result |
|---|---|---|
| #5 | Available, accepts 4 cheques, viewing Thursday | Ready if you need ≤4 cheques; otherwise Ask first (flexible) or Set aside (firm) |
| #7 (holiday home) | The extras take the total above AED 80,000 | Set aside (firm budget) |
| #12 | No reply | Stays Ask first ("no reply doesn't mean unavailable") |
| #15 / #18 | Available, viewing Saturday / Sunday | Ready |
| Cluster A | The agency you chose says vacant; the other listings don't say. Worded as one agency's statement. | Ready |
| Cluster B | Only the agencies you asked reply. Both: prices still differ (non-blocking). One: that agency's price, and the other "wasn't asked, not confirmed". | Ready |
| #24 | Tenanted until August 2027 | Depends on your move-in date (see Tenancy above). Never Fits for living in, because handover isn't confirmed. |

Agent replies update the assessment only for the information and the agency they address. They don't independently verify the claim, and they don't resolve what other agencies' listings say. For example, in cluster A one agency's "vacant" isn't carried across to the other listings, and in cluster B different answers stay different.

## 3. Test coverage (all pass on the frozen file)
- `tests/journeys.js`: both scripted journeys before and after replies, plus switching the buyer to investing.
  - **Renter:** #15 Ready; #5, #12, #7 Ask first. After replies: #15 Ready, #5 Ready, #12 Ask first, #7 Set aside.
  - **Buyer:** A, B, #24 Ask first; #18 Ready. After replies: A Ready, B Ready, #24 Set aside, #18 Ready.
  - **Investor:** #24 Ready.
- `tests/renter-check.js`: the renter's starting state, the cheques flip, width at 360px.
- `tests/review-fixes.js`: Keep anyway, choosing the agency (B: 19 / 29 / both; A: 25), preserving draft edits, conflicting cluster prices (budget set in state), cheques at 4 and 6, tenancy at three move-in dates, and the grouped section for both personas.
- `tests/availability-check.js`: unknown availability doesn't block (#15 Ready); no reply stays Ask first (#12); an agent's "still available" shows as Fits; an injected "unavailable" answer shows the limitation.
- `tests/review-round2.js`: Proceed despite conflict; a **synthetic** 3-cheque listing against a minimum of 4 (exists only inside the test); changing the cheque requirement after a reply; tenancy at seven move-in dates, including the August boundary and after August (Potential, with the handover question).
- Some tests change the page's state directly where the UI doesn't offer the input (the budget amount, the cheque minimum after a reply, move-in dates outside the three options). The tests mark where they do this.

## 4. Known limitations (accepted for submission)
1. **Listing view from search** opens Scout's check in-app (added in the 20:00 pre-submission pass). The full PF listing page itself isn't rebuilt; cards still link out to it.
2. **Search filters by budget (and furnished, for the renter).** The subtitle shows the filter, but doesn't list what was left out.
3. **Standard-lease costs aren't modelled:** deposit, agency fee and Ejari only appear as unknowns for holiday-home lets.
4. **Nothing is saved:** state is lost on reload, and there's no continuity across devices.
5. **Scripted journeys:** two personas with fixed saved lists, replies hard-coded for each listing, and duplicates matched by hand rather than detected.
6. **Inputs:** the prototype's UI doesn't let you edit the budget amount or the cheque minimum after a reply, and it offers only three move-in dates. The tests change these values directly in the page state to check reassessment.
7. **Things a reviewer may flag:**
   - Simulated reply times use the device clock, but every one is labelled "Simulated".
   - The prototype uses the name "Scout", under a "Not a Property Finder product" banner.
   - The WhatsApp link has no number, on purpose.
   - Accessibility hasn't been audited, and dark mode was last checked visually at an earlier build.
8. **Untested paths:** several flips in a row after replies, proceeding and then getting a reply, and the detail view for every listing.
9. **No "unavailable" outcome.** No scripted reply says a property is unavailable, so a user can't reach this case. But the availability row treats any stored answer as available: an injected "No longer available" answer showed as Fits and the property stayed Ready (`tests/availability-check.js`). A real build needs a separate outcome that sets the property aside with the agent's reason and attribution.

## 5. Outside the prototype (not code)
- AUDIT.md row #2 now says PF labels it "Direct From Developer" (also recorded in the audit's corrections log).
- The submission docs (README, ONE-PAGER, RULES, AI-LOG) are in the repo root.

## 6. Not in this package
Old test scripts that target selectors that no longer exist, an outdated intermediate copy of the view code, screenshots from earlier builds, and my personal working notes. The project has no secrets, credentials or environment files.
