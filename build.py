"""Rebuild index.html from src/template.html and data/listings.json.

The template has one placeholder, __DATA__, which is replaced by the
listings data as compact JSON. Running this reproduces the shipped
index.html byte for byte.
"""
import json
from pathlib import Path

root = Path(__file__).resolve().parent
template = (root / "src" / "template.html").read_text(encoding="utf-8")
data = json.loads((root / "data" / "listings.json").read_text(encoding="utf-8"))
assert template.count("__DATA__") == 1, "expected exactly one __DATA__ placeholder"
(root / "index.html").write_text(template.replace("__DATA__", json.dumps(data)), encoding="utf-8")
print("wrote index.html")
