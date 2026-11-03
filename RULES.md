# Rules: what Scout decides, and where each rule goes wrong

## The stance: Scout never calls a listing "fake"
The brief asks what makes the assistant call a listing likely fake. My answer is that **it shouldn't**, at least not from what's on the page. In the audit (30 listings, Bloom Towers, JVC), 0 met a reasonable bar for "misleading" on their own. Most of the first-pass suspicions turned out to have ordinary explanations once checked: holiday-home permits, shared marketing photos, keyword tag lists. A "likely fake" label would mostly have hit honest agents.

Instead, Scout **flags specific, sourced evidence** and lets the searcher decide:

| Flag | Evidence needed | Shown as | Never shown as |
|---|---|---|---|
| Same flat, several listings | Matching photos *and* the same tower and size (checked by hand for the prototype) | "Listed 3 times", with every agency and price kept | "Duplicate removed", or which price is real |
| Photos reused across different sizes | The same photo set on listings that state different sizes (#22/#23) | "Photos also used on another listing", flagged to check | Misleading, fake |
| Price isn't like-for-like | DTCM holiday-home permit; price includes bills (#4, #7) | "Holiday-home let · bills included", with the extras listed as unknown | Overpriced |
| Unsupported claim | A claim with no stated scope ("Lowest price in market", #16) | Not used as a fact | False |

**When Scout *would* say "likely misleading" (designed, not built):** only when an agent's own answer contradicts the live listing, never from the page alone. It shows "This listing doesn't match what the agent said", with the time and who said it. For example:
- the agent says the flat is gone, but the listing stays live for days
- the agent quotes a different price than the one advertised
- the agent offers a different unit in reply to an enquiry about this one

A price far *below* similar listings is a reason to **Ask first** ("Is this the price, and is it this unit?"), not a verdict. **When this is wrong:** the flat went this morning and the agent hasn't updated it yet, or the price changed honestly. **Hurts an honest agent.** Mitigation: it needs a repeated or lasting mismatch, and the listing stays visible with the agent's answer next to it.

**What gets a home on the shortlist (Ready for viewing enquiry):** nothing it states conflicts with what you need, and nothing you need is unknown, *except* current availability, which only an agent can confirm.

**What it does when unsure (R3):** it says what's unknown and why it matters to *you*, and asks one question. Missing information never counts against a listing.

## The rules
Each rule says what it does, what it must never conclude, an audit example, and **when it's wrong, and who gets hurt**.

### R1 · Fit check (your constraints vs the listing)
- **Does:** gives an outcome per constraint (Fits / Potential / Conflict / Unknown), each with its source. Then the next step: Ready, Ask first, Set aside, or **Proceed despite conflict** if you keep a home anyway. A conflict you override stays visible.
- **Must not conclude:** that the listing is bad, or that a term can't be negotiated.
- **Example:** #5 shows 1 cheque. You need 4 (flexible) → Ask first: "Would the owner accept 4?" If you need 4 and that's firm → Set aside.
- **Must not fire:** an investor and a tenanted flat → Fits.
- **When it's wrong:** the listing field is out of date or negotiable, so a good flat gets set aside. **Hurts the searcher and an honest agent.** Mitigation: the reason is always shown, you mark each constraint firm or flexible, and you can keep a home anyway.

### R2 · Confirmed copies of one flat
- **Does:** shows one card per flat, with every listing, agency and price.
- **Must not conclude:** which price is real, that any agent misled anyone, or that Scout detects copies automatically.
- **Example:** #19 (AED 960,000) and #29 (AED 1,000,000), the same flat. Scout asks "Which asking price is current?" and keeps both prices.
- **Must not fire:** same size and price, different photos (#5/#6, #8/#9/#10). These are different flats with the same layout, which is normal in a big building.
- **When it's wrong:** an agency reuses photos across different flats, so two real flats get merged. **Hurts honest agents** (their listing disappears into another) **and the searcher** (they lose an option). Mitigation: only confirmed groups, and every listing stays visible inside the card. Rent-side copies aren't grouped at all, because photo matching there is unreliable.

### R3 · The unknown that matters
- **Does:** when a fact you need is missing, or the sources disagree, it asks you one question or drafts one question for the agent.
- **Must not conclude:** that missing means bad.
- **Example:** #21, #25 and #26 are one flat. One description says vacant, and two don't say. Ask first: "Is it vacant, and could I move in by 1 Feb 2027?" One listing's "vacant" isn't carried across to the others.
- **Must not fire:** cheques for a buyer, or tenancy for an investor.
- **When it's wrong:** Scout asks about something you don't care about. **Hurts the searcher** (friction). Mitigation: it only asks about constraints you stated, and at most 3 questions per home.

### R4 · Price isn't like-for-like
- **Does:** labels the price basis (holiday-home let: bills included; booking fee, VAT, tourism tax and deposit extra, amounts not stated). If your budget is close, it's a Potential conflict.
- **Must not conclude:** overpriced, misleading, or a total cost Scout doesn't know.
- **Example:** #7, AED 80,000 against an 80,000 budget. Ask first: "What is the full yearly cost?"
- **When it's wrong:** the description's terms are out of date, so the listing looks more expensive than it is. **Hurts an honest agent.** Mitigation: a label, never a verdict.

### R5 · Ask the agent (an escalation, not a default)
- **Does:** drafts up to 3 questions that could change your decision. You send it yourself (the default), or let Scout ask (simulated in the prototype). For a flat listed several times, you choose which agency to ask.
- **Must not conclude:** that the answer is verified.
- **When it's wrong:** the agent's answer is wrong, slow or missing. **Hurts the searcher.** Mitigation: every answer is labelled "Agent says · time", and calling the agent directly is always an option.

### R6 · Agent answers keep their precision
- **Does:** updates only the facts and the agency the answer addresses. A month stays a month.
- **Example:** #24 is "tenanted until August 2027".
  - Move-in before August → Conflict (firm) or Potential.
  - Move-in near the end of August → Unknown.
  - Move-in later → **still Potential**, because the end of a tenancy isn't confirmed handover. It asks for the exact date.
- **When it's wrong:** being strict can ask one question too many. **Hurts the searcher** (one extra question). That's a cost I'd rather pay than false certainty.

### R7 · Availability
- **Does:** "Available now" is always shown separately. Unknown availability, or no reply, never sets a home aside on its own.
- **Known gap:** an explicit "it's gone" from an agent must set the home aside. **The prototype doesn't handle this:** no scripted reply says it, and a test shows the build would display it as available. This is documented, not hidden.
- **When it's wrong:** a home that's already gone stays on the list. **Hurts the searcher** (a wasted viewing request) **and the agent** (a pointless lead).
