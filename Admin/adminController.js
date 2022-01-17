const adminService = require("./adminService")


exports.signInHandler = async (req, res, next) => {
    const userInfo = req.body;
    console.log(userInfo)
    /**
     * username
     * password
     */

    // Kiểm tra admin có trong data không
    const result = await adminService.isExistInData(userInfo);

    res.json(result)
}

exports.getAdminData = async (req, res, next) => {
    const userInfo = req.body;
    console.log(userInfo)
    /**
     * user
     */

    // Lấy admin account trong cơ sở dữ liệu 
    const result = await adminService.getAdminData(userInfo);

    res.json(result)
}

exports.getUserData = async (req, res, next) => {
    const userInfo = req.body;
    console.log(userInfo)
    /**
     * user
     */

    // Lấy admin account trong cơ sở dữ liệu 
    const result = await adminService.getUserData(userInfo);

    res.json(result)
}

exports.getClassData = async (req, res, next) => {
    const userInfo = req.body;
    console.log(userInfo)
    /**
     * user
     */

    // Lấy admin account trong cơ sở dữ liệu 
    const result = await adminService.getClassData(userInfo);

    res.json(result)
}

exports.blockuser= async (req, res, next) => {
    const userInfo = req.body.user;
    console.log(userInfo)
    /**
     * _id
     * username
     * password
     * studentId
     * isBlock
     */

    // Xử lý block
    const result = await adminService.blockHandler(userInfo)

    res.json(result)
}

exports.createAdminAccount= async (req, res, next) => {
    const userInfo = req.body.admin;
    console.log(userInfo)
    /**
     * username
     * password
     * email
     */

    // Xử lý create admin account 
    const result = await adminService.createAdminAccount(userInfo)

    if(result === false)
    {
        res.status(404);
        res.json(result)
    }
    else
    {
        res.json(result)
    }
}

exports.getAdminDetailAccount= async (req, res, next) => {
    const _id = req.body._id;
    // Tìm admin có _id
    console.log("getAdmin")
    const result = await adminService.getAdminDetailAccount(_id)

    res.json(result);
}

exports.getUserDetailAccount= async (req, res, next) => {
    const _id = req.body._id;
    // Tìm user có _id
    const result = await adminService.getUserDetailAccount(_id)

    res.json(result);
}

exports.getClassDetailAccount= async (req, res, next) => {
    const _id = req.body._id;
    // Tìm class có _id
    const result = await adminService.getClassDetailAccount(_id)

    res.json(result);
}