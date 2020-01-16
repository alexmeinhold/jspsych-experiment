import os
import sys
import json


def merge_files(directory):
    merged_data = []
    for filename in os.listdir(directory):
        full_path = os.path.join(directory, filename)
        with open(full_path) as f:
            data = json.load(f)
            data = data[14:-1]  # skip tutorial
            merged_data.extend(data)
    return merged_data


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: <program> <data_directory>")
        sys.exit(1)

    directory = sys.argv[1]
    merged_data = merge_files(directory)
    output_file = os.path.join(directory, "merged_data.json")

    with open(output_file, "w") as f:
        json.dump(merged_data, f)
