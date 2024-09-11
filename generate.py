from ruamel.yaml import YAML
import io
import os

yaml = YAML()


def merge(own: dict, default: dict):
    for key in default:
        if (key not in own) or not own[key]:
            own[key] = default[key]
        elif isinstance(own[key], dict):
            merge(own[key], default[key])
    return own


def getYAML(dirname):
    # y是一个新的orderdict
    y = yaml.load("{}")
    files = [
        f
        for f in os.listdir(dirname)
        if (os.path.isfile(os.path.join(dirname, f)) and f.endswith(".yaml"))
    ]
    for file in files:
        with open(os.path.join(dirname, file), "r", encoding="utf-8") as f:
            proxy_provider = yaml.load(f)
            merge(y, proxy_provider)
    return y


client_config = yaml.load(
    open("clash-config/client.yaml", "r", encoding="utf-8").read()
)
merge(
    client_config,
    yaml.load(open("clash-config/proxy-providers.yaml", "r", encoding="utf-8").read()),
)
merge(client_config, getYAML("clash-config/rule-providers"))
merge(
    client_config,
    yaml.load(open("clash-config/proxy-groups.yaml", "r", encoding="utf-8").read()),
)
merge(
    client_config,
    yaml.load(open("clash-config/rules.yaml", "r", encoding="utf-8").read()),
)

config_string = io.StringIO()
yaml.dump(client_config, config_string)
config_string = config_string.getvalue()


def generate():
    config_ts = f"""export const config_string = `
{config_string}
`;

"""

    with open("src/config.ts", "w", encoding="utf-8") as f:
        f.write(config_ts)


if __name__ == "__main__":
    generate()
