import json 
import os
import plotly
import numpy as np
import pprint

file = os.getcwd() + "\\results.json"

with open(file,"r") as f:
    data = json.load(f)
    entries = list(data)

generaldata = []
last_time = entries[2]["time_elapsed"]

for i,entry in enumerate(entries[3:]):
    if entry.get("soa",False):
        _soa = entry["soa"]
        _time = entry["time_elapsed"]

        generaldata.append(
            {
                "id" : i,
                "soa" : _soa,
                "soa_diff" : np.abs(entry["measured_soa"] - _soa),
                "decision_time" : entry["time_elapsed"] - last_time,
                "decision_correct" : entry["response_correct"],
                "word_side" : "l" if entry["probeLeft"] else "r"
            }
        )

    last_time = _time

# garbage now
entries = None

print(generaldata)