# Decision log

## 3 Nov 2026, 18:08–18:15 GST · Independent code review of the prototype

**What happened.** I gave the current implementation to a separate AI reviewer (ChatGPT). I pasted the source for `assess`, `membersOf`, `questionsFor`, `simulateReply` and the rendering they feed. It reported 8 issues as must-fix or material. Before acting on any of them, I had Claude run each claim against the running build, using a headless browser at 390px on the then-current `index.html`. I decided what to test and what to do with each result.

**What I learned.** A confident review is a hypothesis, not a result. Five of the eight findings were real, three weren't, and the reviewer missed one real bug. Reading the code is good for generating hypotheses, and here it also found real defects that the scripted data never triggers (2, 6 and 7). Runtime tests then establish whether a behaviour actually happens on the paths tested. Each of the three findings that didn't reproduce overlooked one relevant condition or loop: the queue filter in `questionsFor`, the `A.available` switch in `assess`, and `available` in the `vDetail` loop.

| # | Reviewer's claim | How it was tested (Claude ran each check at my direction) | Result |
|---|---|---|---|
| 1 | Scripted journeys queue the same questions repeatedly | Ran both scripted journeys and recorded every question sheet | **Not reproduced.** The renter got 4 questions and the buyer 3, each once. `questionsFor` ends with `q.filter(x=>!S.queue.includes(x))`, which drops anything already queued. No change. |
| 2 | A cluster shows "Fits" on budget when one price is above it | Read `assess`, then tested with the budget set in state (the UI budget is fixed) | **Real, but not triggered by the data.** Cluster B tops out at AED 1,000,000, which equals the budget. Fixed. |
| 3 | The agency you choose doesn't control the simulated reply | Chose only #19 for cluster B and sent | **Real.** Both #19 and #29 replied. Fixed. |
| 4 | Edits to the message are lost when you change an option | Typed into the draft, then changed the agency | **Real.** The draft went back to the generated text. Fixed. |
| 5 | Availability is asked again after the agent answered it | Sent #18, replied, then reopened the ask flow | **Not reproduced.** After the reply, the only question was "Could I view it this week?" (`assess` switches on `A.available`). No change. |
| 6 | An agent's cheque answer is always treated as "Fits" | Read `assess` | **Real, but only off the script** (the renter picks 6 or 12 cheques). Fixed. |
| 7 | #24's tenancy end isn't compared with the move-in date | Read `simulateReply` | **Real, minor.** A move-in of 1 Dec 2027 still showed "Potential". Fixed. |
| 8 | "All facts" leaves out the agent's availability answer | Opened "All facts" for #18 after its reply | **Not reproduced.** It shows "Still available (agent says)". The loop includes `available`. No change. |
| — | Not raised by the reviewer: keeping a property despite a conflict could show "Ready… Nothing in the listing conflicts" | Found by Claude while copying the code for the review | **Real.** Fixed. |

**Decisions**
- **Fixed 3, 4 and "Keep anyway" first,** because someone clicking through could hit them. Then fixed 2, 6 and 7, which are small and make the rules hold outside the script.
- **Left 1, 5 and 8 alone.** Claude's runs showed they work, and changing working code to satisfy a wrong finding adds risk without adding value.
- **Added a "Grouped and labelled, not removed · 0 confirmed misleading" section** to Worth pursuing? This answers the review chat's point that the brief requires visible filtering. It shows the duplicate groups and why they were grouped, keeps every original listing and price, labels holiday-home lets and flags reused photos. It also says plainly that the audit found no confirmed misleading listings, so nothing was removed as fake.
- **Kept "Send it myself" as the default.** "Let Scout ask for me" stays as the alternative, now labelled as simulated on the button as well as in the confirmation text.

**What I didn't know, and how I'd check.** The tests cover the paths listed above. Paths outside them (for example several flips in a row after replies) aren't tested. A short exploratory session by someone who hasn't seen the code would be the next check.

**Test results after the fixes** (headless Chromium at 390px, plus a width check at 360px; no page errors, no horizontal scroll). Where the UI doesn't offer an input, such as the budget amount, the tests change the value directly in the page state to check reassessment. Each case below says when it does this.
- **Keep anyway:** #7 after its reply goes from Set aside to **Ask first**, with "You chose to keep this despite a conflict" and the conflict itself. #5 with cheques set to firm goes the same way.
- **Agency choice (cluster B):**
  - asking #19 only gets 1 reply, from #19, and says #29's price isn't confirmed
  - asking #29 only is the same in reverse
  - asking both gets 2 replies, and says the answers still differ
- **Agency choice (cluster A):** the reply is attributed to whichever agency you picked (#25).
- **Edited message:**
  - the edit survives changing the agency and the send route
  - the WhatsApp link carries the edit
  - "Use Scout's draft again" resets it
  - the edited text is what gets sent
  - a new ask flow starts fresh
- **Conflicting cluster prices:**
  - budget 980k → Potential, Ask first
  - budget 950k → Conflict, Set aside
  - budget 1.0M → Fits
- **Cheques:**
  - minimum 4: the agent's "4" fits → Ready
  - minimum 6 flexible: the agent's "4" → Potential, Ask first; set to firm → Set aside
- **#24 tenancy (to August 2027):**
  - move in by 1 Feb 2027 (firm) → Set aside
  - move in by 1 Jun 2027 (flexible) → Ask first
  - move in by 1 Dec 2027 → Fits, Ready *(superseded in round 2 and again in round 3)*
- **Scripted journeys:** the outcomes are the same as before the fixes, both before and after the agent replies.

## 3 Nov 2026, 18:15–18:20 GST · Second review round, then a provisional freeze

**Reviewer's points, and what I decided**
1. **"Keep anyway" shouldn't turn into an ordinary "Ask first" or "Ready".** I agreed. A conflict the user overrides is still a conflict, and hiding it under a normal status would make Scout look surer than the facts. Kept properties now show **"Proceed despite conflict"** in the conflict colour. The conflict row stays visible, and the user's decision is recorded on its own line ("Your decision: proceed despite the conflict · You said · time") as well as in the change log. The summary counts them separately ("1 proceeding despite a conflict").
2. **A month-only tenancy answer mustn't become an exact date.** I agreed. The agent said "until August 2027", and the previous fix had turned that into 31 Aug 2027. Now:
   - **Move-in before August:** a conflict (if firm) or potential conflict (if flexible).
   - **Move-in from 1 August to 1 September:** **Unknown**, with the question "What is the exact date the tenancy ends, and when could I take handover?"
   - **Move-in after that:** fits, labelled "The exact date wasn't given" and "Agent-reported, not verified".
3. **Two counterexample tests** were added. Both passed without code changes, because the cheque comparison from the first round already handled them.

**What I learned.** The first-round fix for #7 traded one false sense of certainty for another. Inventing "31 August" from "August" is the same kind of mistake as calling an agent's claim "confirmed". Any rule that compares an agent's answer with a requirement should keep the answer as precise as it was given, no more.

**Tests** (headless Chromium at 390px; no page errors, no horizontal scroll):
- **Keep anyway:** #7 after its reply, and #5 with cheques set to firm, both show "Proceed despite conflict". The conflict row stays, the decision is recorded separately, and neither becomes Ready.
- **3 cheques when 4 are needed:** this uses a *synthetic* test listing, a copy of #15 with cheques set to 3, which exists only inside the test. No audited listing has 3 cheques. Flexible → Potential, Ask first. Firm → Conflict, Set aside.
- **Changing the cheque requirement after the agent replied** (#5, agent says 4; the minimum was changed in the page's state because the UI only flips firm/flexible):
  - need 4 → Fits, Ready
  - need 6, flexible → Potential, Ask first
  - need 6, firm → Conflict, Set aside
  - need 2 → Fits, Ready
- **Tenancy until August 2027:**
  - move in by 1 Feb, 31 Jul (firm) → Set aside
  - 1 Jun (flexible) → Ask first
  - 15 Aug or 1 Sep → Unknown, Ask first, with the exact-date question in the draft
  - 2 Sep or 1 Dec → Fits, with "exact date wasn't given" *(superseded in round 3: an unconditional Fits overstated what's known)*
- **Regression:** every first-round test (agency choice, edited messages, conflicting prices, cheques, tenancy) and both scripted journeys give the same results as before. The only intended difference is that kept properties now say "Proceed despite conflict".

**Provisional freeze at 18:20.** No more feature changes, only fixes for anything that would mislead a user. *(This freeze was reopened once, at 18:24, for the tenancy correction in round 3.)*

## 3 Nov 2026, 18:24–18:30 GST · Documentation review (round 3), then the final freeze

**Freeze chronology.** The 18:20 freeze was provisional. At 18:24 the documentation review found that the tenancy result overstated what's known, which is an accuracy problem rather than a feature gap, so I reopened the build for that one fix. The **final freeze was at 18:30**. Nothing else in the prototype changed in this round.

**Reviewer's points, and what I decided**
1. **The end of a tenancy isn't confirmed handover.** I agreed. "Until August 2027" says nothing about when the buyer could take possession. A move-in after August is now **Potential**: "No stated overlap… but the exact end date and the handover date aren't confirmed". It asks: "When exactly does the tenancy end, and when could I take handover?" This is the only change to the frozen prototype in this round, because the previous result overstated what's known.
2. **Search filtering vs a flexible budget.** I had Claude inspect the build before changing anything. Search filters on the persona's starting budget and ignores the firm/flexible answer, so saying your budget is flexible can't bring over-budget listings into search. That's reported separately for a decision, and nothing has changed yet.
3. **Documentation wording.** Corrected in HANDOFF.md:
   - source attribution is described accurately, rather than claiming "every fact" has a label
   - agent replies only update the information and agency they address
   - the message comparison's assumption is stated
   - the published artifact is kept separate from the GitHub deployment that's still to do
   - tests that change values directly are disclosed

**What I learned.** Each review round has found a smaller overclaim than the one before. First: "confirmed" from an agent's listing. Then: "31 August" from "August". Now: "handover" from "tenancy ends". The rule underneath them all is the same: Scout can say what's stated and what's ruled out, but whatever hasn't been stated stays a question.

**Tests** (frozen build md5 `54f8a091d6c4693f99e4fea059c801c0`; headless Chromium at 390px; no page errors, no horizontal scroll):
- **#24, tenanted until August 2027:**
  - move in by 1 Feb or 31 Jul (firm) → Set aside
  - 1 Jun (flexible) → Ask first
  - 15 Aug or 1 Sep → Unknown, Ask first
  - 2 Sep or 1 Dec → **Potential, Ask first**, with the handover question in the draft
- **Regression:** both scripted journeys and every earlier test give the same results as before.

## 3 Nov 2026, 18:31–18:35 GST · Availability rule check (documentation only; the build stays frozen)

**The rule.**
- Unknown availability, or no reply, never makes a property a conflict or sets it aside on its own. "Available now" is a separate row that doesn't block.
- An explicit answer from an agent that the property is unavailable must never be shown as available.

**What the frozen build does** (md5 `54f8a091d6c4693f99e4fea059c801c0`, tested with `tests/availability-check.js`):
- **#15 before any reply:** Ready for viewing enquiry, with "Available now: Unknown". Unknown doesn't block. ✓
- **#12, no reply:** stays Ask first (not Set aside), with "Available now: Unknown" and "No reply yet. That doesn't mean it's unavailable." ✓
- **#15, after the agent says it's still available:** "Available now: Fits", sourced to the recorded reply. ✓
- **An explicit "unavailable" answer: not handled.** No scripted reply says a property is unavailable, so a user can't reach this case. But when Claude injected "No longer available (agent says)" into the page state as a test, the row showed **Fits** and the property stayed **Ready**. The availability row treats any stored answer as available.

**Decision.** I didn't change the code, because the build is frozen and the case can't be reached in the prototype. I've documented it as a known limitation, with what a real build would need: a separate "unavailable" outcome that sets the property aside and says why, attributed to the agent who said it.

## 3 Nov 2026, 18:43–18:55 GST · Presentation pass (logic unchanged)

**Why.** Looking at the screens as a whole, the logic held up but the prototype undersold the idea. Its headline number, "6 generic messages without Scout vs 5 with Scout", advertised saving one message, and it rested on an assumed baseline. Disclaimers were repeated on every card, so the screens read like small print. Each card led with an explanation before the questions, and the journey card used audit numbers (#21, #25…) that a first-time visitor can't read.

**What changed.** Wording and layout only. No rule, data or outcome changed.
- **Shortlist summary:** the message comparison is replaced by listings saved → homes (copies grouped) → ready to enquire. Every number comes straight from the rules.
- **Cards:** the questions come first. The generic "One or two answers could change your decision" line is dropped from Ask first cards, while the reasons stay on Ready, Set aside and Proceed. Clusters are labelled "Listed 3 times" instead of "Cluster A".
- **Disclaimers:** one prototype banner, plus "Simulated" on every reply. The per-cluster "not automatic detection" note is removed; the Grouped section still says it.
- **Search:** the journey card says "Save the 6 listings Omar likes", with no audit numbers.
- **Footer:** now states the placement ("In the full product, this lives in Saved on web and app…").

**Tests.** Re-ran every suite on md5 `e7feabe5f4dea0f3c9b9429b88f450b7`. All next-step outcomes are identical to the 18:30 build. The two tests that read a card's explanation line were updated, because Ask first cards no longer show one. No page errors, no horizontal scroll at 360px or 390px.
