# AI log: confident wrong answers about UAE real estate, and how I caught them

I used three AI tools today: PF's own Scout (as the product under test), Claude (research and build), and ChatGPT (review). Each of them was confidently wrong at least once. The pattern behind most of them: **something a listing or an agent *states* gets turned into something *confirmed*, or a vague answer gets made precise.** Catching that pattern became the core rule of the product.

## Scout (PF's AI search, tested as a user)
**1. Dubai fees on a Ras Al Khaimah flat.**
- **What it said:** its cost breakdown for a RAK property used Dubai's bodies and fees: the DLD transfer fee and DEWA.
- **Why it's wrong:** those are Dubai bodies, and RAK has its own land registry and utility provider.
- **How I caught it:** I checked which emirate the listing was in. When I looked up RAK's actual transfer fee, the sources disagreed (2% + 2% vs 4%), so I recorded it as unresolved rather than swapping one guess for another.

**2. "Fair price" from two data points.**
- **What it said:** it called a price "fair", based on two asking prices for *smaller* units.
- **Why it's wrong:** asking prices aren't transaction prices, and smaller units aren't comparable.
- **How I caught it:** I asked what the verdict was based on and checked the comparables it used. This is why the product makes no "fair price" verdicts at all.

**3. "Direct sea view confirmed", and an outlier sold as a bargain.**
- **What it said:** comparing two projects (South Bay and Bay Residences), Scout wrote "Direct sea view confirmed: already listed as a feature". It called AED 1,071/sqft (against about 1,660 for comparable units) "exceptional value", said "same developer, no quality difference", and closed with "Ready to move forward?".
- **Why it's wrong:**
  - A feature the agent lists isn't confirmation.
  - A price that far off the pattern is a reason to check the stated size, not to celebrate.
  - The quality claim is an inference with nothing behind it.
- **How I caught it:** I traced each claim back to its source, and found the only source was the listing itself. This became the product's source labels (Listing / Agent's description / Agent says / Our check), and the outlier check in "What I couldn't build".

## Claude (helping me audit Bloom Towers)
**4. Holiday homes flagged as "missing permits".**
- **What it said:** #4 and #7 showed no Trakheesi permit link, so it flagged them as missing permits, and marked #7 "Misleading (likely stale)".
- **Why it's wrong:** both carry **DTCM holiday-home permits**. They're a different product (bills included, plus a booking fee, VAT, tourism tax and deposit), not unpermitted listings.
- **How it was caught:** my quality-control review questioned #7. Reopening both pages showed the DTCM permits and the full descriptions. I made holiday-home lets a product rule (R4).

**5. "37% of listings mention the Marina", read as view claims.**
- **What it said:** a building-wide count implied over a third of JVC listings claim Marina views.
- **Why it's wrong:** JVC isn't on the Marina. Most of those were *location* mentions ("near Dubai Marina"). Only 20 of 208 actually claim a view.
- **How it was caught:** in the quality-control pass, the count was redone, separating view claims from location mentions.

**6. A listing's age was out by a year.**
- **What it said:** #7 was "listed 5 Dec 2024 (11 months)".
- **Why it's wrong:** that's about 23 months. The page itself hides it behind "Listed more than 6 months ago".
- **How it was caught:** my quality-control review (ChatGPT as a second reader) flagged the arithmetic, and it was re-checked against the page's own listed date.

**7. "Until August 2027" became "31 August 2027".**
- **What happened:** when fixing the tenancy logic, Claude turned an agent's month-only answer into an exact end date, and then treated "tenancy ends" as "you can move in".
- **Why it's wrong:** a month isn't a date, and the end of a tenancy isn't handover.
- **How it was caught:** my review rounds caught it, one step at a time. I set the rule: keep the answer exactly as precise as it was given, and ask for the exact end date and handover date.

## ChatGPT (reviewing my code)
**8. Three confident bug reports that weren't real.** These aren't about real estate, but they matter for how I used AI.
- **What it said:** out of 8 "must-fix" findings, it claimed:
  - questions were asked repeatedly
  - availability was re-asked after the agent answered
  - "All facts" left out availability
- **What was true:** none of the three reproduced when we ran the build. Five of the eight were real and fixed. It also missed a real bug: "Keep anyway" could show a conflicting home as Ready.
- **How I caught it:** I had Claude run each claim against the actual build before changing any code. The full record is in [DECISION-LOG](docs/DECISION-LOG.md).

## What I took from it
- **AI is fluent about UAE specifics and confidently wrong about them,** especially with emirate-level rules (DLD vs RAK, Trakheesi vs DTCM) and anything that depends on a source.
- **I don't fix this with a better prompt.** I fix it with source labels, and with rules that only use facts that come with a source.
- **A review is a hypothesis, not a result,** until something runs it.
