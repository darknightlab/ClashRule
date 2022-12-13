#!/usr/bin/env python3
import ruamel.yaml
import sys


yaml = ruamel.yaml.YAML()

with open("./Config/client/client.yaml") as f:
    client = yaml.load(f)
with open("./Config/proxy-providers/All.yaml") as f:
    proxy_roviders = yaml.load(f)
with open("./Config/rule-providers/ACL4SSR.yaml") as f:
    rule_providers = yaml.load(f)
with open("./Config/rule-groups/ACL4SSR_Full.yaml") as f:
    rule_groups = yaml.load(f)

# 如果own有值, 则取own, 如果own没有值或值为空, 则取default


def merge(own: dict, default: dict):
    for key in default:
        if (key not in own) or not own[key]:
            own[key] = default[key]
        elif isinstance(own[key], dict):
            merge(own[key], default[key])
    return own


merge(client, proxy_roviders)
merge(client, rule_providers)
merge(client, rule_groups)


def generate(url=""):
    client["proxy-providers-template"]["url"] = url
    with open("./Config/ACL4SSR_Online_Full.yaml", "w") as f:
        yaml.dump(client, f)

# 使用flask, 接受get的provider参数, 并将client["proxy-providers-template"]["url"]赋值为provider, 再返回yaml文件给请求者


def listen(port=80):
    import io
    from flask import Flask, request, Response
    app = Flask(__name__)

    @app.route("/")
    def index():
        buf = io.BytesIO()
        provider = request.args.get("provider")
        if provider:
            client["proxy-providers-template"]["url"] = provider
        yaml.dump(client, buf)
        return Response(buf.getvalue(), mimetype="text/plain")

    app.run(host="0.0.0.0", port=port)


if __name__ == "__main__":
    if len(sys.argv) == 3:
        if sys.argv[1] == "listen":
            listen(int(sys.argv[2]))
        elif sys.argv[1] == "generate":
            generate(sys.argv[2])
    elif len(sys.argv) == 2:
        if sys.argv[1] == "listen":
            listen()
        elif sys.argv[1] == "generate":
            generate()
