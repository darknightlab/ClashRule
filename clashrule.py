#!/usr/bin/env python3
import ruamel.yaml
import sys
import os
import requests
import urllib.parse

# 运行一段时间后出错, 会与多线程有关吗? https://sourceforge.net/p/ruamel-yaml/tickets/367/
# 注释掉下方这行, 在每一个用到yaml的地方新开一个, 或许可以解决问题
# yaml = ruamel.yaml.YAML()

githubraw = "https://raw.projectk.org"
subconverter_default = "https://subconverter.projectk.org"
timeout = 10


def merge(own: dict, default: dict):
    for key in default:
        if (key not in own) or not own[key]:
            own[key] = default[key]
        elif isinstance(own[key], dict):
            merge(own[key], default[key])
    return own


def getYAML(dirname):
    yaml = ruamel.yaml.YAML()
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
    yaml = ruamel.yaml.YAML()
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
            # 第一个ALL代表了读取所有的proxy-providers, 第二个ALL代表了读取所有的rule-providers，最后是rule-groups的名字
            with open("./Config/All-All-{}.yaml".format(file.split(".")[0]), "w") as f:
                yaml.dump(config, f)


def listen(port=80):

    # 使用flask, 接受get的provider参数, 并将client["proxy-providers-template"]["url"]赋值为provider, 再返回yaml文件给请求者
    import io
    from flask import Flask, request, Response
    app = Flask(__name__)

    @app.route("/")
    def index():
        yaml = ruamel.yaml.YAML()
        subscription_url = request.args.get("subscription")
        subconverter_url = request.args.get("subconverter")
        provider_url = request.args.get("provider")  # provider url
        filename = request.args.get("filename")

        # 设置subconverter地址
        if subconverter_url:
            subc = subconverter_url
        else:
            subc = subconverter_default

        # 设置provider地址
        if provider_url:
            pass
        elif subscription_url:
            # 见 https://github.com/tindy2013/subconverter/issues/598, subconverter暂时无法正确转换vmess到clash, 因此需要添加flag使v2board发送clash格式订阅才能转换
            subscription_url = subscription_url+"&flag=clash"
            provider_url = subc + "/sub?target=clash&list=true&url={}".format(
                urllib.parse.quote_plus(subscription_url))
        else:
            # 此时provider=None, 啥信息都没提供, return一个订阅转换的html页面.
            return app.send_static_file("index.html")

        # 此后provider_url必有值
        # 设置template地址
        template = githubraw+"/darknightlab/ClashRule/main/Config/All-All-DNLAB_Full.yaml"
        if request.args.get("template"):
            template = request.args.get("template")
            if not template.startswith("http"):
                template = githubraw+"/darknightlab/ClashRule/main/Config/"+template

        resp = requests.get(template, timeout=timeout)
        config = yaml.load(resp.text)
        config["proxy-providers-template"]["url"] = provider_url

        hd_out = {}
        if filename:
            hd_out["content-disposition"] = "attachment; filename={}".format(
                filename)
        
        clash_info=request.args.get("clashinfo").lower()
        if clash_info == "true" or (clash_info is None and "clash-verge" in request.headers.get("user-agent").lower()):
            # 尝试获取订阅信息并返回
            try:
                hd_in = requests.get(provider_url, headers={
                    "user-agent": "clash-verge/1.4.5"
                }, timeout=timeout)
                # 文件名
                # hd_out["content-disposition"] = hd_in.headers.get("content-disposition")
                # 更新间隔
                hd_out["profile-update-interval"] = hd_in.headers.get(
                    "profile-update-interval")
                # 流量信息
                hd_out["subscription-userinfo"] = hd_in.headers.get(
                    "subscription-userinfo")
            except:
                pass

        buf = io.BytesIO()
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
