module.exports.destroySession = (req,res)=>{
    // resetting cookie to blank
    res.cookie('user_id','');
    return res.redirect('users/sign-in');
}