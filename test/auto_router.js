// do not modify this file, genaratered by api-annotation
var ctrls = {
"./fixtures/syntax/case_001.js": require("./fixtures/syntax/case_001.js"),
"./fixtures/syntax/case_003.js": require("./fixtures/syntax/case_003.js"),
"./fixtures/syntax/case_004.js": require("./fixtures/syntax/case_004.js"),
"./fixtures/syntax/case_005.js": require("./fixtures/syntax/case_005.js"),
"./fixtures/syntax/case_006.js": require("./fixtures/syntax/case_006.js")
};
ctrls["./fixtures/syntax/case_001.js"].hello._security_ = "private"
ctrls["./fixtures/syntax/case_003.js"].hello._security_ = "public"
ctrls["./fixtures/syntax/case_004.js"].hello._security_ = "private"
ctrls["./fixtures/syntax/case_004.js"].hello._security_ = "public"
ctrls["./fixtures/syntax/case_004.js"].hello._security_ = "public"
ctrls["./fixtures/syntax/case_004.js"].hello._security_ = "public"
ctrls["./fixtures/syntax/case_004.js"].hello._security_ = "public"
ctrls["./fixtures/syntax/case_005.js"].hello._security_ = "private"
ctrls["./fixtures/syntax/case_006.js"].test._security_ = "internal"
module.exports = function (router) {

router.get("/api/${version}/hello", ctrls["./fixtures/syntax/case_001.js"].hello);
router.get("/api/${version}/hello", ctrls["./fixtures/syntax/case_003.js"].hello);
router.get("/end_with_flag", ctrls["./fixtures/syntax/case_004.js"].hello);
router.post("/end_with_flag", ctrls["./fixtures/syntax/case_004.js"].hello);
router.put("/end_with_flag", ctrls["./fixtures/syntax/case_004.js"].hello);
router.patch("/end_with_flag", ctrls["./fixtures/syntax/case_004.js"].hello);
router.delete("/end_with_flag", ctrls["./fixtures/syntax/case_004.js"].hello);
router.patch("/end_with_success", ctrls["./fixtures/syntax/case_004.js"].hello);
router.delete("/end_with_json", ctrls["./fixtures/syntax/case_004.js"].hello);
router.post("/end_with_error", ctrls["./fixtures/syntax/case_004.js"].hello);
router.get("/end_with_name", ctrls["./fixtures/syntax/case_004.js"].hello);
router.get("/test", ctrls["./fixtures/syntax/case_005.js"].hello);
router.post("/test", ctrls["./fixtures/syntax/case_005.js"].hello);
router.put("/test", ctrls["./fixtures/syntax/case_005.js"].hello);
router.patch("/test", ctrls["./fixtures/syntax/case_005.js"].hello);
router.delete("/test", ctrls["./fixtures/syntax/case_005.js"].hello);
router.get("/test_security_setting", ctrls["./fixtures/syntax/case_006.js"].test);

};
