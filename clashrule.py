#!/usr/bin/env python3
import ruamel.yaml
import sys
import requests


yaml = ruamel.yaml.YAML()

githubraw = "https://raw.lovely.ink"
timeout = 10


def merge(own: dict, default: dict):
    # 如果own有值, 则取own, 如果own没有值或值为空, 则取default
    for key in default:
        if (key not in own) or not own[key]:
            own[key] = default[key]
        elif isinstance(own[key], dict):
            merge(own[key], default[key])
    return own


def generate(url=""):
    with open("./Config/client/client.yaml") as f:
        client = yaml.load(f)
    with open("./Config/proxy-providers/All.yaml") as f:
        proxy_roviders = yaml.load(f)
    with open("./Config/rule-providers/ACL4SSR.yaml") as f:
        rule_providers = yaml.load(f)
    with open("./Config/rule-groups/ACL4SSR_Full.yaml") as f:
        rule_groups = yaml.load(f)

    config = client  # 指针引用
    merge(config, proxy_roviders)
    merge(config, rule_providers)
    merge(config, rule_groups)
    config["proxy-providers-template"]["url"] = url
    with open("./Config/ACL4SSR_Online_Full.yaml", "w") as f:
        yaml.dump(config, f)


def listen(port=80):

    # 使用flask, 接受get的provider参数, 并将client["proxy-providers-template"]["url"]赋值为provider, 再返回yaml文件给请求者
    import io
    from flask import Flask, request, Response
    app = Flask(__name__)

    @app.route("/")
    def index():
        resp = requests.get(
            githubraw+"/darknightlab/ClashRule/main/Config/ACL4SSR_Online_Full.yaml", timeout=timeout)

        config = yaml.load(resp.text)
        buf = io.BytesIO()
        provider = request.args.get("provider")
        filename = request.args.get("filename")
        if provider:
            config["proxy-providers-template"]["url"] = provider
            su = ""
            try:
                hd_in = requests.get(provider, headers={
                    "user-agent": "ClashforWindows/0.19.29"
                }, timeout=timeout)
                hd_out = {
                    # "content-disposition": hd_in.headers.get("content-disposition"),
                    # 文件名
                    "content-disposition": "attachment; filename={}".format(filename),
                    # 更新间隔
                    "profile-update-interval": hd_in.headers.get("profile-update-interval"),
                    # 流量信息
                    "subscription-userinfo": hd_in.headers.get("subscription-userinfo")
                }
            except:
                pass
        yaml.dump(config, buf)
        return Response(buf.getvalue(), mimetype="text/plain", headers=hd_out)

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
