# SPEC: Scout "Worth pursuing?" prototype

Build handoff. Evidence lives in AUDIT.md and RESEARCH-INSIGHTS.md. Data lives in `listings.json`.

Every capability below is tagged with one of four statuses:
- **[Real]:** real data (Bloom Towers listings checked on 3 Nov 2026)
- **[Built]:** logic the prototype actually runs
- **[Simulated]:** scripted, and labelled as simulated in the UI
- **[Not built]:** described only

## 1. Product thesis
Search helps people find listings. Scout should help them decide **which properties are worth their next step**. It checks each property against the person's own circumstances, shows where every fact comes from, and asks the agent only when an unknown could change the decision.

## 2. The decision Scout changes
**"What should I do next about this property: contact the agent, ask one question first, or set it aside?"**

Scout's output is a **next step with a reason**, never a score:

| Next step | When | Shown with |
|---|---|---|
| **Ready for viewing enquiry** | No conflicts and no decision-relevant unknowns. **This doesn't mean it's available.** The listing's stated "available from" date is shown separately, and current availability stays `Unknown` until an agent answers | "Ask about a viewing" |
| **Ask first** | A potential conflict or an unknown that could change the decision | The exact question(s) |
| **Set aside** | A conflict with a constraint the user said is firm | The reason. Reversible with one tap ("Keep anyway") |

**This is the essential requirement.** The prototype must show the user's next action changing. Any before/after counts in the prototype are an **illustrative, scripted scenario**, not measured behaviour or a proven outcome:
- **Before Scout:** the user would contact every saved listing with a generic "Is this available?"
- **After Scout:** they contact fewer agents, with sharper questions, and set aside listings for stated reasons.
- **After a (simulated) agent answer:** the next step updates, and a change log says why.

This is also how the prototype meets the brief's "removes listings likely to be misleading, explains why, gives a short list they can trust". Scout **removes** in two ways:
1. It collapses confirmed duplicate copies into one property.
2. It sets aside listings that conflict with what the user says is firm, always with the reason.

It does **not** call any listing fake. The audit found none that met that bar, and the UI should say so plainly when asked.

## 3. Information model

**A. User constraints.** "You said". Collected one at a time, only when a listing makes them decisive. Reused once known. Never inferred.

| | Reused from the search (never asked again) | Asked one at a time, only when a saved listing makes it decisive | Each constraint carries |
|---|---|---|---|
| **Renter** | Max yearly rent (price filter) · furnishing (filter) | Move-in date (at first save) · Minimum number of cheques they need (when a saved listing shows 1–2 cheques, or the field is empty) · OK with bills-included / holiday-home lets? (when one is saved) | `firm` or `flexible`, asked with the constraint |
| **Buyer** | Max price (price filter) | Live in or invest (at first save) · Latest move-in date (when the user lives in and a saved listing is tenanted or doesn't say) | `firm` or `flexible` |

Financing (cash or mortgage, eligibility) is **not collected** in the prototype; see Excluded scope.

**B. Facts, each with a source label**

| Source label shown | Meaning | Example |
|---|---|---|
| `Listing` | A structured PF field | price, size, cheques, available-from date, Verified |
| `Agent's description` | Free text written by the agent | "Tenanted", "bills included", "high floor" |
| `Our check · 3 Nov 2026` | Established in the audit | the duplicate clusters |
| `Agent says · [date, time] · Simulated` | An answer to a question | "Owner accepts 4 cheques" |
| `Unknown` | Not established | live availability, fee amounts, tenancy end date |

**Rules for sources:**
- An agent's statement is **never** shown as verified.
- A missing fact is **never** treated as a bad one.
- Unknown fees are **never** added to a cost.
- What the agent's description says counts as **stated, not confirmed**, and is shown with that label. Silence (the description doesn't mention it) is `Unknown`, not a contradiction.

**C. Outcome per constraint:** `Fits` · `Potential conflict` · `Conflict` · `Unknown`.
- **Conflict:** a listing fact contradicts a **firm** constraint.
- **Potential conflict:** the fact contradicts a **flexible** constraint, **or** an unknown could resolve it either way (e.g. tenanted, end date unknown).
- **Unknown:** the fact needed to judge the constraint is missing.

## 4. Rules
**No rule labels a listing "fake".** The audit found none that met that bar. Scout surfaces specific, sourced evidence instead. When Scout isn't sure, R3 applies: it says what's unknown and why it matters, and never penalises the listing.

| | **R1 · Fit check** | **R2 · Confirmed duplicates** | **R3 · The unknown that matters** | **R4 · Price isn't like-for-like** | **R5 · Ask the agent** |
|---|---|---|---|---|---|
| **Trigger** | A saved listing is checked against the user's constraints | A saved or visible listing belongs to a **confirmed audit cluster** | A fact needed for one of the user's constraints is `Unknown`, or its sources disagree | The price basis differs from a standard yearly lease or resale price | The next step is "Ask first" and the user taps "Ask" |
| **Inputs** | Constraints + listing fields | `duplicate_cluster` in listings.json | Constraints + listing | `price_basis` and `note` in listings.json | Questions from R1, R3 and R4 + consent |
| **Scout does** | Gives an outcome per constraint, with the source, then the next step | Shows one property card: "Listed by 3 agencies", with each agency's price and an evidence note. In search results only a subtle chip: "Also listed by 2 other agencies" | Asks the user one question **or** drafts the one question for the agent | Labels the basis ("Holiday-home let: bills included; booking fee, VAT, tourism tax and deposit extra, amounts unknown") | Two paths (section 7) |
| **May conclude** | "As advertised, this doesn't meet your firm X" | "Our check found these are the same flat (same photos). Advertised prices differ" | "Can't tell from the listing" | "This price isn't comparable with yearly leases" | "The agent says Z (time)" |
| **Must not conclude** | That the listing is bad, or the term isn't negotiable | Which price is real; that an agent misled anyone; that Scout detects duplicates automatically | That missing means bad | Overpriced, misleading, or a total cost | That the answer is verified |
| **Counterexample (rule must not fire)** | Investor + tenanted → Fits | Same size and price, different photos (audit #5/#6) → no grouping | Cheques for a cash buyer; tenancy for an investor | The user wants bills included → shown as a plus | Ready to view today → offer direct contact instead |
| **When the rule is wrong, and who's hurt** | A listing field is out of date or negotiable (e.g. cheques), so a good flat is set aside. **Hurts the searcher and an honest agent.** Mitigation: reasons are shown, "Keep anyway", firm vs flexible | An agency reuses photos across different flats, so they get grouped wrongly. **Hurts honest agents** (their listing is hidden) **and the searcher** (they lose an option). Mitigation: confirmed audit clusters only | Scout asks something the user didn't care about. **Hurts the searcher** (friction). Mitigation: only for constraints the user stated | The description's terms are out of date. **Hurts an honest agent** (the listing looks more expensive). Mitigation: label the basis, never a verdict | The agent's answer is wrong, or slow. **Hurts the searcher.** Mitigation: "Agent says" provenance, and direct contact is always available |
| **Status** | [Built] | [Built] on [Real] clusters only | [Built] | [Built] for holiday homes. **Off-plan "from" price:** a rule only, [Not built]. Evidence comes from the RAK Scout test, not Bloom Towers (which has no off-plan in the data) | [Built] UI, with [Simulated] delivery and replies |

## 5. Where it lives (approved)
Not on the homepage. **"Worth pursuing?" in Saved is the main experience.** The search-results bar, the save question and the listing-page action all lead into it; none of them is a separate experience.
1. **Search results:** a slim Scout bar ("Check what you've saved against what you need") plus subtle chips ("Also listed by 2 other agencies", "Price includes bills").
2. **Save (heart):** the moment of intent. Scout asks its one decision-relevant question in a bottom sheet.
3. **Saved tab → "Worth pursuing?":** the main screen.
4. **Listing page:** "Ask with my questions" next to Call and WhatsApp.
5. **Web ↔ app:** constraints, saved properties, sent questions and answers belong to the PF account. Answers arrive as an app notification and show on web in the same thread. [Not built; shown as a static note in the prototype.]

## 6. Journeys (scripted personas, [Real] listings)

**Renter: "Sara"**
- **Search:** furnished 1BR in Bloom Towers, up to AED 80,000/yr. Scout reuses both. At her first save it asks the budget's firmness and her move-in date: she says firm, and 1 Dec 2026.
- **Saves:** #15, #5, #12, #7.
1. Saving #5 (1 cheque) triggers: "How many cheques do you need, at minimum?" She answers 4, flexible.
   Saving #7 triggers: "This is a holiday-home let: bills are included, but there are extra fees of unknown amount. Still interested?" She says yes, if the total fits.
2. **Worth pursuing?** shows:
   - **#15** Ready for viewing enquiry: 4 cheques, AED 64,995. The listing states "available from 2 Nov"; current availability is unknown.
   - **#5** Ask first: 1 cheque vs her 4 (flexible, so a potential conflict).
   - **#12** Ask first: 2 cheques.
   - **#7** Ask first: a holiday-home let at AED 80,000, exactly her firm limit **before** extras of unknown amount. R4 label.
3. **Next-step change (illustrative, scripted):** instead of 4 generic contacts, she sends a viewing enquiry on #15 and targeted questions on #5, #12 and #7.
4. She sends #5 herself using the pre-filled message. She asks Scout to handle #7 and #12.
5. Simulated replies:
   - **#7:** "extras take the yearly total above 80,000" → **Set aside**.
   - **#5:** "Still available; 4 cheques accepted; viewing possible Thursday evening" → **Ready for viewing enquiry**. Availability shows as "Agent says · Simulated", and the viewing slot is shown.
   - **#12:** no reply yet. Shown as "No reply yet (this doesn't mean it's unavailable)".
   - The change log shows each update with its source and time.

**Buyer: "Omar"**
- **Search:** 1BR in Bloom Towers for sale, up to AED 1,000,000. At his first save Scout asks: "Is that a firm limit? Will you live in it or invest?" He says firm, and live in.
- **Saves:** #21, #25, #19, #29, #24, #18. That's six listings, including two of cluster A's three.
1. **R2** collapses them into **4 properties**:
   - Cluster A (#21/#25/#26): one flat, 3 agencies, AED 949,999 / 950,000 / 950,000.
   - Cluster B (#19/#29): one flat, AED 960,000 vs 1,000,000.
2. Saving #25 (its description doesn't say whether it's vacant) triggers: "When do you need to move in by?" He says 1 Feb 2027, firm. Scout reuses this for every later save.
3. **Worth pursuing?** shows:
   - **#18** Ready for viewing enquiry: its description says vacant (stated, not confirmed), AED 839,999.
   - **Cluster A** Ask first: "Is it vacant, and could I move in by 1 Feb 2027?" One agency (#21) describes it as vacant; the other two don't say. Because Omar lives in with a firm date, occupancy stays unresolved. Vacancy is **not** carried across the cluster. One property, so the question goes to **one** agency of the user's choice.
   - **Cluster B** Ask first: "Which price is current, and is it vacant?" Sent to both agencies, because the advertised prices differ and neither description says whether it's vacant.
   - **#24** Ask first: "When does the tenancy end?" Its description says tenanted and the end date is unknown, so a potential conflict. The price, AED 1,000,000, is within his firm limit.
4. **Next-step change (illustrative, scripted):** 6 saved listings become 4 properties: 1 ready for viewing enquiry and 3 with targeted questions (cluster B's goes to both its agencies).
5. Simulated replies:
   - **Cluster B:** both agencies reply, and their answers are shown side by side, each labelled "Agent says · [time] · Simulated". Simulated replies invent **no new prices**. If the two answers disagree, Scout says so and doesn't choose between them.
   - **#24:** "tenancy until Aug 2027" → **Set aside**, since that conflicts with his firm 1 Feb date.

## 7. Screens (mobile first)

| # | Screen | Key elements | Status |
|---|---|---|---|
| S0 | Start | "I'm renting" / "I'm buying". One line on what Scout does. Banner: **"Prototype: listings are real PF listings checked on 3 Nov 2026. Agent messages and replies are simulated."** | [Built] |
| S1 | Search results | Audited Bloom Towers 1BR cards (price, size, tower, cheques, Verified, link "View on PF"), the Scout bar, subtle chips | [Real] data, [Built] |
| S2 | Save → Scout question | Bottom sheet with one question, "Why I'm asking", firm/flexible toggle | [Built] |
| S3 | **Worth pursuing?** | Per property: next step and reason. Expandable constraint rows (Fits / Potential conflict / Conflict / Unknown) with source labels. Cluster cards. "Before Scout / with Scout" summary, labelled **"Illustrative scenario"** | [Built] |
| S4 | Property detail | Facts grouped by source; R4 price-basis label; "Ask with my questions" | [Built] |
| S5 | Ask | Editable drafted questions. Choice: **"Send it myself" (default)** or **"Let Scout ask"** | [Built] |
| S5a | Send it myself | Pre-filled message preview → "Copy" / "Open WhatsApp". Opens with text only; **no number is dialled in the prototype** | [Built] text, [Simulated] hand-off |
| S5b | Let Scout ask | Consent screen: exactly what's shared (first name, the questions, chosen constraints), "through PF's enquiry channel", Send | [Simulated] |
| S6 | Answers | Thread per property: "Agent says · [time] · Simulated"; no-reply state | [Simulated] |
| S7 | Updated "Worth pursuing?" | Next steps re-computed; change log ("#7: Ask first → Set aside, because the agent said the extras take the total above your firm 80,000 · Simulated · 16:40") | [Built] logic on [Simulated] input |

## 8. The agent handoff
**Pre-filled message (user-sent; template):**

> Hi, I'm interested in the 1-bed in Bloom Towers [Tower], [size] sqft, AED [price] (Property Finder listing [id]). Before I arrange a viewing:
> 1) [question 1]
> 2) [question 2]
> 3) Could I view it this week? I'm free [slots].
>
> Thanks, [first name]

**What the agent receives through Scout** (simulated): the same questions plus the constraints the user chose to share, marked "Sent via Scout on Property Finder".

**Rules:**
- Consent for every send.
- No contact details leave the app until the user taps Send.
- Questions are capped at 3 per property.
- One identical question set is used when asking several agencies about one cluster.

**Simulated replies must not quote or name real agents.** They're shown as "Simulated agent reply". Real names appear only as listing data.

## 9. What's real, simulated and not built (this goes into the README)

| Real | Simulated | Not built |
|---|---|---|
| 30 audited listings and their fields; the 2 confirmed sale clusters; holiday-home price bases; listing links | Sending to agents; agent replies and their timing; PF enquiry channel; cross-device sync; notifications | Automatic duplicate detection or image matching; live availability checks; PF data connection; real agent messaging; Scout's natural-language conversation (constraints are scripted); purchase-cost and mortgage calculation (Scout already does this); off-plan pricing (R4 off-plan rule); Arabic; agent-side view |

## 10. Excluded scope (deliberately)
- Trust or suitability scores of any kind.
- "Fair price" verdicts.
- Financing advice or eligibility.
- Rent-side duplicate grouping. Photo evidence there is weaker; AUDIT, "Repeated rent listings".
- Unconfirmed groups like #22/#23. Shown as a listing-level note only: "photos also used on another listing".
- Other buildings or emirates, villas, off-plan.
- Hot-linking or copying PF photos. Cards link to the listing instead.
- Any claim that a listing is fake.

## 11. Acceptance checks (the build is done when)
1. Both journeys run end to end on a phone-width screen, and make sense without reading the brief.
2. On S3, every outcome shows its source label. Nothing unknown is shown as negative. No unknown fee is added to a price.
3. A next step changes on S7 after a simulated reply, with a logged reason and timestamp.
4. Cluster A shows 3 agencies and 2 distinct prices; cluster B shows 2 prices. Both say "Our check · 3 Nov 2026". No other listings are grouped.
5. The counterexamples behave: an investor buyer sees #24 as Fits on tenancy; a renter who marked cheques flexible sees #5 as a Potential conflict, and one who marked them firm sees it as a Conflict and "Set aside" (with "Keep anyway").
6. Every simulated element is visibly labelled. No simulated reply names a real agent or introduces a price that isn't in the listing data. The README table matches section 9.
7. At least one simulated reply offers a viewing slot, which shows the "arranges a viewing" part of the brief.
