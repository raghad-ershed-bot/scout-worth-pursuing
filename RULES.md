# Rules: what Scout decides, and where each rule goes wrong

## Scout doesn't call listings "fake"
The brief asks what makes the assistant call a listing likely fake. From the page alone, it shouldn't. In my audit, 0 of 30 listings were clearly misleading, and most first-pass suspicions had ordinary explanations: holiday-home permits, shared marketing photos, keyword tag lists. A "likely fake" label would mostly have hit honest agents. So Scout flags specific evidence and leaves the decision to the searcher.

| Flag | Needs | Shown as | Never shown as |
|---|---|---|---|
| One flat, several listings | Matching photos plus the same tower and size (matched by hand for the prototype) | "Listed 3 times", with every agency and price kept | "Duplicate removed", or which price is real |
| Photos reused across different sizes | The same photos on listings with different stated sizes (#22/#23) | "Photos also used on another listing" | Misleading |
| Price isn't like-for-like | A DTCM holiday-home permit, bills included (#4, #7) | "Holiday-home let · bills included" | Overpriced |
| Unsupported claim | A superlative with no scope ("Lowest price in market", #16) | Not used as a fact | False |

**When Scout *would* say "likely misleading" (designed, not built):** only when an agent's own answer contradicts the live listing. For example, the agent says the flat is gone but it stays listed, or quotes a different price, or offers a different unit. A price far *below* comparables means "Ask first", not a verdict. *Wrong when* the flat went this morning or the price changed honestly. **That hurts an honest agent**, so the rule needs a mismatch that lasts, and the listing stays visible with the agent's answer beside it.

**On the shortlist (Ready for viewing enquiry):** nothing conflicts with what you need, and nothing you need is unknown except current availability, which only an agent can confirm.

**When unsure:** say what's unknown and why it matters to *you*, then ask one question. Missing information never counts against a listing.

## The rules
| Rule | What it does | Never concludes | Wrong when, and who's hurt |
|---|---|---|---|
| **R1 Fit check** | Gives an outcome per constraint, with the source, then a next step: Ready, Ask first, Set aside, or Proceed despite conflict. *Example:* #5 shows 1 cheque against your 4 (flexible), so Ask first. Firm, so Set aside | That the listing is bad, or that a term can't be negotiated | The field is out of date or negotiable, so a good flat is set aside. **Hurts the searcher and an honest agent.** The reason is always shown, you mark constraints firm or flexible, and you can proceed anyway |
| **R2 Confirmed copies** | One card per flat, with every listing and price. *Example:* #19 (AED 960k) and #29 (1.0M): "Which price is current?" | Which price is real, or that an agent misled anyone | Reused photos merge two real flats. **Hurts honest agents and the searcher.** Only confirmed groups are merged; rentals aren't grouped, because photo matching is unreliable there |
| **R3 The unknown that matters** | Asks you, or drafts one question for the agent. *Example:* one listing of a flat says vacant and two don't, so it asks; vacancy isn't carried across | That missing means bad | It asks about something you don't care about. **Hurts the searcher** (friction). It only asks about constraints you stated, at most 3 per home |
| **R4 Price isn't like-for-like** | Labels the price basis. *Example:* #7 at AED 80k against an 80k budget, before unstated extras: Ask first | Overpriced, or a total Scout doesn't know | The description's terms are out of date. **Hurts an honest agent.** It's a label, never a verdict |
| **R5 Ask the agent** | Up to 3 questions that could change the decision. You approve every send: one tap lets Scout ask (simulated), or you send it yourself | That the answer is verified | The answer is wrong, slow or missing. **Hurts the searcher.** Every answer is labelled "Agent says · time", and you can always call |
| **R6 Answers keep their precision** | "Until August 2027": before August is a conflict; near the end of August is unknown; after is still Potential, because the end of a tenancy isn't handover | An exact date that wasn't given | It asks one question too many. **Hurts the searcher**, and that's a cost I'd rather pay than false certainty |
| **R7 Availability** | Shown separately. Unknown availability or no reply never sets a home aside. **Gap:** an agent's explicit "it's gone" isn't handled in the prototype | That no reply means it's gone | A gone flat stays listed. **Hurts the searcher and the agent** |
