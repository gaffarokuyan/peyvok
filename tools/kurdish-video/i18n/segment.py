"""Turkce metni cumlelere boler: her dil ayni cumle listesini cevirir."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "narration"))
from sections import SECTIONS  # noqa: E402

END = re.compile(r'[.!?…]["”]?$')


def sentences(text):
    text = re.sub(r"\s*<break[^>]*/>", "", text)
    out, cur = [], []
    for tok in text.split():
        cur.append(tok)
        if END.search(tok):
            out.append(" ".join(cur)); cur = []
    if cur:
        out.append(" ".join(cur))
    return out


def all_sentences():
    return {name: sentences(t) for name, t in SECTIONS}


if __name__ == "__main__":
    d = all_sentences()
    json.dump(d, open(os.path.join(HERE, "tr.json"), "w"), ensure_ascii=False, indent=1)
    print(sum(len(v) for v in d.values()), {k: len(v) for k, v in d.items()})
