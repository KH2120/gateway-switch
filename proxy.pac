// PAC Smart Routing - Ad Block / DIRECT / CN:8080 / INTL:8888
// Reference: Clash Verge rule-based routing

function FindProxyForURL(url, host) {

    // ========================================
    // 1. Ad Block (REJECT → dead proxy)
    // ========================================
    var ad_kw = ["admarvel","admaster","adsage","adsmogo","adsrvmedia","adwords",
        "adservice","domob","duomeng","dwtrack","guanggao","lianmeng","omgmta",
        "openx","partnerad","supersonicads","umeng","zjtoolbar"];
    var ad_sfx = ["appsflyer.com","doubleclick.net","mmstat.com"];

    for (var i = 0; i < ad_kw.length; i++) {
        if (host.indexOf(ad_kw[i]) !== -1) return "PROXY 0.0.0.0:0";
    }
    for (var i = 0; i < ad_sfx.length; i++) {
        if (dnsDomainIs(host, ad_sfx[i]) || host === ad_sfx[i]) return "PROXY 0.0.0.0:0";
    }

    // ========================================
    // 2. Localhost & Plain Hostnames → DIRECT
    // ========================================
    if (isPlainHostName(host)) return "DIRECT";
    if (host === "localhost" || shExpMatch(host, "127.*")) return "DIRECT";

    // ========================================
    // 3. Specific domains → DIRECT
    // ========================================
    if (host === "safebrowsing.urlsec.qq.com") return "PROXY 192.168.103.145:8080";

    // ========================================
    // 4. Google OAuth / antigravity → 8888
    // ========================================
    if (dnsDomainIs(host, "antigravity.google")) return "PROXY 192.168.103.145:8888";

    // ========================================
    // 5. Apple store → 8888 (before Apple 8080)
    // ========================================
    if (dnsDomainIs(host, "apps.apple.com") || host === "apps.apple.com") return "PROXY 192.168.103.145:8888";
    if (dnsDomainIs(host, "itunes.apple.com") || host === "itunes.apple.com") return "PROXY 192.168.103.145:8888";
    if (dnsDomainIs(host, "blobstore.apple.com") || host === "blobstore.apple.com") return "PROXY 192.168.103.145:8888";

    // ========================================
    // 6. 8080 domain suffixes
    // ========================================
    var direct_sfx = [
        "local","localhost",
        "apple.com","apple-cloudkit.com","icloud.com","icloud-content.com",
        "mzstatic.com","aaplimg.com","cdn-apple.com","akadns.net",
        "qq.com","weixin.com","wechat.com","gtimg.com","qcloud.com","myqcloud.com",
        "qpic.cn","tenpay.com","tmall.com","jd.com","360buyimg.com",
        "iqiyi.com","youku.com","ykimg.com","tudou.com","acfun.tv","hdslb.com",
        "sohu.com","sogou.com","zhihu.com","zhimg.com","douban.com","doubanio.com",
        "163.com","126.com","126.net","127.net","yeah.net",
        "sina.com","sinaimg.cn","ximalaya.com","xmcdn.com",
        "csdn.net","gitee.com","jianshu.com","cnblogs.com","oschina.net",
        "ele.me","ctrip.com","suning.com","dianping.com",
        "amap.com","autonavi.com","mi.com","miui.com",
        "ifeng.com","youdao.com","iciba.com","xunlei.com",
        "lanhuapp.com","smzdm.com","sspai.com","36kr.com","speedtest.net",
        "microsoft.com","microsoftonline.com","office.com","office365.com",
        "windows.com","windowsupdate.com","live.com","msn.com",
        "cn"
    ];

    for (var i = 0; i < direct_sfx.length; i++) {
        if (dnsDomainIs(host, direct_sfx[i]) || host === direct_sfx[i]) return "PROXY 192.168.103.145:8080";
    }

    // ========================================
    // 7. 8080 domain keywords
    // ========================================
    var direct_kw = ["baidu","alibaba","alicdn","alipay","taobao","tencent",
        "bilibili","weibo","douyin","bytedance","xiaomi","huawei","netease",
        "meituan","pinduoduo","kuaishou","jingdong","officecdn","-cn"];

    for (var i = 0; i < direct_kw.length; i++) {
        if (host.indexOf(direct_kw[i]) !== -1) return "PROXY 192.168.103.145:8080";
    }

    // ========================================
    // 8. Private/LAN IPs → DIRECT
    // ========================================
    if (shExpMatch(host, "10.*") || shExpMatch(host, "17.*") ||
        shExpMatch(host, "127.*") || shExpMatch(host, "192.168.*") ||
        shExpMatch(host, "224.*")) {
        return "DIRECT";
    }

    if (isResolvable(host)) {
        var ip = dnsResolve(host);
        if (ip) {
            if (isInNet(ip, "10.0.0.0", "255.0.0.0") ||
                isInNet(ip, "17.0.0.0", "255.0.0.0") ||
                isInNet(ip, "100.64.0.0", "255.192.0.0") ||
                isInNet(ip, "127.0.0.0", "255.0.0.0") ||
                isInNet(ip, "172.16.0.0", "255.240.0.0") ||
                isInNet(ip, "192.168.0.0", "255.255.0.0") ||
                isInNet(ip, "198.18.0.0", "255.255.0.0") ||
                isInNet(ip, "224.0.0.0", "240.0.0.0")) {
                return "DIRECT";
            }
        }
    }

    // ========================================
    // 9. Known CN domains → 8080
    // ========================================
    var cn_domains = [
        "baidu.com","bilibili.com","taobao.com","tmall.com","alibaba.com",
        "alicdn.com","1688.com","jd.com","qq.com","tencent.com",
        "weibo.com","sina.com.cn","douyin.com","toutiao.com","bytedance.com",
        "zhihu.com","163.com","netease.com","sohu.com","csdn.net","aliyun.com",
        "meituan.com","douban.com","ctrip.com","mi.com","huawei.com",
        "ifeng.com","36kr.com","gov.cn","edu.cn","people.com.cn","xinhuanet.com",
        "suning.com","dianping.com","ele.me","jianshu.com","cnblogs.com",
        "oschina.net","gitee.com","smzdm.com","ximalaya.com"
    ];

    for (var i = 0; i < cn_domains.length; i++) {
        if (dnsDomainIs(host, cn_domains[i]) || host === cn_domains[i]) {
            return "PROXY 192.168.103.145:8080";
        }
    }

    // ========================================
    // 10. Everything else → 8888 (International)
    // ========================================
    return "PROXY 192.168.103.145:8888";
}
