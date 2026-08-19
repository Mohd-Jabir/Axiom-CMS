import * as userService from "./user.service.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const profile = await userService.getUserProfile(username);
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await userService.updateProfile(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
// export const changeUsername=()=>{}
// export const changeEmail=()=>{}
export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    await userService.deleteAccount(req.user.id, password);
    res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
export const getUsers = async (req, res, next) => {
  try {
    const users= await userService.getUsers(req.query);
    res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        data: users,
      });
  } catch (error) {
    next(error);
  }
};
export const getUserById = async(req,res,next) => {
    try{
        const user=await userService.getUserById(req.params.id);
         res.status(200).json({
            success: true,
            message: "User fetched successfully.",
            data: user,
        });
    }
    catch(error){
        next(error);
    }
};
export const changeRole =async (req,res,next) => {
    try{
        const user=await userService.changeRole(req.params.id,req.body.role,req.user.id);
        res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            data: user,
        });
    }
    catch(error){
        next(error);
    }
};
// export const suspendUser=()=>{}
