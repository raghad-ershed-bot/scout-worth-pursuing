# Testing Scout as a searcher (2–3 Nov 2026)

Before designing anything, I used Scout, PF's AI search (beta), as a real searcher across two long sessions, then ran a later comparison test. This is what I saw. It's my observation, not a measurement.

## What works
- It keeps context across a long conversation (80+ messages).
- When results are thin, it says so and suggests how to widen the search. It moved me from off-plan to resale when off-plan couldn't fit.
- Its maths was correct, and the calculations run as tools in milliseconds, not in the model's head.
- Its Arabic is natural, and it follows when you switch languages.
- It said plainly when a project I made up didn't exist.

## Where it breaks
- **The handoff is generic.** Every path ends in a WhatsApp message like "I'm interested in your listing" plus a link. None of what I told Scout reaches the agent.
- **The brief it builds stays hidden.** If you ask, it summarises what you want (budget, must-haves, shortlist, financing), but you never see that summary unless you ask. It also added a preference I never gave.
- **Agent marketing is shown as fact.** It repeats "high floor" and "sea view" with no source. In a later comparison (South Bay vs Bay Residences) it said "Direct sea view **confirmed**: already listed as a feature".
- **Outliers are celebrated.** It called AED 1,071/sqft (against about 1,660 for comparable units) "exceptional value". It added "same developer, no quality difference" and closed with "Ready to move forward?".
- **It used the wrong emirate's rules.** It applied Dubai bodies and fees (DLD, DEWA) to a Ras Al Khaimah flat. RAK's transfer fee is unresolved, because sources disagree.
- **"Fair price" came from two data points.** That was two asking prices for smaller units.
- **It gave finance advice** ("80% LTV is the smarter move") without knowing my situation.
- **Prices don't match.** For off-plan, the price on the card (the cheapest unit) doesn't match the price in the text (the unit size I asked about).
- **Cards don't always match what I chose.** I picked apartment and was shown villas.
- **The response time is longer than it looks.** The timing labels show tool time only (milliseconds to 3.5s). In one live test, the full answer took about 20s.
- **There's a paywall** for consumers in the beta: $20 for 600 credits.

## What this changed in my design
Scout already searches and compares well. What it doesn't do is separate **what's stated** from **what's confirmed**, or tell you **what to check before you commit**. That became the product: source labels on every finding, unknowns that block a next step, and questions to the agent that carry your situation instead of "I'm interested".
