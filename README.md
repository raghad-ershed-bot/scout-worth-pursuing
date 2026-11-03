# Worth pursuing? A search assistant people can trust

A mobile-first, clickable prototype for Property Finder's Scout. For each home a searcher saves, it says whether it deserves their next step, what to ask first, and who said what. It runs on **30 real Property Finder listings in Bloom Towers, JVC**, checked on 3 Nov 2026, with a renter journey (Sara) and a buyer journey (Omar). Not a Property Finder product; agent messages and replies are simulated.

- **Live prototype:** https://raghad-ershed-bot.github.io/scout-worth-pursuing/ (best on a phone)
- **Start with:** [ONE-PAGER.md](ONE-PAGER.md)
- **Supporting files:** [Google Drive](https://drive.google.com/drive/folders/1pHH4C9YdmlPQPbrNXoMPkbB_g3OvEQED)

**How I worked:**
- I led the work: I chose the building, checked the listings, formed the findings, defined the problem and made the product decisions.
- Claude was a second pass on the listing checks and the building-wide counts. It also built the prototype and ran the tests.
- ChatGPT reviewed the evidence, the code and the docs. Where each of them was wrong is in [AI-LOG.md](AI-LOG.md).

## Files
| | |
|---|---|
| [ONE-PAGER.md](ONE-PAGER.md) | The problem, the product, placement, agents and revenue, metrics, the 1% test, what's not built |
| [AUDIT.md](AUDIT.md) | 30 listings with links, verdicts, findings and a corrections log |
| [RULES.md](RULES.md) | The rules, and when each is wrong and who gets hurt |
| [AI-LOG.md](AI-LOG.md) | Confident AI mistakes about UAE real estate, and how they were caught |
| [docs/](docs/) | Research insights, Scout test, spec, decision log, implementation handoff |
| `index.html` · `src/` · `data/` · `tests/` | The prototype, its source, the listing data, the tests |

## Run it
Open `index.html` in a browser; there's nothing to install. To rebuild, run `python3 build.py`, which puts `data/listings.json` into `src/template.html`. The tests need Node and Playwright: `node tests/journeys.js "$(pwd)/index.html"` (the other files in `tests/` run the same way).

## Real vs mocked
| Real | Simulated | Not built |
|---|---|---|
| The 30 listings' facts and links | Messages to agents, their replies and timing | Live PF data and search |
| Two confirmed groups of one flat listed several times | The "Let Scout ask for me" route | Real agent messaging, and AI reading the replies |
| Holiday-home price basis (DTCM permits) | The personas' answers (scripted defaults you can change) | AI extraction of claims from listings |
| What each description states about tenancy | | Automatic copy detection; saving across web and app |

**To make it real** (in order): PF's enquiry channel and agent consent; the listing feed plus an accuracy test for AI extraction; an "unavailable" outcome; PF's original images for copy detection; PF accounts and notifications. Details are in [ONE-PAGER.md](ONE-PAGER.md), section 8.

Search cards use original building illustrations; no listing photos are copied. No secrets or credentials are used.
