export const config_string = `
mixed-port: 7890
socks-port: 7891
port: 7892
allow-lan: true
mode: rule
log-level: info
external-controller: 0.0.0.0:9090
unified-delay: true
ipv6: true
# global-client-fingerprint: chrome
dns:
  enable: true
  listen: 0.0.0.0:53
  ipv6: true # when the false, response to AAAA questions will be empty
  default-nameserver:
  - system
  - 114.114.114.114
  enhanced-mode: redir-host
  use-hosts: true # lookup hosts and return IP record
  nameserver:
  - https://dns.projectk.org/dns-query
  - https://1.1.1.1/dns-query#RULES
  nameserver-policy:
    geosite:private:
    - system
    rule-set:DnlabChina,GoogleCN,SteamCN,ChinaDomain:
    - https://tools.dnlab.net:16443/9c880947-bae6-4daa-beea-63f68a8df261/dns-query
    - https://dohcn.projectk.org/dns-query
    geosite:cn:
    - https://tools.dnlab.net:16443/9c880947-bae6-4daa-beea-63f68a8df261/dns-query
    - https://dohcn.projectk.org/dns-query
geo-auto-update: true
geo-update-interval: 24
geox-url:
  geoip: https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat
  geosite: https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat
  mmdb: https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb
  asn: https://github.com/xishang0128/geoip/releases/download/latest/GeoLite2-ASN.mmdb

sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  sniff:
    QUIC:
      ports: [443]
    TLS:
      ports: [443, 16443]
    HTTP:
      ports: [80, 8080, 16080]
  skip-domain:
  - Mijia Cloud
proxy-providers:
  # All; 所有
  All: &proxy-providers-template
    type: http
    url: # your proxy provider url
    interval: 3600
    health-check:
      enable: true
      interval: 1800
      lazy: false
      url: http://www.gstatic.com/generate_204
    path: ./proxy-providers/All.yaml

  # 自动选择，暂时用不上，因为clash的正则用不了
  AutoSelectNOCN:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    # go的正则表达式，去掉含CN的节点，包含其他所有节点
    exclude-filter: CN

  AutoSelectCN:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|CN|China # None|none|用于匹配不存在节点, 防止clash报错

  # Countries or Regions; 国家或地区
  HK:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|港|HK|Hong Kong
  JP:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|日本|川日|东京|大阪|泉日|埼玉|沪日|深日|[^-]日|JP|Japan
  SG:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|新加坡|坡|狮城|SG|Singapore
  TW:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|台|新北|彰化|TW|Taiwan
  US:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United
      States
  KR:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|KR|Korea|KOR|首尔|韩|韓
  CN:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|CN|China

  # Streaming Media; 流媒体
  Unlock:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|🔓|Unlock|unlock|UNLOCK|NF|奈飞|解锁|Netflix|NETFLIX|Media|Hulu|HBO|Disney|Prime

  # Scholar; 学术
  CERNET:
    <<: *proxy-providers-template
    path: ./proxy-providers/All.yaml
    filter: None|none|PKU|THU|SJTU|USTC
rule-providers:
  # raw.githubusercontent.com mirror: raw.projectk.org
  AbemaTV:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/AbemaTV.yaml
    path: ./rule-providers/ACL4SSR/AbemaTV.yaml
    interval: 3600

  Adobe:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Adobe.yaml
    path: ./rule-providers/ACL4SSR/Adobe.yaml
    interval: 3600

  Amazon:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Amazon.yaml
    path: ./rule-providers/ACL4SSR/Amazon.yaml
    interval: 3600

  AmazonIp:
    type: http
    behavior: ipcidr
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/AmazonIp.yaml
    path: ./rule-providers/ACL4SSR/AmazonIp.yaml
    interval: 3600

  Apple:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Apple.yaml
    path: ./rule-providers/ACL4SSR/Apple.yaml
    interval: 3600

  Bahamut:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Bahamut.yaml
    path: ./rule-providers/ACL4SSR/Bahamut.yaml
    interval: 3600

  Bilibili:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Bilibili.yaml
    path: ./rule-providers/ACL4SSR/Bilibili.yaml
    interval: 3600

  BilibiliHMT:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/BilibiliHMT.yaml
    path: ./rule-providers/ACL4SSR/BilibiliHMT.yaml
    interval: 3600

  Blizzard:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Blizzard.yaml
    path: ./rule-providers/ACL4SSR/Blizzard.yaml
    interval: 3600

  Developer:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Developer.yaml
    path: ./rule-providers/ACL4SSR/Developer.yaml
    interval: 3600

  DisneyPlus:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/DisneyPlus.yaml
    path: ./rule-providers/ACL4SSR/DisneyPlus.yaml
    interval: 3600

  EHGallery:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/EHGallery.yaml
    path: ./rule-providers/ACL4SSR/EHGallery.yaml
    interval: 3600

  Epic:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Epic.yaml
    path: ./rule-providers/ACL4SSR/Epic.yaml
    interval: 3600

  Google:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Google.yaml
    path: ./rule-providers/ACL4SSR/Google.yaml
    interval: 3600

  GoogleCN:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/GoogleCN.yaml
    path: ./rule-providers/ACL4SSR/GoogleCN.yaml
    interval: 3600

  GoogleFCM:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/GoogleFCM.yaml
    path: ./rule-providers/ACL4SSR/GoogleFCM.yaml
    interval: 3600

  HBO:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/HBO.yaml
    path: ./rule-providers/ACL4SSR/HBO.yaml
    interval: 3600

  Microsoft:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Microsoft.yaml
    path: ./rule-providers/ACL4SSR/Microsoft.yaml
    interval: 3600

  NetEaseMusic:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/NetEaseMusic.yaml
    path: ./rule-providers/ACL4SSR/NetEaseMusic.yaml
    interval: 3600

  Netflix:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Netflix.yaml
    path: ./rule-providers/ACL4SSR/Netflix.yaml
    interval: 3600

  OneDrive:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/OneDrive.yaml
    path: ./rule-providers/ACL4SSR/OneDrive.yaml
    interval: 3600

  Porn:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Porn.yaml
    path: ./rule-providers/ACL4SSR/Porn.yaml
    interval: 3600

  Scholar:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Scholar.yaml
    path: ./rule-providers/ACL4SSR/Scholar.yaml
    interval: 3600

  Sony:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Sony.yaml
    path: ./rule-providers/ACL4SSR/Sony.yaml
    interval: 3600

  Spotify:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Spotify.yaml
    path: ./rule-providers/ACL4SSR/Spotify.yaml
    interval: 3600

  Steam:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Steam.yaml
    path: ./rule-providers/ACL4SSR/Steam.yaml
    interval: 3600

  SteamCN:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/SteamCN.yaml
    path: ./rule-providers/ACL4SSR/SteamCN.yaml
    interval: 3600

  Telegram:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Telegram.yaml
    path: ./rule-providers/ACL4SSR/Telegram.yaml
    interval: 3600

  Xbox:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/Xbox.yaml
    path: ./rule-providers/ACL4SSR/Xbox.yaml
    interval: 3600

  YouTube:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Ruleset/YouTube.yaml
    path: ./rule-providers/ACL4SSR/YouTube.yaml
    interval: 3600

  BanAD:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/BanAD.yaml
    path: ./rule-providers/ACL4SSR/BanAD.yaml
    interval: 3600

  BanEasyList:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/BanEasyList.yaml
    path: ./rule-providers/ACL4SSR/BanEasyList.yaml
    interval: 3600

  BanEasyListChina:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/BanEasyListChina.yaml
    path: ./rule-providers/ACL4SSR/BanEasyListChina.yaml
    interval: 3600

  BanEasyPrivacy:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/BanEasyPrivacy.yaml
    path: ./rule-providers/ACL4SSR/BanEasyPrivacy.yaml
    interval: 3600

  BanProgramAD:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/BanProgramAD.yaml
    path: ./rule-providers/ACL4SSR/BanProgramAD.yaml
    interval: 3600

  ChinaCompanyIp:
    type: http
    behavior: ipcidr
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaCompanyIp.yaml
    path: ./rule-providers/ACL4SSR/ChinaCompanyIp.yaml
    interval: 3600

  ChinaDomain:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaDomain.yaml
    path: ./rule-providers/ACL4SSR/ChinaDomain.yaml
    interval: 3600

  ChinaIp:
    type: http
    behavior: ipcidr
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaIp.yaml
    path: ./rule-providers/ACL4SSR/ChinaIp.yaml
    interval: 3600

  ChinaMedia:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/ChinaMedia.yaml
    path: ./rule-providers/ACL4SSR/ChinaMedia.yaml
    interval: 3600

  Download:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/Download.yaml
    path: ./rule-providers/ACL4SSR/Download.yaml
    interval: 3600

  LocalAreaNetwork:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/LocalAreaNetwork.yaml
    path: ./rule-providers/ACL4SSR/LocalAreaNetwork.yaml
    interval: 3600

  ProxyGFWlist:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/ProxyGFWlist.yaml
    path: ./rule-providers/ACL4SSR/ProxyGFWlist.yaml
    interval: 3600

  ProxyMedia:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/ProxyMedia.yaml
    path: ./rule-providers/ACL4SSR/ProxyMedia.yaml
    interval: 3600

  UnBan:
    type: http
    behavior: classical
    url: https://raw.projectk.org/ACL4SSR/ACL4SSR/master/Clash/Providers/UnBan.yaml
    path: ./rule-providers/ACL4SSR/UnBan.yaml
    interval: 3600
  SitesOnlyInSchool:
    type: http
    behavior: classical
    url: https://raw.projectk.org/darknightlab/ClashRule/main/Rule-Providers/SitesOnlyInSchool.yaml
    path: ./rule-providers/DNLAB/SitesOnlyInSchool.yaml
    interval: 3600
  DnlabChina:
    type: http
    behavior: classical
    url: https://raw.projectk.org/darknightlab/ClashRule/main/Rule-Providers/DnlabChina.yaml
    path: ./rule-providers/DNLAB/DnlabChina.yaml
    interval: 3600
  DnlabAbroad:
    type: http
    behavior: classical
    url: https://raw.projectk.org/darknightlab/ClashRule/main/Rule-Providers/DnlabAbroad.yaml
    path: ./rule-providers/DNLAB/DnlabAbroad.yaml
    interval: 3600
  HomeBroadband:
    type: http
    behavior: classical
    url: https://raw.projectk.org/darknightlab/ClashRule/main/Rule-Providers/HomeBroadband.yaml
    path: ./rule-providers/DNLAB/HomeBroadband.yaml
    interval: 3600
  RequestLimit:
    type: http
    behavior: classical
    url: https://raw.projectk.org/darknightlab/ClashRule/main/Rule-Providers/RequestLimit.yaml
    path: ./rule-providers/DNLAB/RequestLimit.yaml
    interval: 3600
proxy-groups:
- name: 节点选择
  type: select
  proxies:
  - DIRECT
  - 手动切换
  - 自动选择(国外)
  - 自动选择(大陆)
  - 香港节点
  - 日本节点
  - 新加坡节点
  - 台湾节点
  - 美国节点
  - 韩国节点
  - 大陆节点
- name: 手动切换
  type: select
  use:
  - All
- name: 自动选择(国外)
  type: url-test
  use:
  - AutoSelectNOCN     # 不用All因为All包含CN节点
  url: http://www.gstatic.com/generate_204
  interval: 300
- name: 自动选择(大陆)
  type: url-test
  use:
  - AutoSelectCN
  url: https://www.google.cn/generate_204
  interval: 300
- name: 负载均衡
  type: load-balance
  use:
  - All

  # 内容分类, 规则集映射到此
- name: 大陆网站
  type: select
  proxies:
  - DIRECT
  - 大陆节点
  - 节点选择
- name: 国外网站
  type: select
  proxies:
  - 节点选择
  - DIRECT
- name: 学术网站
  type: select
  proxies:
  - DIRECT
  - 学术节点
  - 节点选择
- name: 电报消息
  type: select
  proxies:
  - 节点选择
  - DIRECT
  - 香港节点
  - 日本节点
  - 新加坡节点
  - 台湾节点
  - 美国节点
  - 韩国节点
- name: 油管视频
  type: select
  proxies:
  - 节点选择
  - DIRECT
  - 香港节点
  - 日本节点
  - 新加坡节点
  - 台湾节点
  - 美国节点
  - 韩国节点
- name: 奈飞视频
  type: select
  proxies:
  - 解锁节点
  - 节点选择
  - DIRECT
  - 香港节点
  - 日本节点
  - 新加坡节点
  - 台湾节点
  - 美国节点
  - 韩国节点
- name: 巴哈姆特
  type: select
  proxies:
  - 台湾节点
  - 节点选择
  - DIRECT
- name: 哔哩哔哩
  type: select
  proxies:
  - DIRECT
  - 节点选择
  - 大陆节点
  - 台湾节点
  - 香港节点
- name: 国外媒体
  type: select
  proxies:
  - 节点选择
  - 解锁节点
  - DIRECT
  - 香港节点
  - 日本节点
  - 新加坡节点
  - 台湾节点
  - 美国节点
  - 韩国节点
- name: 国内媒体
  type: select
  proxies:
  - DIRECT
  - 大陆节点
  - 节点选择
- name: 谷歌FCM
  type: select
  proxies:
  - DIRECT
  - 节点选择
  - 香港节点
  - 台湾节点
  - 日本节点
  - 新加坡节点
  - 美国节点
  - 韩国节点
- name: 微软云盘
  type: select
  proxies:
  - DIRECT
  - 节点选择
  - 香港节点
  - 台湾节点
  - 日本节点
  - 新加坡节点
  - 美国节点
  - 韩国节点
- name: 微软服务
  type: select
  proxies:
  - DIRECT
  - 节点选择
  - 香港节点
  - 台湾节点
  - 日本节点
  - 新加坡节点
  - 美国节点
  - 韩国节点
- name: 苹果服务
  type: select
  proxies:
  - DIRECT
  - 节点选择
  - 香港节点
  - 台湾节点
  - 日本节点
  - 新加坡节点
  - 美国节点
  - 韩国节点
- name: 游戏平台
  type: select
  proxies:
  - DIRECT
  - 节点选择
  - 大陆节点
  - 香港节点
  - 台湾节点
  - 日本节点
  - 新加坡节点
  - 美国节点
  - 韩国节点
- name: 网易云音乐
    # 不知道怎么实现ACL4SSR的自动选择(网易|音乐|解锁|Music|NetEase), 应该是要新建一个music providers
  type: select
  proxies:
  - DIRECT
  - 节点选择
  - 香港节点
  - 台湾节点
  - 日本节点
  - 新加坡节点
  - 美国节点
  - 韩国节点
  - 大陆节点
- name: 全球直连
  type: select
  proxies:
  - DIRECT
  - 节点选择
- name: 广告拦截
  type: select
  proxies:
  - DIRECT
  - REJECT
- name: 应用净化
  type: select
  proxies:
  - DIRECT
  - REJECT
- name: 漏网之鱼
  type: select
  proxies:
  - DIRECT
  - 节点选择

  # 国家与地区分类, proxy-providers映射到此, 采用url-test, 这个分类上大概自动选择比较好
  # 2023.10.08 我现在觉得select比较好
- name: 香港节点
  type: select
  use:
  - HK
- name: 日本节点
  type: select
  use:
  - JP
- name: 新加坡节点
  type: select
  use:
  - SG
- name: 台湾节点
  type: select
  use:
  - TW
- name: 美国节点
  type: select
  use:
  - US
- name: 韩国节点
  type: select
  use:
  - KR
- name: 大陆节点
  type: select
  use:
  - CN

  # 流媒体与学术等其他分类, proxy-providers映射到此
- name: 解锁节点
  type: select
  use:
  - Unlock
- name: 学术节点
  type: select
  use:
  - CERNET
rules:
  # 白名单
- RULE-SET,UnBan,DIRECT
  # 本地
- RULE-SET,Download,DIRECT
- RULE-SET,LocalAreaNetwork,DIRECT
  # 学术
- RULE-SET,SitesOnlyInSchool,学术网站
- RULE-SET,Scholar,学术网站
  # 其他
- RULE-SET,DnlabChina,大陆网站
- RULE-SET,DnlabAbroad,国外网站
- RULE-SET,HomeBroadband,解锁节点
- RULE-SET,RequestLimit,负载均衡
- RULE-SET,Adobe,国外网站
- RULE-SET,Google,国外网站
- RULE-SET,GoogleCN,大陆网站
- RULE-SET,GoogleFCM,谷歌FCM
- RULE-SET,Microsoft,微软服务
- RULE-SET,OneDrive,微软云盘
- RULE-SET,Telegram,电报消息
  # 游戏
- RULE-SET,Bahamut,巴哈姆特
- RULE-SET,Blizzard,游戏平台
- RULE-SET,Epic,游戏平台
- RULE-SET,Steam,游戏平台
- RULE-SET,SteamCN,大陆网站
- RULE-SET,Xbox,游戏平台
  # 媒体
- RULE-SET,NetEaseMusic,网易云音乐
- RULE-SET,Bilibili,哔哩哔哩
    # bilibili港澳台暂时也用哔哩哔哩
- RULE-SET,BilibiliHMT,哔哩哔哩
- RULE-SET,Netflix,奈飞视频
- RULE-SET,AbemaTV,国外媒体
- RULE-SET,DisneyPlus,国外媒体
- RULE-SET,HBO,国外媒体
- RULE-SET,Sony,国外媒体
- RULE-SET,Spotify,国外媒体
- RULE-SET,YouTube,油管视频
- RULE-SET,ChinaMedia,国内媒体
- RULE-SET,ProxyMedia,国外媒体
  # 购物
- RULE-SET,Amazon,国外网站
- RULE-SET,AmazonIp,国外网站
- RULE-SET,Apple,苹果服务
  # 开发
- RULE-SET,Developer,国外网站
  # 18
- RULE-SET,EHGallery,国外网站
- RULE-SET,Porn,国外网站
  # 国内
- RULE-SET,ChinaCompanyIp,大陆网站
- RULE-SET,ChinaDomain,大陆网站
- RULE-SET,ChinaIp,大陆网站
  # GFW
- RULE-SET,ProxyGFWlist,国外网站
  # 广告
- RULE-SET,BanAD,广告拦截
- RULE-SET,BanEasyList,广告拦截
- RULE-SET,BanEasyListChina,广告拦截
- RULE-SET,BanEasyPrivacy,广告拦截
- RULE-SET,BanProgramAD,广告拦截
  # 必须
- MATCH,漏网之鱼

`;

