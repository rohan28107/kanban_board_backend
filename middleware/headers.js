function setHeaders(req, res, next){
    res.setHeaders("Access-Control-Allow-Origin", "*");
    res.setHeaders(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeaders("Access-Control-Allow-Headers", "Content-Type", Authorization);
    next();
}

module.exports = setHeaders;