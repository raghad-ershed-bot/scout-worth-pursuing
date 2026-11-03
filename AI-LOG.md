# AI log: confident wrong answers about UAE real estate

I used Scout (as the product under test), Claude (as a second pass on the audit, and to build) and ChatGPT (as reviewer). Most of their mistakes followed one pattern: something *stated* got treated as *confirmed*, or a vague answer was made precise. That pattern became the product's core rule.

## Scout
1. **Dubai fees on a Ras Al Khaimah flat.** It costed a RAK property with the Dubai Land Department fee and DEWA. Those are Dubai bodies. *Caught:* I checked the emirate. RAK's transfer fee is unresolved because the sources disagree (2% + 2% vs 4%), so I left it open rather than guess.
2. **"Fair price" from two smaller units.** Two asking prices for smaller flats aren't comparables. *Caught:* I asked what the verdict rested on. The product makes no fair-price verdicts.
3. **"Direct sea view confirmed."** The only source was the agent's own listing. In the same answer it called AED 1,071/sqft (against about 1,660 for comparable units) "exceptional value" and closed with "Ready to move forward?". *Caught:* I traced each claim to its source. This led to the source labels and to the outlier check in "what I couldn't build".

## Claude
4. **Holiday homes flagged as "missing permits".** #4 and #7 have DTCM holiday-home permits, not Trakheesi links. *Caught:* in my quality-control review of #7. They became rule R4.
5. **"37% mention the Marina", read as view claims.** JVC isn't on the Marina; only 20 of 208 claim a view, and the rest mention it as nearby. *Caught:* when the count was redone in the quality-control pass.
6. **#7 "listed 11 months ago".** It was about 23 months; the page only says "more than 6 months". *Caught:* in my quality-control review, then re-checked against the page's listed date.
7. **"Until August 2027" became 31 August, then "you can move in".** A month isn't a date, and the end of a tenancy isn't handover. *Caught:* over two of my review rounds. The rule now keeps answers as precise as they were given.

## ChatGPT
8. **Three bug reports that didn't reproduce** (not real estate, but relevant). It made 3 of its 8 code findings with confidence, and none held up when the build was run. It also missed a real bug. *Caught:* I had every claim run against the build before any code changed ([decision log](docs/DECISION-LOG.md)).

**Takeaway:** AI is fluent about UAE specifics (DLD vs RAK, Trakheesi vs DTCM) and confidently wrong about them. The fix isn't a better prompt. It's showing the source of every fact, and rules that only act on facts that have one.
