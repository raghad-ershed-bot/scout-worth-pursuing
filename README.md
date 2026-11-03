# Worth pursuing? A search assistant people can trust

A mobile-first, clickable prototype for Property Finder's Scout. For the homes a searcher saves, it says which ones deserve their next step, what to ask first, and who said what. It runs on **30 real Property Finder listings in Bloom Towers, JVC**, checked by hand on 3 Nov 2026. It has a renter journey (Sara) and a buyer journey (Omar).

**Not a Property Finder product. Agent messages and replies are simulated.**

- **Live prototype:** [https://raghad-ershed-bot.github.io/scout-worth-pursuing/](https://raghad-ershed-bot.github.io/scout-worth-pursuing/) (open it on a phone, or narrow your browser to about 400px)
- **Start with:** [ONE-PAGER.md](ONE-PAGER.md)

## What's here
| File | What it is |
|---|---|
| [ONE-PAGER.md](ONE-PAGER.md) | The problem, where it lives, why and when to use it, agents and revenue, metrics, the 1% test, what I couldn't build |
| [AUDIT.md](AUDIT.md) | 30 live listings with links, verdicts, findings and a corrections log |
| [RULES.md](RULES.md) | The rules, what each must never conclude, and when each is wrong and who gets hurt |
| [AI-LOG.md](AI-LOG.md) | Times AI tools were confidently wrong about UAE real estate, and how I caught them |
| [docs/DECISION-LOG.md](docs/DECISION-LOG.md) | Review rounds: every finding, how it was tested, what changed |
| [docs/HANDOFF.md](docs/HANDOFF.md) | Exactly what's implemented, test coverage, known limitations |
| [docs/SPEC.md](docs/SPEC.md) | The build spec |
| `index.html` | The prototype (built, single file) |
| `src/template.html`, `data/listings.json`, `build.py` | Source, data, build |
| `tests/` | Headless journey and rule tests |

## Run it
Open `index.html` in any browser. It's a single file, with no server and no install. It only needs the network for Google Fonts (it falls back to system fonts) and for the links out to Property Finder and WhatsApp.

**Rebuild:** `python3 build.py` puts `data/listings.json` into `src/template.html` and writes `index.html`, byte for byte (md5 `e7feabe5f4dea0f3c9b9429b88f450b7`).

**Tests:** these need Node and Playwright (`npm i playwright`, then `npx playwright install chromium`).
```
node tests/journeys.js "$(pwd)/index.html"            # both journeys, before and after agent replies
node tests/review-fixes.js "$(pwd)/index.html"        # fixes from the code review
node tests/review-round2.js "$(pwd)/index.html"       # proceed despite conflict, cheques, month-only tenancy
node tests/availability-check.js "$(pwd)/index.html"  # availability rule, incl. the documented gap
node tests/renter-check.js "$(pwd)/index.html"        # renter start state, width at 360px
```

## Real vs mocked
| Real | Simulated | Not built |
|---|---|---|
| The 30 listings' facts: price, size, furnishing, cheques, Verified, placement, dates, links | Sending messages to agents, and every agent reply and reply time | Live PF data or search |
| Copies of one flat (2 groups, matched by hand on photos, tower and size) | The "Let Scout ask for me" route | Real agent messaging, and AI reading the replies |
| Holiday-home price basis (from DTCM permits) | The personas' answers (scripted defaults you can change) | AI extraction of claims from descriptions (done by hand here) |
| What each description says about tenancy, stated rather than confirmed | | Automatic copy detection; saving across web and app; notifications |

## What's missing, and what it would take
In priority order. The full table is in ONE-PAGER section 8.
1. **Real agent messaging and replies:** PF's enquiry channel (or the agent lead inbox), agent consent and a way to send the reply back into the searcher's thread.
2. **AI reading of descriptions and replies:** PF's full listing feed, an evaluation set to measure extraction accuracy, and a model call per listing and per reply.
3. **An "unavailable" outcome:** a small change to the rules (set aside, with the agent's answer as the reason). It's not in the scripted replies.
4. **Automatic copy detection:** PF's original images for hashing, plus listing fields, with a human-checked sample to tune it.
5. **Saving across web and app:** PF accounts and notifications.

No listing photos are copied or hot-linked; cards link to the listing on PF. No secrets, credentials or environment files are used.
