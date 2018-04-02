const { db } = require('../dbconfig/mongoose');
const userDb = db.useDb('user');
const mongoosePaginate = require('./paginate');
const uuid = require('uuid');

// 连接tagsManager表
const userSchema = require('../schema/userSchema');
userSchema.plugin(mongoosePaginate);
const user = userDb.model('user', userSchema);

const returnUserParams = `
    uid
    username
    roles
`;
/**
 * 注册
 * @param {*} email
 */
exports.register = async username => {
    let loginResult = user.save({'username': username});
    return loginResult;
};

/**
 * 登录
 * @param {*} email
 */
exports.loginIncheck = async username => {
    let loginResult = user.find({ 'username': username});
    return loginResult;
};
exports.loginIn = async(username, password) => {
    let loginResult = user.findOne({'username': username, 'password': password});
    return loginResult;
};



/**
 * 查询所有管理员userName
 */
exports.queryUserName = async () => {
    let userResult = user.find({});
    return userResult;
}

/**
 * 查询管理员(支持分页及模糊搜索)
 * @param {*} params
 */
exports.queryAllUser = async params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order == 'ascend' ? 1 : -1,
        };
    };
    let userParams = {
        select: returnUserParams,
        page,
        limit,
        sort,
    };
    const searchParams = ['username', 'roles', 'uid'];
    const searchRules = {};
    searchParams
        .map(param => {
            if (params.querys[param]) {
                return {
                    key: param,
                    value: params.querys[param],
                };
            } else {
                return null;
            }
        })
        .forEach(data => {
            if (data) {
                if (data.key === 'username') {
                    searchRules[data.key] = new RegExp(data.value);
                } else if (data.key === 'roles') {
                    searchRules[data.key] = parseInt(data.value);
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    console.log(searchRules);
    const userInfo = await user.paginate(searchRules, userParams);
    return userInfo;
};

/**
 * 增加管理员
 * @param {*} username
 * @param {*} roles
 */
exports.addManager = async (username, roles) => {
    const newManager = new user({
        uid: uuid(),
        username: username,
        password: '1234',
        roles: [roles],
    });
    const saveRes = await newManager.save();
    return saveRes;
};

exports.checkUserExist = async username => {
    const checkUserExist = await user.find({ 'username': username });
    return checkUserExist;
}

/**
 * 删除管理员
 * @param {*} id
 */
exports.delManager = async uid => {
    const removeRes = await user.remove({ 'uid': uid });
    return removeRes;
}