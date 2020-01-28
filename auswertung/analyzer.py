import json
import os
import plotly
import numpy as np
import pprint

file = os.getcwd() + "\\results.json"

with open(file, "r") as f:
    data = json.load(f)
    entries = list(data)

generaldata = []
last_time = entries[2]["time_elapsed"]

for i, entry in enumerate(entries[3:]):
    if entry.get("soa", False):
        _soa = entry["soa"]
        _time = entry["time_elapsed"]

        generaldata.append(
            {
                "id": i,
                "soa": _soa,
                "soa_diff": np.abs(entry["measured_soa"] - _soa),
                "decision_time": entry["time_elapsed"] - last_time,
                "decision_correct": entry["response_correct"],
                "word_side": "l" if entry["probeLeft"] else "r",
            }
        )

    last_time = _time

# garbage now
entries = None

print(generaldata)


with open(path + "/" + file, "r") as f:
    with open(path + "/" + file + ".csv", "w") as csv:
        csv.write("Condition,SOA,Repetitions,Count,Relative\n")

        soa = []
        decision_correct = []
        response = []
        data = list(json.load(f))

        for entry in data[14:-1]:

            if entry.get("soa", None) is not None:

                _soa = entry["soa"]
                _d = int(entry["response_correct"])
                _res = 1 if entry["response"] == "probe" else 0

                soa.append(_soa)
                decision_correct.append(_d)
                response.append(_res)

        soa = np.array(soa)
        decision_correct = np.array(decision_correct)
        response = np.array(response)

        all_soas = np.unique(soa)
        all_decisions = np.array(list(zip(soa, decision_correct)))
        all_probes = np.array(list(zip(soa, response)))

        for soa in all_soas:
            index = np.argwhere(all_probes[:, 0] == soa)
            n = index.shape[0]
            right_decisions = np.sum(all_probes[index, 1])
            csv.write(f"0,{soa},{n},{right_decisions},{right_decisions/n}\n")

