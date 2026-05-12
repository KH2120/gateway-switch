// PAC Auto Proxy Config - CN:8080, INT:8888, LAN:DIRECT
function FindProxyForURL(url, host) {
    if (isPlainHostName(host) ||
        shExpMatch(host, "127.*") ||
        shExpMatch(host, "localhost") ||
        shExpMatch(host, "192.168.*") ||
        shExpMatch(host, "10.*") ||
        shExpMatch(host, "172.16.*") ||
        shExpMatch(host, "172.17.*") ||
        shExpMatch(host, "172.18.*") ||
        shExpMatch(host, "172.19.*") ||
        shExpMatch(host, "172.2*") ||
        shExpMatch(host, "172.3*") ||
        shExpMatch(host, "*.local")) {
        return "DIRECT";
    }

    if (host === "47.113.216.116") {
        return "PROXY 192.168.103.145:8080";
    }

    var cn = [".cn","baidu.com","bilibili.com","taobao.com","tmall.com",
        "alibaba.com","alicdn.com","1688.com","jd.com","qq.com",
        "tencent.com","weibo.com","sina.com.cn","douyin.com",
        "toutiao.com","bytedance.com","zhihu.com","163.com",
        "netease.com","sohu.com","csdn.net","aliyun.com",
        "meituan.com","douban.com","ctrip.com","mi.com",
        "huawei.com","ifeng.com","36kr.com","gov.cn",
        "edu.cn","people.com.cn","xinhuanet.com"];

    for (var i = 0; i < cn.length; i++) {
        if (dnsDomainIs(host, cn[i]) || host === cn[i]) {
            return "PROXY 192.168.103.145:8080";
        }
    }

    return "PROXY 192.168.103.145:8888";
}
