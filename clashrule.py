#!/usr/bin/env python3
import ruamel.yaml
import sys
import os
import requests
import urllib.parse


yaml = ruamel.yaml.YAML()

githubraw = "https://raw.lovely.ink"
subconverter_default = "https://sub.darknight.tech"
timeout = 10


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
    files = [f for f in os.listdir(dirname) if (os.path.isfile(
        os.path.join(dirname, f)) and f.endswith(".yaml"))]
    for file in files:
        with open(os.path.join(dirname, file)) as f:
            proxy_provider = yaml.load(f)
            merge(y, proxy_provider)
    return y


def generate(url=""):
    files = [f for f in os.listdir("./Config/rule-groups") if (os.path.isfile(
        os.path.join("./Config/rule-groups", f)) and f.endswith(".yaml"))]
    for file in files:
        with open("./Config/client/client.yaml") as f:
            client = yaml.load(f)

        proxy_roviders = getYAML("./Config/proxy-providers")
        rule_providers = getYAML("./Config/rule-providers")
        config = client  # 防止指针引用出乱子全部再读一遍
        with open(os.path.join("./Config/rule-groups", file)) as f:
            rule_groups = yaml.load(f)
            merge(config, proxy_roviders)
            merge(config, rule_providers)
            merge(config, rule_groups)
            config["proxy-providers-template"]["url"] = url
            with open("./Config/All-All-{}.yaml".format(file.split(".")[0]), "w") as f:
                yaml.dump(config, f)


def listen(port=80):

    # 使用flask, 接受get的provider参数, 并将client["proxy-providers-template"]["url"]赋值为provider, 再返回yaml文件给请求者
    import io
    from flask import Flask, request, Response
    app = Flask(__name__)

    @app.route("/")
    def index():
        template = githubraw+"/darknightlab/ClashRule/main/Config/All-All-DNLAB_Full.yaml"
        if request.args.get("template"):
            template = request.args.get("template")
            if not template.startswith("http"):
                template = githubraw+"/darknightlab/ClashRule/main/Config/"+template
        resp = requests.get(template, timeout=timeout)

        config = yaml.load(resp.text)
        buf = io.BytesIO()
        subscription_url = request.args.get("subscription")
        subconverter_url = request.args.get("subconverter")
        provider = request.args.get("provider")  # provider url
        filename = request.args.get("filename")
        # 设置subconverter地址
        if subconverter_url:
            subc = subconverter_url
        else:
            subc = subconverter_default
        if provider:
            pass
        elif subscription_url:
            provider = subc + "/sub?target=clash&list=true&url={}".format(
                urllib.parse.quote_plus(subscription_url))
        config["proxy-providers-template"]["url"] = provider
        try:
            hd_in = requests.get(provider, headers={
                "user-agent": "ClashforWindows/0.19.29"
            }, timeout=timeout)
            hd_out = {
                # "content-disposition": hd_in.headers.get("content-disposition"),
                # 更新间隔
                "profile-update-interval": hd_in.headers.get("profile-update-interval"),
                # 流量信息
                "subscription-userinfo": hd_in.headers.get("subscription-userinfo")
            }
            if filename:
                hd_out["content-disposition"] = "attachment; filename={}".format(
                    filename)
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
    elif len(sys.argv) == 1:
        generate()
